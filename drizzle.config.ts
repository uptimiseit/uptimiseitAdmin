// import { defineConfig } from "drizzle-kit";
// import * as dotenv from "dotenv";

// // Tell Drizzle to look for your Neon URL in the .env file
// dotenv.config({ path: ".env" }); 

// export default defineConfig({
//   schema: "./db/schema.ts",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });


import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Update this line to match your actual file name!
dotenv.config({ path: ".env.local" }); 

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});