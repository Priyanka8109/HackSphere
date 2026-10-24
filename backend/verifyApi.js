const http = require("http");

function request(options, data = null) {
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
        resolve({ status: res.statusCode, headers: res.headers, data: parsed });
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("STARTING HACKSPHERE REST API CRUD VERIFICATION");
  console.log("==================================================");

  // Test 1: Base Route
  console.log("\n[TEST 1] GET / (Root Health Check)");
  const baseRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/",
    method: "GET",
  });
  console.log(`Status: ${baseRes.status}`);
  console.log(`Response: ${baseRes.data}`);
  if (baseRes.data !== "HackSphere API is Running") {
    throw new Error("Base route failed");
  }

  // Test 2: CREATE Hackathon (POST)
  console.log("\n[TEST 2] POST /api/hackathons (Create Hackathon)");
  const sampleHackathon = {
    name: "AI Innovation Challenge 2026",
    description: "Build innovative AI solutions for real-world problems.",
    category: "Artificial Intelligence",
    date: "2026-10-15",
    duration: 36,
    participants: 120,
    status: "Open",
    prize: "₹50,000",
  };

  const createRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/hackathons",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    sampleHackathon
  );

  console.log(`Status: ${createRes.status}`);
  console.log("Created Document:", JSON.stringify(createRes.data, null, 2));
  const createdId = createRes.data._id;
  if (!createdId) throw new Error("POST did not return _id");

  // Test 3: GET ALL Hackathons (GET)
  console.log("\n[TEST 3] GET /api/hackathons (Get All Hackathons)");
  const getAllRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/hackathons",
    method: "GET",
  });
  console.log(`Status: ${getAllRes.status}`);
  console.log(`Total Hackathons: ${getAllRes.data.length}`);
  console.log("First Hackathon Name:", getAllRes.data[0].name);
  if (!Array.isArray(getAllRes.data) || getAllRes.data.length === 0) {
    throw new Error("GET ALL failed");
  }

  // Test 4: GET Hackathon BY ID (GET)
  console.log(`\n[TEST 4] GET /api/hackathons/${createdId} (Get by ID)`);
  const getByIdRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/hackathons/${createdId}`,
    method: "GET",
  });
  console.log(`Status: ${getByIdRes.status}`);
  console.log("Fetched Hackathon:", JSON.stringify(getByIdRes.data, null, 2));
  if (getByIdRes.data._id !== createdId) throw new Error("GET by ID failed");

  // Test 5: UPDATE Hackathon (PUT)
  console.log(`\n[TEST 5] PUT /api/hackathons/${createdId} (Update Hackathon)`);
  const updateData = {
    status: "Completed",
    participants: 150,
  };

  const updateRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: `/api/hackathons/${createdId}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    },
    updateData
  );
  console.log(`Status: ${updateRes.status}`);
  console.log("Updated Document:", JSON.stringify(updateRes.data, null, 2));
  if (updateRes.data.status !== "Completed" || updateRes.data.participants !== 150) {
    throw new Error("PUT update failed");
  }

  // Test 6: DELETE Hackathon (DELETE)
  console.log(`\n[TEST 6] DELETE /api/hackathons/${createdId} (Delete Hackathon)`);
  const deleteRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/hackathons/${createdId}`,
    method: "DELETE",
  });
  console.log(`Status: ${deleteRes.status}`);
  console.log("Delete Response:", JSON.stringify(deleteRes.data, null, 2));
  if (deleteRes.data.message !== "Hackathon deleted successfully") {
    throw new Error("DELETE failed");
  }

  // Test 7: Verify 404 after deletion
  console.log(`\n[TEST 7] GET /api/hackathons/${createdId} after delete (Expect 404)`);
  const getAfterDeleteRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/hackathons/${createdId}`,
    method: "GET",
  });
  console.log(`Status: ${getAfterDeleteRes.status}`);
  console.log("404 Response:", JSON.stringify(getAfterDeleteRes.data, null, 2));
  if (getAfterDeleteRes.status !== 404) {
    throw new Error("Expected 404 for deleted hackathon");
  }

  console.log("\n==================================================");
  console.log("ALL 5 CRUD API ENDPOINTS VERIFIED AND PASSING!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
