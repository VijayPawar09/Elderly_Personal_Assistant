import fs from "fs";
import path from "path";

const envContent = `MONGO_URI=mongodb://localhost:27017/elderly_care
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
`;

const envPath = path.join(process.cwd(), ".env");

try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  console.log("📝 Please update the JWT_SECRET with a secure random string");
  console.log("🔗 Make sure MongoDB is running on localhost:27017");
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
}
