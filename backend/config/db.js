const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbInstance;

const initDb = async () => {
  dbInstance = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables and seed data automatically!
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'patient',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      service_id INTEGER,
      appointment_date DATETIME NOT NULL,
      comments TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
    );

    -- Insert services if they don't exist
    INSERT OR IGNORE INTO services (id, name, description, price) VALUES 
    (1, 'Comprehensive Checkup', 'General checkup and cleaning', 150.00),
    (2, 'Professional Whitening', 'Teeth whitening service', 200.00),
    (3, 'Restorative Care', 'Fillings, crowns, and bridges', 300.00),
    (4, 'Invisalign® Consultation', 'Clear aligners consultation', 100.00);

    -- Insert dummy admin user if it doesn't exist
    INSERT OR REPLACE INTO users (id, name, email, phone, password_hash, role) 
    VALUES (1, 'System Admin', 'admin@lumedental.com', '1234567890', '$2b$10$4fN7XQfdnAJPDIhnS3EomeUkqxuKCvWDJZ7o4x1eppN57VdVG.w3y', 'admin');
  `);
  
  console.log('SQLite Database Initialized successfully!');
};

initDb();

// This custom wrapper fakes the exact format of MySQL so we don't have to rewrite any code!
module.exports = {
  query: async (sql, params = []) => {
    // Convert MySQL query syntax if needed
    if (sql.trim().toUpperCase().startsWith('INSERT') || sql.trim().toUpperCase().startsWith('UPDATE') || sql.trim().toUpperCase().startsWith('DELETE')) {
        const result = await dbInstance.run(sql, params);
        // mysql2 returns [{ insertId: X, affectedRows: Y }]
        return [{ insertId: result.lastID, affectedRows: result.changes }];
    } else {
        const rows = await dbInstance.all(sql, params);
        // mysql2 returns [rows, fields] via destructuring: const [users] = ...
        return [rows]; 
    }
  }
};
