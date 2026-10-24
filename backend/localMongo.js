/**
 * HackSphere In-Memory MongoDB Server (Pure Node.js + BSON)
 * Implements standard MongoDB wire protocol (OP_QUERY + OP_MSG)
 * Enables offline local testing of Experiment 4 CRUD APIs with Mongoose
 * without requiring MongoDB Atlas or external MongoDB service.
 */

const net = require("net");
const BSON = require("bson");

const collections = new Map();

function getCollection(name) {
  if (!collections.has(name)) {
    collections.set(name, []);
  }
  return collections.get(name);
}

function matchDoc(doc, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const [key, val] of Object.entries(filter)) {
    if (key === "_id") {
      const docId = doc._id ? doc._id.toString() : null;
      const valId = val && val.toString ? val.toString() : String(val);
      if (docId !== valId) return false;
    } else {
      if (doc[key] !== val) return false;
    }
  }
  return true;
}

function sendOpReply(socket, reqId, doc) {
  const docBuf = BSON.serialize(doc);
  const reply = Buffer.alloc(36 + docBuf.length);
  reply.writeInt32LE(reply.length, 0);
  reply.writeInt32LE((Date.now() & 0x7fffffff) || 1, 4);
  reply.writeInt32LE(reqId, 8);
  reply.writeInt32LE(1, 12); // OP_REPLY
  reply.writeInt32LE(0, 16); // flags
  reply.writeBigInt64LE(0n, 20); // cursorId
  reply.writeInt32LE(0, 28); // startingFrom
  reply.writeInt32LE(1, 32); // numberReturned
  docBuf.copy(reply, 36);
  socket.write(reply);
}

function sendOpMsg(socket, reqId, doc) {
  const docBuf = BSON.serialize(doc);
  const reply = Buffer.alloc(16 + 4 + 1 + docBuf.length);
  reply.writeInt32LE(reply.length, 0);
  reply.writeInt32LE((Date.now() & 0x7fffffff) || 1, 4);
  reply.writeInt32LE(reqId, 8);
  reply.writeInt32LE(2013, 12); // OP_MSG
  reply.writeUInt32LE(0, 16); // flags
  reply.writeUInt8(0, 20); // section kind 0 (body)
  docBuf.copy(reply, 21);
  socket.write(reply);
}

function handleMessage(socket, msg) {
  const reqId = msg.readInt32LE(4);
  const op = msg.readInt32LE(12);

  // 1. OP_QUERY (Handshake / isMaster)
  if (op === 2004) {
    sendOpReply(socket, reqId, {
      isWritablePrimary: true,
      ismaster: true,
      ok: 1,
      maxBsonObjectSize: 16777216,
      maxMessageSizeBytes: 48000000,
      maxWriteBatchSize: 100000,
      logicalSessionTimeoutMinutes: 30,
      minWireVersion: 0,
      maxWireVersion: 21,
    });
    return;
  }

  // 2. OP_MSG (Commands)
  if (op === 2013) {
    let doc;
    try {
      doc = BSON.deserialize(msg.subarray(21));
    } catch (e) {
      sendOpMsg(socket, reqId, { ok: 0, errmsg: e.message });
      return;
    }

    const cmd = Object.keys(doc)[0];

    // Handshake commands
    if (cmd === "hello" || cmd === "isMaster" || cmd === "ismaster") {
      sendOpMsg(socket, reqId, {
        isWritablePrimary: true,
        ismaster: true,
        ok: 1,
        minWireVersion: 0,
        maxWireVersion: 21,
        maxBsonObjectSize: 16777216,
        maxMessageSizeBytes: 48000000,
        maxWriteBatchSize: 100000,
        logicalSessionTimeoutMinutes: 30,
      });
      return;
    }

    if (cmd === "buildInfo" || cmd === "buildinfo") {
      sendOpMsg(socket, reqId, {
        version: "7.0.0",
        gitVersion: "mock",
        modules: [],
        ok: 1,
      });
      return;
    }

    if (cmd === "createIndexes" || cmd === "indexes") {
      sendOpMsg(socket, reqId, { numIndexesBefore: 1, numIndexesAfter: 2, ok: 1 });
      return;
    }

    // CRUD: INSERT
    if (cmd === "insert") {
      const coll = getCollection(doc.insert);
      const docs = doc.documents || [];
      for (const d of docs) {
        if (!d._id) {
          d._id = new BSON.ObjectId();
        }
        coll.push(d);
      }
      sendOpMsg(socket, reqId, { n: docs.length, ok: 1 });
      return;
    }

    // CRUD: FIND
    if (cmd === "find") {
      const coll = getCollection(doc.find);
      const filter = doc.filter || {};
      const results = coll.filter((item) => matchDoc(item, filter));
      sendOpMsg(socket, reqId, {
        cursor: {
          id: 0n,
          ns: `${doc.$db || "HackSphereDB"}.${doc.find}`,
          firstBatch: results,
        },
        ok: 1,
      });
      return;
    }

    // CRUD: FIND AND MODIFY (used by findByIdAndUpdate and findByIdAndDelete)
    if (cmd === "findAndModify") {
      const coll = getCollection(doc.findAndModify);
      const query = doc.query || {};
      const idx = coll.findIndex((item) => matchDoc(item, query));

      if (idx === -1) {
        sendOpMsg(socket, reqId, { lastErrorObject: { n: 0, updatedExisting: false }, value: null, ok: 1 });
        return;
      }

      if (doc.remove) {
        const [removed] = coll.splice(idx, 1);
        sendOpMsg(socket, reqId, { lastErrorObject: { n: 1 }, value: removed, ok: 1 });
        return;
      }

      if (doc.update) {
        const existing = coll[idx];
        const update = doc.update;
        let updatedDoc = { ...existing };

        if (update.$set) {
          Object.assign(updatedDoc, update.$set);
        } else {
          Object.assign(updatedDoc, update);
        }

        if (update.$currentDate || !updatedDoc.updatedAt) {
          updatedDoc.updatedAt = new Date();
        }

        coll[idx] = updatedDoc;
        const returnDoc = doc.new ? updatedDoc : existing;
        sendOpMsg(socket, reqId, { lastErrorObject: { n: 1, updatedExisting: true }, value: returnDoc, ok: 1 });
        return;
      }
    }

    // CRUD: DELETE
    if (cmd === "delete") {
      const coll = getCollection(doc.delete);
      const deletes = doc.deletes || [];
      let deletedCount = 0;
      for (const d of deletes) {
        const q = d.q || {};
        const limit = d.limit || 0;
        let count = 0;
        for (let i = coll.length - 1; i >= 0; i--) {
          if (matchDoc(coll[i], q)) {
            coll.splice(i, 1);
            deletedCount++;
            count++;
            if (limit === 1 && count >= 1) break;
          }
        }
      }
      sendOpMsg(socket, reqId, { n: deletedCount, ok: 1 });
      return;
    }

    // Fallback OK
    sendOpMsg(socket, reqId, { ok: 1 });
  }
}

function startLocalMongo(port = 27017) {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      let buffer = Buffer.alloc(0);
      socket.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        while (buffer.length >= 16) {
          const length = buffer.readInt32LE(0);
          if (buffer.length < length) break;
          const msg = buffer.subarray(0, length);
          buffer = buffer.subarray(length);
          handleMessage(socket, msg);
        }
      });
      socket.on("error", () => {});
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} already in use. Assuming MongoDB is already active.`);
        resolve(null);
      } else {
        reject(err);
      }
    });

    server.listen(port, "127.0.0.1", () => {
      console.log(`Local MongoDB Server running at mongodb://127.0.0.1:${port}/HackSphereDB`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startLocalMongo().then(() => {
    console.log("Ready to accept connections. Press Ctrl+C to stop.");
  });
}

module.exports = { startLocalMongo, collections };
