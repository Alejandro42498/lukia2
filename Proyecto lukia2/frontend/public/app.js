let table;
const userModal = new bootstrap.Modal(document.getElementById('userModal'));

function initTable() {
  table = $('#usersTable').DataTable({
    ajax: {
      url: '/api/users',
      dataSrc: ''
    },
    columns: [
      { data: 'id' },
      { data: 'idu' },
      { data: 'name' },
      { data: 'email' },
      { data: 'rol' },
      { data: 'create_on' },
      { data: 'update_on' },
      { data: null, render: (data, type, row) => {
          return `
            <button class="btn btn-sm btn-primary btn-edit" data-id="${row.id}">Editar</button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${row.id}">Borrar</button>
          `;
        }
      }
    ]
  });
}

function openNew() {
  document.getElementById('modalTitle').innerText = 'Nuevo usuario';
  document.getElementById('userForm').reset();
  document.getElementById('userId').value = '';
  userModal.show();
}

async function openEdit(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) return alert('Error cargando');
  const data = await res.json();
  document.getElementById('modalTitle').innerText = 'Editar usuario';
  document.getElementById('userId').value = data.id;
  document.getElementById('idu').value = data.idu;
  document.getElementById('name').value = data.name;
  document.getElementById('email').value = data.email;
  document.getElementById('rol').value = data.rol || '';
  document.getElementById('password').value = '';
  userModal.show();
}

async function saveUser() {
  const id = document.getElementById('userId').value;
  const payload = {
    idu: document.getElementById('idu').value,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    rol: document.getElementById('rol').value
  };

  try {
    let res;
    if (id) {
      // edit
      res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    if (!res.ok) {
      const err = await res.json();
      alert('Error: ' + (err.error || JSON.stringify(err)));
      return;
    }
    userModal.hide();
    table.ajax.reload();
  } catch (err) {
    console.error(err);
    alert('Error de red');
  }
}

async function deleteUser(id) {
  if (!confirm('¿Borrar este usuario?')) return;
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) return alert('Error borrando');
  table.ajax.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  initTable();
  document.getElementById('btnNew').addEventListener('click', openNew);
  document.getElementById('saveBtn').addEventListener('click', saveUser);

  // delegate edit/delete
  $('#usersTable tbody').on('click', '.btn-edit', function() {
    const id = $(this).data('id');
    openEdit(id);
  });
  $('#usersTable tbody').on('click', '.btn-delete', function() {
    const id = $(this).data('id');
    deleteUser(id);
  });
});