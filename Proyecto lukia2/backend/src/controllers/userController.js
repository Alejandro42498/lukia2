const userService = require('../services/userService');
const bcrypt = require('bcrypt');

async function list(req, res) {
  try {
    const rows = await userService.listUsers();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function getOne(req, res) {
  try {
    const row = await userService.getUserById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function create(req, res) {
  try {
    const { idu, name, email, password, rol } = req.body;
    if (!idu || !name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const hashed = await bcrypt.hash(password, 10);
    const created = await userService.createUser({ idu, name, email, password: hashed, rol });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const { idu, name, email, password, rol } = req.body;
    let hash = null;
    if (password !== undefined && password !== '') {
      hash = await bcrypt.hash(password, 10);
    }
    const updated = await userService.updateUser(id, { idu, name, email, rol }, hash);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

async function remove(req, res) {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

module.exports = { list, getOne, create, update, remove };
