// Run with: npx tsx scripts/setup-db.ts
// Make sure DATABASE_URL is set in .env.local

import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      session_token TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS topics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      proposed_by UUID REFERENCES users(id) ON DELETE CASCADE,
      speaker_id UUID REFERENCES users(id) ON DELETE SET NULL,
      type TEXT NOT NULL CHECK (type IN ('speaker_led', 'orphan')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, topic_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY DEFAULT 1,
      current_phase TEXT NOT NULL DEFAULT 'submission' CHECK (current_phase IN ('submission', 'voting')),
      CHECK (id = 1)
    )
  `;

  await sql`
    INSERT INTO app_state (id, current_phase) VALUES (1, 'submission')
    ON CONFLICT (id) DO NOTHING
  `;

  console.log("Database setup complete!");
}

main().catch(console.error);
