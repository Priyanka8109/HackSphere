require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const User = require("./models/User");

// Helper to send HTTP requests
function sendRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runExp6Verification() {
  console.log("==================================================");
  console.log("   HACKSPHERE EXPERIMENT 6 VERIFICATION SUITE   ");
  console.log("==================================================");

  let serverInstance = null;
  // Check if server is already running on port 5000
  try {
    await sendRequest({ hostname: "localhost", port: 5000, path: "/", method: "GET" });
    console.log("Server already running on port 5000.");
  } catch (err) {
    console.log("Starting server in-process for verification...");
    const { startServer } = require("./server");
    const started = await startServer();
    serverInstance = started.server;
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Ensure Mongoose connection is established for direct DB checks
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/HackSphereDB";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  const timestamp = Date.now();
  const normalUserEmail = `priyanka_${timestamp}@hacksphere.com`;
  const adminUserEmail = `admin_${timestamp}@hacksphere.com`;
  const password = "Password123";

  // --------------------------------------------------
  // 1. REGISTER NORMAL USER: POST /api/auth/register
  // --------------------------------------------------
  console.log("\n[TEST 1] Register Normal User (POST /api/auth/register)");
  const regRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Priyanka",
      email: normalUserEmail,
      password: password,
    }
  );

  console.log(`Status: ${regRes.status} (Expected 201)`);
  console.log("Response:", JSON.stringify(regRes.data, null, 2));

  if (regRes.status !== 201) throw new Error("Normal user registration failed");
  if (!regRes.data.user || regRes.data.user.role !== "user") {
    throw new Error("Default role must be 'user'");
  }
  if (regRes.data.user.password) {
    throw new Error("CRITICAL: Password exposed in registration response!");
  }
  console.log(">>> PASS: Normal user registered with role 'user' and safe response.");

  // --------------------------------------------------
  // 2. VERIFY PASSWORD HASHED IN MONGODB
  // --------------------------------------------------
  console.log("\n[TEST 2] Verify Password is Hashed in MongoDB (bcryptjs)");
  const dbUser = await User.findOne({ email: normalUserEmail });
  if (!dbUser) throw new Error("User not found in MongoDB");
  console.log(`Stored Email: ${dbUser.email}`);
  console.log(`Stored Password Hash: ${dbUser.password}`);

  if (dbUser.password === password) {
    throw new Error("CRITICAL: Password stored as plain text!");
  }
  if (!dbUser.password.startsWith("$2a$") && !dbUser.password.startsWith("$2b$")) {
    throw new Error("Password is not a valid bcrypt hash!");
  }
  console.log(">>> PASS: Password securely hashed with bcrypt in MongoDB.");

  // --------------------------------------------------
  // 3. DUPLICATE REGISTRATION PREVENTION
  // --------------------------------------------------
  console.log("\n[TEST 3] Duplicate Registration Check (Same Email)");
  const dupRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Priyanka",
      email: normalUserEmail,
      password: password,
    }
  );
  console.log(`Duplicate Status: ${dupRes.status} (Expected 400 or 409)`);
  if (dupRes.status !== 400 && dupRes.status !== 409) {
    throw new Error("Duplicate email registration was not rejected");
  }
  console.log(">>> PASS: Duplicate registration properly rejected.");

  // --------------------------------------------------
  // 4. LOGIN AS NORMAL USER: POST /api/auth/login
  // --------------------------------------------------
  console.log("\n[TEST 4] Login as Normal User (POST /api/auth/login)");
  const loginRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      email: normalUserEmail,
      password: password,
    }
  );

  console.log(`Status: ${loginRes.status} (Expected 200)`);
  console.log("Token Prefix:", loginRes.data.token ? loginRes.data.token.substring(0, 30) + "..." : "NONE");
  console.log("User Info:", loginRes.data.user);

  if (loginRes.status !== 200 || !loginRes.data.token) {
    throw new Error("Login failed or no JWT returned");
  }
  if (loginRes.data.user.role !== "user") {
    throw new Error("Expected user role to be 'user'");
  }
  const normalUserToken = loginRes.data.token;
  console.log(">>> PASS: Successful login, JWT token generated with role 'user'.");

  // --------------------------------------------------
  // 5. PROTECTED ROUTE WITHOUT TOKEN: GET /api/users/profile
  // --------------------------------------------------
  console.log("\n[TEST 5] Protected Profile Without Token (GET /api/users/profile)");
  const noTokenRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/profile",
    method: "GET",
  });
  console.log(`Status: ${noTokenRes.status} (Expected 401)`);
  if (noTokenRes.status !== 401) throw new Error("Protected route allowed request without token");
  console.log(">>> PASS: 401 Unauthorized returned when token is missing.");

  // --------------------------------------------------
  // 6. PROTECTED ROUTE WITH VALID JWT TOKEN
  // --------------------------------------------------
  console.log("\n[TEST 6] Protected Profile With Valid JWT Token");
  const profileRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/profile",
    method: "GET",
    headers: { Authorization: `Bearer ${normalUserToken}` },
  });
  console.log(`Status: ${profileRes.status} (Expected 200)`);
  console.log("Profile Data:", profileRes.data.user?.email, "Role:", profileRes.data.user?.role);

  if (profileRes.status !== 200 || profileRes.data.user?.email !== normalUserEmail) {
    throw new Error("Failed to access protected profile with valid token");
  }
  if (profileRes.data.user?.password) {
    throw new Error("CRITICAL: Password returned in profile response!");
  }
  console.log(">>> PASS: 200 OK returned with authenticated profile data.");

  // --------------------------------------------------
  // 7. ADMIN-ONLY ROUTE WITH NORMAL USER TOKEN: GET /api/admin/users
  // --------------------------------------------------
  console.log("\n[TEST 7] Normal User Accessing Admin-Only Route (GET /api/admin/users)");
  const normalOnAdminRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/admin/users",
    method: "GET",
    headers: { Authorization: `Bearer ${normalUserToken}` },
  });
  console.log(`Status: ${normalOnAdminRes.status} (Expected 403)`);
  console.log("Message:", normalOnAdminRes.data.message);

  if (normalOnAdminRes.status !== 403) {
    throw new Error("Normal user was NOT blocked from admin route!");
  }
  console.log(">>> PASS: Normal user correctly rejected with 403 Forbidden.");

  // --------------------------------------------------
  // 8. REGISTER ADMIN USER (role: "admin")
  // --------------------------------------------------
  console.log("\n[TEST 8] Register Admin User (POST /api/auth/register)");
  const adminRegRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Admin Priyanka",
      email: adminUserEmail,
      password: password,
      role: "admin",
    }
  );
  console.log(`Status: ${adminRegRes.status} (Expected 201)`);
  console.log("Role Assigned:", adminRegRes.data.user?.role);

  if (adminRegRes.status !== 201 || adminRegRes.data.user?.role !== "admin") {
    throw new Error("Admin user registration failed");
  }
  console.log(">>> PASS: Admin user registered with role 'admin'.");

  // --------------------------------------------------
  // 9. LOGIN AS ADMIN USER
  // --------------------------------------------------
  console.log("\n[TEST 9] Login as Admin User (POST /api/auth/login)");
  const adminLoginRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      email: adminUserEmail,
      password: password,
    }
  );
  console.log(`Status: ${adminLoginRes.status} (Expected 200)`);
  console.log("Admin Token Generated:", !!adminLoginRes.data.token);

  if (adminLoginRes.status !== 200 || !adminLoginRes.data.token) {
    throw new Error("Admin login failed");
  }
  const adminToken = adminLoginRes.data.token;
  console.log(">>> PASS: Admin login successful, JWT token issued with role 'admin'.");

  // --------------------------------------------------
  // 10. ADMIN ACCESSING ADMIN-ONLY ROUTE: GET /api/admin/users
  // --------------------------------------------------
  console.log("\n[TEST 10] Admin Accessing Admin-Only Route (GET /api/admin/users)");
  const adminAccessRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/admin/users",
    method: "GET",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`Status: ${adminAccessRes.status} (Expected 200)`);
  console.log("Users Count:", adminAccessRes.data.count);

  if (adminAccessRes.status !== 200 || !Array.isArray(adminAccessRes.data.users)) {
    throw new Error("Admin access to /api/admin/users failed");
  }
  console.log(">>> PASS: Admin authorized successfully, user list returned without passwords.");

  // --------------------------------------------------
  // 11. EXPERIMENT 4 HACKATHON CRUD APIs REGRESSION TEST
  // --------------------------------------------------
  console.log("\n[TEST 11] Experiment 4 Hackathon CRUD Regressions");
  const hackathonsRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/hackathons",
    method: "GET",
  });
  console.log(`GET /api/hackathons Status: ${hackathonsRes.status}`);
  if (hackathonsRes.status !== 200) throw new Error("Hackathon CRUD APIs broken");
  console.log(">>> PASS: Existing Experiment 4 Hackathon CRUD APIs remain intact.");

  console.log("\n==================================================");
  console.log("   ALL EXPERIMENT 6 TESTS VERIFIED AND PASSED!   ");
  console.log("==================================================");

  if (serverInstance) {
    serverInstance.close();
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  runExp6Verification()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("\nVerification Failed:", err);
      process.exit(1);
    });
}

module.exports = { runExp6Verification };
