// ============================================
// KARTHI'S SITE — CONFIG
// ============================================
// Paste your own Supabase project values below.
// You get these from supabase.com after creating a free project.
// Step by step instructions are in SETUP_GUIDE.md
// ============================================

const SUPABASE_URL = "https://oninjcbdssocrfsaymun.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaW5qY2Jkc3NvY3Jmc2F5bXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjE0MDcsImV4cCI6MjA5NzMzNzQwN30.RxaNEhRXuISI8XOBnMdtmqX44pUA-cSeRokiKFQBSCw";
// ============================================
// Do not edit below this line
// ============================================
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
