async function loadArt(elId, file){
  const el = document.getElementById(elId);
  if(!el) return;
  try{
    const res = await fetch('assets/' + file);
    el.innerHTML = await res.text();
  }catch(e){ console.error('art load failed', e); }
}
loadArt('hero-art', 'chibi-hero.svg');

// ============================================
// friend requesting access
// ============================================
async function submitRequest(){
  const nameEl = document.getElementById('req-name');
  const name = nameEl.value.trim();
  const note = document.getElementById('req-note').value.trim();

  if(!name){
    nameEl.style.borderColor = '#c0392b';
    setTimeout(() => nameEl.style.borderColor = '', 1400);
    return;
  }

  const btn = document.querySelector('#request-form .btn-main');
  btn.textContent = 'sending...';
  btn.disabled = true;

  const { error } = await supabaseClient
    .from('access_requests')
    .insert([{ requester_name: name, note: note, status: 'pending' }]);

  btn.textContent = 'request access';
  btn.disabled = false;

  if(error){
    console.error(error);
    alert('something went wrong — check your internet and try again');
    return;
  }

  document.getElementById('request-form').style.display = 'none';
  document.getElementById('req-success').style.display = 'block';
}

// ============================================
// friend checking their approval status
// ============================================
async function checkStatus(){
  const name = document.getElementById('check-name').value.trim();
  const resultEl = document.getElementById('status-result');
  if(!name){ resultEl.innerHTML = '<span style="color:#c0392b">enter your name first</span>'; return; }

  resultEl.innerHTML = 'checking...';

  const { data, error } = await supabaseClient
    .from('access_requests')
    .select('*')
    .ilike('requester_name', name)
    .order('created_at', { ascending: false })
    .limit(1);

  if(error || !data || !data.length){
    resultEl.innerHTML = '<span style="color:var(--brown-soft)">no request found under that name — request access above first</span>';
    return;
  }

  const req = data[0];
  if(req.status === 'approved'){
    resultEl.innerHTML = '<span style="color:#3a7d44;font-weight:700">you\'re approved! loading the album...</span>';
    loadAlbum();
  }else if(req.status === 'denied'){
    resultEl.innerHTML = '<span style="color:#c0392b">karthi hasn\'t opened the locker for you yet</span>';
  }else{
    resultEl.innerHTML = '<span style="color:var(--brown-soft)">still pending — karthi hasn\'t reviewed your request yet</span>';
  }
}

// ============================================
// loading the album once approved
// ============================================
async function loadAlbum(){
  const section = document.getElementById('album-section');
  section.style.display = 'block';
  section.innerHTML = '<div class="panel active"><h2>the album</h2><p class="panel-sub">loading photos...</p></div>';

  const { data, error } = await supabaseClient
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if(error || !data || !data.length){
    section.innerHTML = '<div class="panel active"><h2>the album</h2><p class="panel-sub">no photos added yet — check back soon</p></div>';
    return;
  }

  const grid = data.map(p => `
    <div style="margin-bottom:1rem">
      <img src="${escapeHtml(p.image_url)}" style="width:100%;border-radius:var(--radius-md);border:1.5px solid var(--card-border);display:block">
      ${p.caption ? `<p style="font-size:0.82rem;color:var(--brown-soft);margin-top:0.4rem;text-align:center">${escapeHtml(p.caption)}</p>` : ''}
    </div>
  `).join('');

  section.innerHTML = `<div class="panel active"><h2>the album</h2><p class="panel-sub">just for karthi's favourites 💛</p>${grid}</div>`;
}

// ============================================
// admin: approve/deny requests + manage photos
// ============================================
function unlockAdmin(){
  const pw = document.getElementById('admin-pw').value;
  if(pw === ADMIN_PASSWORD){
    document.getElementById('admin-lock').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    renderRequests();
  }else{
    document.getElementById('pw-error').style.display = 'block';
    setTimeout(() => document.getElementById('pw-error').style.display = 'none', 2000);
  }
}

function lockAdmin(){
  document.getElementById('admin-lock').style.display = '';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('admin-pw').value = '';
}

async function renderRequests(){
  const list = document.getElementById('requests-list');
  const countEl = document.getElementById('req-count');
  list.innerHTML = '<div class="empty-state">loading...</div>';

  const { data, error } = await supabaseClient
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if(error){
    list.innerHTML = '<div class="empty-state">could not load requests — check supabase setup</div>';
    console.error(error);
    return;
  }

  countEl.textContent = data.length;

  if(!data.length){
    list.innerHTML = '<div class="empty-state">no requests yet</div>';
    return;
  }

  const statusColor = { pending: '#8a5a14', approved: '#3a7d44', denied: '#b0432e' };
  const statusBg = { pending: '#fdeccb', approved: '#dcf0df', denied: '#fbe0db' };

  list.innerHTML = data.map(r => {
    const date = new Date(r.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    return `
      <div class="msg-card">
        <div class="msg-meta">
          <span class="msg-sender">${escapeHtml(r.requester_name)}</span>
          <span class="msg-badge" style="background:${statusBg[r.status]};color:${statusColor[r.status]}">${r.status}</span>
        </div>
        ${r.note ? `<div class="msg-text">${escapeHtml(r.note)}</div>` : ''}
        <div class="msg-time">${date}</div>
        <div style="display:flex;gap:8px;margin-top:0.6rem">
          <button class="btn-ghost" style="flex:1;font-size:0.78rem;padding:0.4rem" onclick="setRequestStatus(${r.id},'approved')">approve</button>
          <button class="btn-ghost" style="flex:1;font-size:0.78rem;padding:0.4rem" onclick="setRequestStatus(${r.id},'denied')">deny</button>
        </div>
      </div>
    `;
  }).join('');
}

async function setRequestStatus(id, status){
  const { error } = await supabaseClient
    .from('access_requests')
    .update({ status })
    .eq('id', id);
  if(error){ alert('could not update — try again'); console.error(error); return; }
  renderRequests();
}

async function addPhoto(){
  const urlEl = document.getElementById('new-photo-url');
  const url = urlEl.value.trim();
  const caption = document.getElementById('new-photo-caption').value.trim();
  const statusEl = document.getElementById('photo-add-status');

  if(!url){
    statusEl.innerHTML = '<span style="color:#c0392b">paste an image url first</span>';
    return;
  }

  const { error } = await supabaseClient
    .from('photos')
    .insert([{ image_url: url, caption: caption }]);

  if(error){
    statusEl.innerHTML = '<span style="color:#c0392b">failed to add — try again</span>';
    console.error(error);
    return;
  }

  statusEl.innerHTML = '<span style="color:#3a7d44">added to the album!</span>';
  document.getElementById('new-photo-url').value = '';
  document.getElementById('new-photo-caption').value = '';
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
