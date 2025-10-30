const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let initError = null;

function makeSslConfig() {
  // If PGSSLMODE is set, honor it: common values are 'disable', 'require', 'verify-ca', 'verify-full'
  const mode = (process.env.PGSSLMODE || '').toLowerCase();
  if (mode === 'disable' || mode === '') return false;

  // If a root cert path is provided, load it
  const rootCertPath = process.env.PGSSLROOTCERT;
  if (rootCertPath) {
    try {
      const ca = fs.readFileSync(rootCertPath).toString();
      return { ca, rejectUnauthorized: mode !== 'require' ? true : false };
    } catch (e) {
      console.warn('Could not read PGSSLROOTCERT:', e.message);
      // fallback to permissive
      return { rejectUnauthorized: false };
    }
  }

  // If host looks like AWS RDS, default to permissive SSL (many RDS require SSL)
  const host = process.env.PGHOST || '';
  if (host.includes('.rds.amazonaws.com')) return { rejectUnauthorized: false };

  // default: require SSL but don't reject unauthorized unless specified
  return { rejectUnauthorized: false };
}

try {
  const ssl = makeSslConfig();
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl });
  } else {
    const cfg = {
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD !== undefined && process.env.PGPASSWORD !== '' ? String(process.env.PGPASSWORD) : undefined,
      database: process.env.PGDATABASE || 'postgres',
      ssl
    };
    pool = new Pool(cfg);
  }
} catch (err) {
  console.error('Failed to create Postgres pool:', err && err.message ? err.message : err);
  initError = err;
  pool = null;
}

module.exports = {
  query: async (text, params) => {
    if (!pool) {
      const message = initError ? `DB pool init error: ${initError.message || initError}` : 'DB pool not initialized';
      throw new Error(message);
    }
    return pool.query(text, params);
  },
  pool
};
