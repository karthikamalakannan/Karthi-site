// ============================================
// hero image is a static <img> tag now (real photo) — no JS loading needed
// ============================================

// ============================================
// tab switching
// ============================================
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="'+tab+'"]').classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

// ============================================
// submitting messages to supabase
// ============================================
async function submitMsg(type){
  const fieldMap = {
    opinion: { name:'op-name', text:'op-text', extra:'op-rating' },
    rant: { name:'rt-name', text:'rt-text', extra:'rt-level' },
    cute: { name:'ct-name', text:'ct-text', extra:'ct-vibe' }
  };
  const f = fieldMap[type];
  const nameEl = document.getElementById(f.name);
  const textEl = document.getElementById(f.text);
  const name = nameEl.value.trim();
  const text = textEl.value.trim();
  const extra = document.getElementById(f.extra).value;

  if(!name || !text){
    nameEl.style.borderColor = '#c0392b';
    setTimeout(() => nameEl.style.borderColor = '', 1400);
    return;
  }

  const btn = document.querySelector('#form-' + type + ' .btn-main');
  const originalText = btn.textContent;
  btn.textContent = 'sending...';
  btn.disabled = true;

  const { error } = await supabaseClient
    .from('messages')
    .insert([{ type, sender_name: name, message_text: text, extra_field: extra }]);

  btn.textContent = originalText;
  btn.disabled = false;

  if(error){
    console.error(error);
    alert('something went wrong sending this — check your internet and try again');
    return;
  }

  document.getElementById('form-' + type).style.display = 'none';
  document.getElementById('suc-' + type).style.display = 'block';

  if(document.getElementById('inbox-panel').style.display === 'block'){
    renderInbox();
  }
}

function resetForm(type){
  const idsByType = {
    opinion: ['op-name','op-text','op-rating'],
    rant: ['rt-name','rt-text','rt-level'],
    cute: ['ct-name','ct-text','ct-vibe']
  };
  idsByType[type].forEach(id => document.getElementById(id).value = '');
  document.getElementById('form-' + type).style.display = '';
  document.getElementById('suc-' + type).style.display = 'none';
}

// ============================================
// admin inbox
// ============================================
function unlockAdmin(){
  const pw = document.getElementById('admin-pw').value;
  if(pw === ADMIN_PASSWORD){
    document.getElementById('admin-lock').style.display = 'none';
    document.getElementById('inbox-panel').style.display = 'block';
    renderInbox();
  }else{
    document.getElementById('pw-error').style.display = 'block';
    setTimeout(() => document.getElementById('pw-error').style.display = 'none', 2000);
  }
}

function lockAdmin(){
  document.getElementById('admin-lock').style.display = '';
  document.getElementById('inbox-panel').style.display = 'none';
  document.getElementById('admin-pw').value = '';
}

async function renderInbox(){
  const list = document.getElementById('messages-list');
  const countEl = document.getElementById('msg-count');
  list.innerHTML = '<div class="empty-state">loading...</div>';

  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if(error){
    list.innerHTML = '<div class="empty-state">could not load messages — check your supabase setup</div>';
    console.error(error);
    return;
  }

  countEl.textContent = data.length;

  if(!data.length){
    list.innerHTML = '<div class="empty-state">no messages yet~ share your link</div>';
    return;
  }

  const badgeClass = { opinion:'badge-opinion', rant:'badge-rant', cute:'badge-cute' };
  const badgeLabel = { opinion:'opinion', rant:'complaint', cute:'cute msg' };

  list.innerHTML = data.map(m => {
    const date = new Date(m.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    return `
      <div class="msg-card">
        <div class="msg-meta">
          <span class="msg-sender">from ${escapeHtml(m.sender_name)}</span>
          <span class="msg-badge ${badgeClass[m.type]}">${badgeLabel[m.type]}</span>
        </div>
        <div class="msg-text">${escapeHtml(m.message_text)}</div>
        <div class="msg-time">${m.extra_field ? escapeHtml(m.extra_field) + ' · ' : ''}${date}</div>
      </div>
    `;
  }).join('');
}

async function clearInbox(){
  if(!confirm('clear all messages? this cannot be undone')) return;
  const { error } = await supabaseClient.from('messages').delete().neq('id', 0);
  if(error){ alert('could not clear — try again'); console.error(error); return; }
  renderInbox();
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
