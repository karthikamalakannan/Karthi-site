// ============================================
// KARTHI'S SITE — CONFIG
// ============================================
// Paste your own Supabase project values below.
// You get these from supabase.com after creating a free project.
// Step by step instructions are in SETUP_GUIDE.md
// ============================================

const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

// This is the password YOU use to unlock your inbox + photo locker admin view.
// Change it to something only you know.
const ADMIN_PASSWORD = "karthi2024";

// ============================================
// Do not edit below this line
// ============================================
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
