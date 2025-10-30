const db = require('../config/db');

async function listUsers() {
  const res = await db.query('SELECT id, idu, name, email, rol, create_on, update_on FROM users ORDER BY id');
  return res.rows;
}

async function getUserById(id) {
  const res = await db.query('SELECT id, idu, name, email, rol, create_on, update_on FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

async function createUser({ idu, name, email, password, rol }) {
  const q = `INSERT INTO users (idu, name, email, password, rol, create_on, update_on)
             VALUES ($1,$2,$3,$4,$5, now(), now()) RETURNING id, idu, name, email, rol, create_on, update_on`;
  const values = [idu, name, email, password, rol || null];
  const res = await db.query(q, values);
  return res.rows[0];
}

async function updateUser(id, fields, passwordHash) {
  const sets = [];
  const vals = [];
  let idx = 1;
  if (fields.idu !== undefined) { sets.push(`idu = $${idx++}`); vals.push(fields.idu); }
  if (fields.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(fields.name); }
  if (fields.email !== undefined) { sets.push(`email = $${idx++}`); vals.push(fields.email); }
  if (fields.rol !== undefined) { sets.push(`rol = $${idx++}`); vals.push(fields.rol); }
  if (passwordHash) { sets.push(`password = $${idx++}`); vals.push(passwordHash); }
  sets.push(`update_on = now()`);
  if (sets.length === 0) throw new Error('No fields to update');
  const q = `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, idu, name, email, rol, create_on, update_on`;
  vals.push(id);
  const res = await db.query(q, vals);
  return res.rows[0];
}

async function deleteUser(id) {
  const res = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };
