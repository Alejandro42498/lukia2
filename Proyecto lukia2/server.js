// Bootstrap the backend server implementation from /backend/src
try {
  require('./backend/src/server');
} catch (err) {
  console.error('Failed to start backend server:', err && err.message ? err.message : err);
  process.exit(1);
}
