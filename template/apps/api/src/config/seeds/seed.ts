import "dotenv/config";
import { db } from "../../lib/supabase.js";
import { logger } from "../../utils/logger.js";
async function seed() {
  logger.info("🌱 Seeding…");
  const email = "admin@example.com";
  if (await db.findOne("users", { email })) { logger.info("ℹ️  Admin exists"); return; }
  const u = await db.auth.createUser(email, "Admin1234!", { name:"Admin" });
  await db.create("users", { id:u!.id, email, name:"Admin User", role:"admin", is_active:true, avatar_url:null, last_login_at:null });
  logger.info("✅ admin@example.com / Admin1234!");
}
seed().catch(e => { console.error(e); process.exit(1); });
