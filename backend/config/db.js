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
      amount REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'unpaid',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dentists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT,
      phone TEXT,
      email TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Add dentist_id and staff_notes to appointments if not exists
    -- (Handled via migration or initial creation)

    CREATE TABLE IF NOT EXISTS patient_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      medical_history TEXT,
      allergies TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Insert services if they don't exist
    INSERT OR IGNORE INTO services (id, name, description, price) VALUES 
    (1, 'Comprehensive Checkup', 'General checkup and cleaning', 150.00),
    (2, 'Professional Whitening', 'Teeth whitening service', 200.00),
    (3, 'Restorative Care', 'Fillings, crowns, and bridges', 300.00),
    (4, 'Invisalign® Consultation', 'Clear aligners consultation', 100.00);

    -- Insert dummy admin user if it doesn't exist
    INSERT OR REPLACE INTO users (id, name, email, phone, password_hash, role) 
    VALUES (1, 'System Admin', 'admin@lumedental.com', '1234567890', '$2b$10$x9GYDLX3PjZG7CxwtBKZBeVgJqYQkpXy.f51aKyiLIP13BXAcB48C', 'admin');
  `);
  
  console.log('SQLite Database Initialized successfully!');

  // Safe migrations — add columns that may not exist in older databases
  const migrations = [
    `ALTER TABLE appointments ADD COLUMN dentist_id INTEGER REFERENCES dentists(id) ON DELETE SET NULL`,
    `ALTER TABLE appointments ADD COLUMN staff_notes TEXT`,
  ];

  for (const migration of migrations) {
    try {
      await dbInstance.run(migration);
    } catch (e) {
      // Ignore "duplicate column" errors — column already exists
      if (!e.message.includes('duplicate column')) {
        console.warn('Migration warning:', e.message);
      }
    }
  }

  // Seed default site content (only on first run)
  const defaultSections = [
    {
      section: 'services',
      content: JSON.stringify({
        title: 'Specialized Dental Care',
        description: 'We offer a comprehensive range of dental solutions using the latest medical breakthroughs and artisanal precision.',
        buttonText: 'View All Services',
        items: [
          { title: 'Cosmetic Dentistry', description: 'Enhance the aesthetics of your smile with premium veneers, whitening, and smile contouring.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1nSqxo1i0irC_dlAJU5q-9MRcKxSFwnAFN0L8mdsaGh-ZZUpQop34_GZpVJbTBmWhUerUVvnLoJlztBSV8EIbl3l7Rq7EoM_giANRqj4mNHH-3l8AsECOuFcN5FG62y8QvWOnFDmRVfnzAMDyOW18iWaDE481croVfT2RK_UnqvqYaegv1ora-t0jy7BldoCgoPzGn_NbAQREsiK24l5S152hDrXNe_jy3Ddlc0k4bBat10zrk3QdarBiRA1ZUiP32PCRiJMd8Z4Z', bullets: ['Professional Whitening', 'Porcelain Veneers'] },
          { title: 'Dental Implants', description: 'Permanent, natural-looking tooth replacement solutions using biocompatible titanium materials.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVm84C_CdaVts5Zxez16ARAHDZ8GUNeca-HrmpS6-m1G1Io4V8hu89Yc0gA61IWzv3aMsTgOVtjJRdaidW3IHGwd3qNyImbRwsmKa25wszDTtY_CecBAw27fPSIbgsNgjpj1wIa2a9VsprjAiSG2moMCvvEEHTxjDWzRo6wdr_hQWRQbt2PqG2LeXHxmY4WMvHrjcldTeH7lU5XiTBbQkImc734uXuN0csp0_pDGoSSo1YxSwOXw-tUG8Pz5aRO4fxFDVGpSQkft6r', bullets: ['Full Arch Reconstruction', 'Guided Surgery'] },
          { title: 'Restorative Care', description: 'Restoring function and health to damaged teeth with durable, tooth-colored materials.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxawpiEiFVAMUjUdIiRX9AxDXvkAjZeKG8fOs6TSBNy1Gv0VZeZisliT7lHW-gRqOo4xSX838_GUr7DDiTOfiU1gA_kE49nKZFczwhT9LFk-Ho1elaMXgBFiWLk7uDu04Q9OCEWkSP5xW1J4OQ22zzHAxxPTD-b4DwilG1RcmfeyIX8L6nafQMiidfJ5cr73lKHrRbidy5P9lf3uQaOHfkDjElY0j6JVTfbwV9LmaZcAvxIuJ5HKcCGJm_mDufs5IMPx4FovObnft', bullets: ['Metal-Free Fillings', 'Precision Crowns'] }
        ]
      })
    },
    {
      section: 'pricing',
      content: JSON.stringify({
        title: 'Transparent Infrastructure Pricing',
        description: 'Scalable dental solutions designed for modern lives. No hidden fees, just precision craftsmanship.',
        items: [
          { title: 'Preventative Care', description: 'Essential maintenance for long-term health.', highlight: false, services: [{ name: 'Comprehensive Checkup', price: 'from $150' }, { name: 'Professional Cleaning', price: 'from $120' }, { name: 'Digital X-Rays', price: 'from $80' }] },
          { title: 'Cosmetic Dentistry', description: 'Enhance your natural smile confidently.', highlight: true, services: [{ name: 'Professional Whitening', price: 'from $350' }, { name: 'Porcelain Veneers', price: 'from $1,200/th' }, { name: 'Invisalign®', price: 'Custom Quote' }] },
          { title: 'Restorative Care', description: 'Repair and restore structural integrity.', highlight: false, services: [{ name: 'Tooth-Colored Fillings', price: 'from $200' }, { name: 'Dental Crowns', price: 'from $900' }, { name: 'Dental Implants', price: 'from $2,500' }] }
        ]
      })
    },
    {
      section: 'gallery',
      content: JSON.stringify({
        label: 'Clinical Results',
        title: 'Patient Transformations',
        description: 'View the precision and artistry of our restorative and cosmetic procedures.',
        items: [
          { id: 1, title: 'Smile Design', description: 'Full arch reconstruction with precision-fit porcelain veneers.', before: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800', after: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800' },
          { id: 2, title: 'Orthodontic Clarity', description: 'Seamless alignment correction using advanced clear aligner tech.', before: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800', after: '/regenerated_image_1777535324973.png' },
          { id: 3, title: 'Restorative Art', description: 'Ceramic crown replacement restoring both function and aesthetics.', before: '/regenerated_image_1777534956328.png', after: '/regenerated_image_1777535516110.png' }
        ]
      })
    }
  ];

  for (const { section, content } of defaultSections) {
    await dbInstance.run(
      'INSERT OR IGNORE INTO site_content (section, content) VALUES (?, ?)',
      [section, content]
    );
  }
};

let dbPromise = initDb();

module.exports = {
  query: async (sql, params = []) => {
    await dbPromise; // Ensure DB is ready
    if (sql.trim().toUpperCase().startsWith('INSERT') || sql.trim().toUpperCase().startsWith('UPDATE') || sql.trim().toUpperCase().startsWith('DELETE')) {
        const result = await dbInstance.run(sql, params);
        return [{ insertId: result.lastID, affectedRows: result.changes }];
    } else {
        const rows = await dbInstance.all(sql, params);
        return [rows]; 
    }
  }
};
