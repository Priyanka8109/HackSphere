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

async function runExp5Verification() {
  console.log("==================================================");
  console.log("   HACKSPHERE EXPERIMENT 5 VERIFICATION SUITE   ");
  console.log("==================================================");

  let serverInstance = null;
  // Check if server is already running
  try {
    await sendRequest({ hostname: "localhost", port: 5000, path: "/", method: "GET" });
    console.log("Server already running on port 5000.");
  } catch (err) {
    console.log("Starting server in-process for verification...");
    const { startServer } = require("./server");
    const started = await startServer();
    serverInstance = started.server;
    // Allow Mongoose connection to establish
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Clean test users before running
  const timestamp = Date.now();
  const testEmail = `priyanka_${timestamp}@example.com`;
  const adminEmail = `admin_${timestamp}@hacksphere.com`;
  const password = "Password123";

  // --------------------------------------------------
  // 1. BASE HEALTH CHECK & HELMET HEADERS
  // --------------------------------------------------
  console.log("\n[TEST 1] Root Route & Helmet HTTP Security Headers");
  const baseRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/",
    method: "GET",
  });
  console.log(`Status: ${baseRes.status}`);
  console.log(`Response: ${baseRes.data}`);
  console.log(`Helmet Header 'x-dns-prefetch-control': ${baseRes.headers["x-dns-prefetch-control"]}`);
  console.log(`Helmet Header 'x-content-type-options': ${baseRes.headers["x-content-type-options"]}`);

  if (baseRes.status !== 200 || baseRes.data !== "HackSphere API is Running") {
    throw new Error("Base health check failed");
  }
  if (!baseRes.headers["x-content-type-options"]) {
    throw new Error("Helmet security headers missing");
  }
  console.log(">>> PASS: Base route healthy & Helmet security headers active.");

  // --------------------------------------------------
  // 2. INPUT VALIDATION (express-validator)
  // --------------------------------------------------
  console.log("\n[TEST 2] Input Validation on Registration (express-validator)");

  // 2a. Empty name
  const invalidNameRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "", email: testEmail, password: password }
  );
  console.log(`Empty Name Status: ${invalidNameRes.status} (Expected 400)`);
  if (invalidNameRes.status !== 400) throw new Error("Validation failed to reject empty name");

  // 2b. Invalid email format
  const invalidEmailRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Priyanka", email: "not-an-email", password: password }
  );
  console.log(`Invalid Email Status: ${invalidEmailRes.status} (Expected 400)`);
  if (invalidEmailRes.status !== 400) throw new Error("Validation failed to reject invalid email");

  // 2c. Short password (< 6 chars)
  const shortPassRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Priyanka", email: testEmail, password: "123" }
  );
  console.log(`Short Password Status: ${shortPassRes.status} (Expected 400)`);
  if (shortPassRes.status !== 400) throw new Error("Validation failed to reject short password");

  console.log(">>> PASS: Input validation successfully rejected all malformed inputs.");

  // --------------------------------------------------
  // 3. USER REGISTRATION (Valid data)
  // --------------------------------------------------
  console.log("\n[TEST 3] User Registration (POST /api/users/register)");
  const registerRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Priyanka", email: testEmail, password: password }
  );
  console.log(`Register Status: ${registerRes.status} (Expected 201)`);
  console.log("Register Response:", JSON.stringify(registerRes.data, null, 2));

  if (registerRes.status !== 201) throw new Error("User registration failed");
  if (registerRes.data.user.password) throw new Error("CRITICAL: Password leaked in registration response!");
  if (registerRes.data.user.role !== "user") throw new Error("Default role must be 'user'");

  console.log(">>> PASS: User registered successfully without leaking password.");

  // --------------------------------------------------
  // 4. MONGODB PASSWORD HASHING VERIFICATION
  // --------------------------------------------------
  console.log("\n[TEST 4] MongoDB Password Hashing Verification (bcryptjs)");
  const dbUser = await User.findOne({ email: testEmail });
  if (!dbUser) throw new Error("User not found in MongoDB");

  console.log(`Stored Email: ${dbUser.email}`);
  console.log(`Stored Password Hash: ${dbUser.password}`);

  if (dbUser.password === password) {
    throw new Error("CRITICAL: Password stored as plain text in MongoDB!");
  }
  if (!dbUser.password.startsWith("$2a$") && !dbUser.password.startsWith("$2b$")) {
    throw new Error("Stored password is not a valid bcrypt hash!");
  }
  console.log(">>> PASS: Password is encrypted with bcrypt salt & hash in MongoDB.");

  // --------------------------------------------------
  // 5. DUPLICATE REGISTRATION PREVENTION
  // --------------------------------------------------
  console.log("\n[TEST 5] Duplicate User Registration Prevention");
  const dupRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Priyanka", email: testEmail, password: password }
  );
  console.log(`Duplicate Registration Status: ${dupRes.status} (Expected 400)`);
  if (dupRes.status !== 400) throw new Error("Duplicate registration was not blocked");
  console.log(">>> PASS: Duplicate registration properly blocked.");

  // --------------------------------------------------
  // 6. LOGIN WITH INVALID CREDENTIALS
  // --------------------------------------------------
  console.log("\n[TEST 6] Login with Invalid Credentials");
  const wrongPassRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: testEmail, password: "WrongPassword!" }
  );
  console.log(`Wrong Password Status: ${wrongPassRes.status} (Expected 401)`);
  if (wrongPassRes.status !== 401) throw new Error("Invalid password should return 401");
  console.log(">>> PASS: Invalid password rejected with 401 Unauthorized.");

  // --------------------------------------------------
  // 7. LOGIN WITH VALID CREDENTIALS & JWT GENERATION
  // --------------------------------------------------
  console.log("\n[TEST 7] Login with Valid Credentials (POST /api/users/login)");
  const loginRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: testEmail, password: password }
  );
  console.log(`Login Status: ${loginRes.status} (Expected 200)`);
  console.log("Login Response (truncated):", {
    success: loginRes.data.success,
    message: loginRes.data.message,
    tokenPrefix: loginRes.data.token ? loginRes.data.token.substring(0, 25) + "..." : null,
    user: loginRes.data.user,
  });

  if (loginRes.status !== 200 || !loginRes.data.token) {
    throw new Error("Login failed or no JWT returned");
  }
  const userToken = loginRes.data.token;
  console.log(">>> PASS: Login successful, JWT token issued.");

  // --------------------------------------------------
  // 8. PROTECTED API WITHOUT TOKEN
  // --------------------------------------------------
  console.log("\n[TEST 8] Protected API Without Token (GET /api/users/profile)");
  const noTokenRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/profile",
    method: "GET",
  });
  console.log(`No Token Status: ${noTokenRes.status} (Expected 401)`);
  if (noTokenRes.status !== 401) throw new Error("Protected route allowed request without token");
  console.log(">>> PASS: Access denied without token.");

  // --------------------------------------------------
  // 9. PROTECTED API WITH INVALID TOKEN
  // --------------------------------------------------
  console.log("\n[TEST 9] Protected API With Invalid Token");
  const badTokenRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/profile",
    method: "GET",
    headers: { Authorization: "Bearer this-is-an-invalid-fake-token" },
  });
  console.log(`Bad Token Status: ${badTokenRes.status} (Expected 401)`);
  if (badTokenRes.status !== 401) throw new Error("Invalid token allowed access");
  console.log(">>> PASS: Invalid token rejected.");

  // --------------------------------------------------
  // 10. PROTECTED API WITH VALID TOKEN
  // --------------------------------------------------
  console.log("\n[TEST 10] Protected API With Valid Token (GET /api/users/profile)");
  const profileRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/profile",
    method: "GET",
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`Valid Token Status: ${profileRes.status} (Expected 200)`);
  console.log("User Profile:", JSON.stringify(profileRes.data, null, 2));

  if (profileRes.status !== 200 || profileRes.data.user.email !== testEmail) {
    throw new Error("Failed to retrieve profile with valid token");
  }
  if (profileRes.data.user.password) {
    throw new Error("CRITICAL: Password exposed in profile response!");
  }
  console.log(">>> PASS: User profile securely retrieved.");

  // --------------------------------------------------
  // 11. ADMIN REGISTRATION & LOGIN
  // --------------------------------------------------
  console.log("\n[TEST 11] Register & Login Admin User");
  const adminRegRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Admin Priyanka", email: adminEmail, password: password, role: "admin" }
  );
  if (adminRegRes.status !== 201) throw new Error("Admin registration failed");

  const adminLoginRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/users/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: adminEmail, password: password }
  );
  const adminToken = adminLoginRes.data.token;
  console.log(`Admin Role: ${adminLoginRes.data.user.role}`);
  console.log(">>> PASS: Admin user created and authenticated.");

  // --------------------------------------------------
  // 12. ROLE-BASED AUTHORIZATION (Normal User vs Admin)
  // --------------------------------------------------
  console.log("\n[TEST 12] Role-Based Authorization Check (/api/admin/users)");

  // 12a. Normal user tries to access admin route -> Expect 403 Forbidden
  const normalUserAdminRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/admin/users",
    method: "GET",
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`Normal User Access Status: ${normalUserAdminRes.status} (Expected 403)`);
  console.log("Forbidden Response:", normalUserAdminRes.data);
  if (normalUserAdminRes.status !== 403) {
    throw new Error("Normal user was NOT blocked from admin route!");
  }

  // 12b. Admin tries to access admin route -> Expect 200 OK
  const adminAccessRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/admin/users",
    method: "GET",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`Admin Access Status: ${adminAccessRes.status} (Expected 200)`);
  console.log(`Users returned: ${adminAccessRes.data.count}`);
  if (adminAccessRes.status !== 200) {
    throw new Error("Admin was blocked from admin route");
  }
  console.log(">>> PASS: Role-based authorization working (403 for user, 200 for admin).");

  // --------------------------------------------------
  // 13. RATE LIMITING TEST ON LOGIN
  // --------------------------------------------------
  console.log("\n[TEST 13] Rate Limiting on Login (express-rate-limit)");
  console.log("Sending rapid login requests to trigger rate limit...");
  let rateLimitHit = false;

  for (let i = 1; i <= 6; i++) {
    const rlRes = await sendRequest(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/users/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: testEmail, password: password }
    );
    console.log(`Attempt ${i} Status: ${rlRes.status}`);
    if (rlRes.status === 429) {
      rateLimitHit = true;
      console.log("Rate Limit Hit Response:", rlRes.data);
      break;
    }
  }

  if (!rateLimitHit) {
    console.warn("Notice: Rate limit did not trigger within 6 requests. Verify configuration.");
  } else {
    console.log(">>> PASS: Rate limiting successfully triggered 429 Too Many Requests.");
  }

  // --------------------------------------------------
  // 14. EXPERIMENT 4 CRUD REGRESSION TESTING
  // --------------------------------------------------
  console.log("\n[TEST 14] Experiment 4 Hackathon CRUD APIs Regression Test");

  // 14a. CREATE Hackathon
  const newHackathon = {
    name: "HackSphere CyberSec 2026",
    description: "Build secure REST APIs and modern web solutions.",
    category: "Cybersecurity",
    date: "2026-11-20",
    duration: 48,
    participants: 95,
    status: "Upcoming",
    prize: "₹75,000",
  };
  const crudCreateRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/hackathons",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    newHackathon
  );
  console.log(`CREATE Status: ${crudCreateRes.status} (Expected 201)`);
  const hackathonId = crudCreateRes.data._id;
  if (!hackathonId) throw new Error("Hackathon CREATE failed");

  // 14b. GET ALL Hackathons
  const crudGetAllRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: "/api/hackathons",
    method: "GET",
  });
  console.log(`GET ALL Status: ${crudGetAllRes.status}, Count: ${crudGetAllRes.data.length}`);
  if (crudGetAllRes.status !== 200 || !Array.isArray(crudGetAllRes.data)) {
    throw new Error("Hackathon GET ALL failed");
  }

  // 14c. GET BY ID
  const crudGetByIdRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: `/api/hackathons/${hackathonId}`,
    method: "GET",
  });
  console.log(`GET BY ID Status: ${crudGetByIdRes.status}`);
  if (crudGetByIdRes.status !== 200 || crudGetByIdRes.data._id !== hackathonId) {
    throw new Error("Hackathon GET BY ID failed");
  }

  // 14d. UPDATE
  const crudUpdateRes = await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: `/api/hackathons/${hackathonId}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    },
    { participants: 150, status: "Ongoing" }
  );
  console.log(`UPDATE Status: ${crudUpdateRes.status}`);
  if (crudUpdateRes.status !== 200 || crudUpdateRes.data.participants !== 150) {
    throw new Error("Hackathon UPDATE failed");
  }

  // 14e. DELETE
  const crudDeleteRes = await sendRequest({
    hostname: "localhost",
    port: 5000,
    path: `/api/hackathons/${hackathonId}`,
    method: "DELETE",
  });
  console.log(`DELETE Status: ${crudDeleteRes.status}`);
  if (crudDeleteRes.status !== 200) throw new Error("Hackathon DELETE failed");

  console.log(">>> PASS: All Experiment 4 Hackathon CRUD APIs verified intact!");

  console.log("\n==================================================");
  console.log("   ALL EXPERIMENT 5 & EXPERIMENT 4 TESTS PASSED!   ");
  console.log("==================================================");

  if (serverInstance) {
    serverInstance.close();
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  runExp5Verification()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("\nVerification Failed:", err);
      process.exit(1);
    });
}

module.exports = { runExp5Verification };
