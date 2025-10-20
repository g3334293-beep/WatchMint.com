// Simple local withdrawal request manager
const form = document.getElementById('withdrawForm');
const requestsKey = 'watchmint_withdraw_requests_v1';
const requestsList = document.getElementById('requestsList');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');

function loadRequests(){
  const raw = localStorage.getItem(requestsKey);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    console.error('Invalid stored requests', e);
    localStorage.removeItem(requestsKey);
    return [];
  }
}

function saveRequests(arr){
  localStorage.setItem(requestsKey, JSON.stringify(arr));
}

function renderRequests(){
  const arr = loadRequests();
  if(arr.length === 0){
    requestsList.innerHTML = '<p class="muted">No requests yet.</p>';
    return;
  }
  requestsList.innerHTML = '';
  arr.forEach((r, idx) => {
    const div = document.createElement('div');
    div.className = 'request-row';
    const meta = document.createElement('div');
    meta.className = 'request-meta';
    meta.innerHTML = `<strong>${r.username}</strong> — ${r.method.toUpperCase()} • ${r.amount} PKR<br><small class="muted">${r.mobile} • ${r.email}</small>`;
    const actions = document.createElement('div');
    actions.className = 'request-actions';
    const mark = document.createElement('button');
    mark.innerText = 'Mark Paid';
    mark.onclick = () => { markPaid(idx); };
    const del = document.createElement('button');
    del.innerText = 'Delete';
    del.onclick = () => { deleteRequest(idx); };
    actions.appendChild(mark);
    actions.appendChild(del);
    div.appendChild(meta);
    div.appendChild(actions);
    requestsList.appendChild(div);
  });
}

function markPaid(index){
  const arr = loadRequests();
  const req = arr.splice(index,1)[0];
  saveRequests(arr);
  renderRequests();
  alert('Marked as paid locally. Details:\n' + JSON.stringify(req, null, 2));
  // In production: notify user via email or update server-side record
}

function deleteRequest(index){
  if(!confirm('Delete this request?')) return;
  const arr = loadRequests();
  arr.splice(index,1);
  saveRequests(arr);
  renderRequests();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    id: 'REQ-' + Date.now(),
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    method: form.method.value,
    mobile: form.mobile.value.trim(),
    amount: Number(form.amount.value),
    notes: form.notes.value.trim(),
    createdAt: new Date().toISOString()
  };
  // Basic validation
  if(!data.username || !data.email || !data.method || !data.mobile || !data.amount){
    alert('Please fill required fields.');
    return;
  }
  if(data.amount < 100){
    alert('Minimum withdrawal amount is PKR 100.');
    return;
  }
  const arr = loadRequests();
  arr.push(data);
  saveRequests(arr);
  renderRequests();
  form.reset();
  alert('Request saved locally. Admin: use Export Requests to download CSV for processing.');
});

// Export CSV for admin processing
exportBtn.addEventListener('click', () => {
  const arr = loadRequests();
  if(arr.length === 0){ alert('No requests to export.'); return; }
  const header = ['id','username','email','method','mobile','amount','notes','createdAt'];
  const rows = arr.map(r => header.map(h => {
    const val = r[h] === undefined ? '' : String(r[h]).replace(/"/g,'""');
    return '"' + val + '"';
  }).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'watchmint_withdraw_requests.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  alert('CSV exported. Process payouts using your JazzCash/EasyPaisa merchant or agent.');
});

// Clear saved requests
clearBtn.addEventListener('click', () => {
  if(!confirm('Clear all locally saved requests? This cannot be undone.')) return;
  localStorage.removeItem(requestsKey);
  renderRequests();
});

// initial
renderRequests();
