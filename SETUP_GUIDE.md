# Setting up karthi's page — full guide

This guide takes you from these files to a live link you can send to friends.
It has three parts:

1. Set up the free database (Supabase) — stores messages, access requests, and photos
2. Connect your site to that database (one file edit)
3. Put the site online with GitHub Pages and get your shareable link

Total time: about 15–20 minutes. No coding required, just careful copy-pasting.

---

## Part 1 — Create your free database (Supabase)

Your site needs somewhere to actually store the messages, requests, and photos.
Supabase is a free service that gives you this without writing backend code.

1. Go to **supabase.com** and click **Start your project**. Sign in with GitHub or email.
2. Click **New project**.
   - Name: `karthi-site` (or anything)
   - Database password: generate one and **save it somewhere** (you likely won't need it again, but keep it safe)
   - Region: pick the one closest to you (e.g. Mumbai/Singapore)
   - Click **Create new project** and wait about 1–2 minutes while it sets up.
3. Once it's ready, look at the left sidebar and click the **SQL Editor** icon.
4. Click **New query**.
5. Open the file `supabase_setup.sql` from this folder, copy **all of it**, and paste it into the SQL editor.
6. Click **Run** (bottom right). You should see "Success. No rows returned." This created your three tables: `messages`, `access_requests`, and `photos`.
7. Now go to the left sidebar and click **Project Settings** (gear icon) → **API**.
8. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public key** — a long string starting with `eyJ...`
9. Keep this tab open, you'll copy these in the next part.

---

## Part 2 — Connect your site to the database

1. Open the file `assets/config.js` in any text editor (Notepad, TextEdit, VS Code, or even GitHub's web editor later).
2. Replace the placeholder values:

```js
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
```

with your actual values from step 8 above, so it looks like:

```js
const SUPABASE_URL = "https://abcdefgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

3. While you're in this file, also change the admin password to something only you know:

```js
const ADMIN_PASSWORD = "karthi2024";
```

Change `karthi2024` to your own secret word. This password unlocks your message inbox and your photo-locker approval panel — anyone who knows it can see your private messages, so pick something not-obvious and don't share it with anyone except maybe one trusted person.

4. Save the file.

> **Important:** the anon public key is safe to expose in your site's code — that's what it's designed for. Just never share your database password from step 2 of Part 1.

---

## Part 3 — Put it online with GitHub Pages

1. Go to **github.com** and log into your account.
2. Click the **+** icon top right → **New repository**.
   - Repository name: `karthi-site` (or any name, no spaces)
   - Set it to **Public** (GitHub Pages requires this on free accounts)
   - Don't check any of the optional boxes (README etc.)
   - Click **Create repository**
3. On the new empty repo page, click **uploading an existing file** (it's a blue link in the instructions).
4. Now drag and drop **all the files and folders** from this karthi-site folder into the upload box:
   - `index.html`
   - `locker.html`
   - `supabase_setup.sql` (optional to upload, just for your records)
   - the whole `assets` folder (drag the folder itself — GitHub keeps the structure)
5. Scroll down and click **Commit changes**.
6. Now go to the **Settings** tab of your repo (top menu).
7. In the left sidebar, click **Pages**.
8. Under "Build and deployment" → "Branch", select **main** and folder **/ (root)**, then click **Save**.
9. Wait about 1–2 minutes, then refresh the page. You'll see a green box with your live URL, something like:

```
https://yourusername.github.io/karthi-site/
```

That's your link! Open it to make sure everything loads and the chibi art shows up.

---

## Sharing it with friends

Send them: `https://yourusername.github.io/karthi-site/`

They'll land on your main page where they can leave opinions, complaints, or cute messages.
The photo locker link is at the bottom of that page if they want to request access to your private album.

---

## Checking your inbox

1. Go to your live link.
2. Scroll to the bottom, find the "only karthi can open this" box.
3. Type your secret password from `config.js` and click "peek inbox".
4. All messages appear, newest first, with the sender's name and type.

## Approving photo locker requests

1. Go to `yourlink/locker.html`
2. Scroll down to "karthi's access control", enter your password.
3. You'll see every request with approve/deny buttons.
4. To add photos: paste an image URL (upload your photo to a free image host like **imgur.com** first, then copy the direct image link) and an optional caption, then click "add to album". It'll instantly show for anyone you've approved.

---

## Making future changes

Whenever you want to edit text, colors, or add features:

1. Go to your GitHub repo in the browser
2. Click on the file you want to edit (e.g. `index.html`)
3. Click the pencil icon (Edit this file)
4. Make your changes, scroll down, click **Commit changes**
5. Your live site updates automatically within a minute — no re-uploading needed.

You can also always come back and ask me to make changes, then re-upload just the changed files the same way (drag and drop, overwrite).

---

## Troubleshooting

**Messages aren't showing in my inbox** — double check `assets/config.js` has your real Supabase URL and key, not the placeholder text, and that you ran the full SQL script in Part 1 step 6.

**Page looks unstyled/broken** — make sure you uploaded the entire `assets` folder, not just the html files.

**"Failed to fetch" errors** — usually means the Supabase URL or key is wrong, or you have no internet connection.

**I forgot my admin password** — open `assets/config.js` on GitHub (edit pencil icon), find `ADMIN_PASSWORD`, set a new one, commit changes.
