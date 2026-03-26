import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM votes`;
  await sql`DELETE FROM topics`;
  await sql`DELETE FROM users`;
  await sql`UPDATE app_state SET current_phase = 'submission'`;
  console.log("Database cleaned!");
}

main().catch(console.error);
