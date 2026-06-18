// ============================================
// KARTHI'S SITE — CONFIG
// ============================================
// Paste your own Supabase project values below.
// You get these from supabase.com after creating a free project.
// Step by step instructions are in SETUP_GUIDE.md
// ============================================

const SUPABASE_URL = "https://lzftnetfqyokvjbmcicg.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZnRuZXRmcXlva3ZqYm1jaWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTE5MTIsImV4cCI6MjA5NzMyNzkxMn0.NN-9BuSiKKeA8CAN3lXlDHXSn2r4l-QsD2d1iunpHzs";

// This is the password YOU use to unlock your inbox + photo locker admin view.
// Change it to something only you know.
const ADMIN_PASSWORD = "Athiveerankarthi";

// ============================================
// Do not edit below this line
// ============================================
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
