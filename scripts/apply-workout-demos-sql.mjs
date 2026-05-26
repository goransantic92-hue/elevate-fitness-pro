/**
 * Applies workout-demos storage migration via Supabase Management API is not available;
 * this script uses the service role + PostgREST is insufficient for DDL.
 * Run the SQL file in Dashboard → SQL Editor instead.
 *
 * Usage: node scripts/apply-workout-demos-sql.mjs
 * Prints the SQL path and opens instructions.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const sqlPath = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "migrations", "20260526120000_workout_demos_storage.sql");
console.log("Paste this SQL in Supabase Dashboard → SQL Editor → Run:\n");
console.log(readFileSync(sqlPath, "utf8"));
