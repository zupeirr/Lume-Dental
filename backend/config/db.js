const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'patient',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dentists (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        specialty TEXT,
        phone TEXT,
        email TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
        dentist_id INTEGER REFERENCES dentists(id) ON DELETE SET NULL,
        appointment_date TIMESTAMP NOT NULL,
        comments TEXT,
        staff_notes TEXT,
        status TEXT DEFAULT 'pending',
        amount REAL DEFAULT 0,
        payment_status TEXT DEFAULT 'unpaid',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        section TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS patient_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        medical_history TEXT,
        allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert seeds
    await pool.query(`
      INSERT INTO services (id, name, description, price) VALUES 
      (1, 'Comprehensive Checkup', 'General checkup and cleaning', 150.00),
      (2, 'Professional Whitening', 'Teeth whitening service', 200.00),
      (3, 'Restorative Care', 'Fillings, crowns, and bridges', 300.00),
      (4, 'Invisalign® Consultation', 'Clear aligners consultation', 100.00)
      ON CONFLICT (id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO users (id, name, email, phone, password_hash, role) 
      VALUES (1, 'System Admin', 'admin@lumedental.com', '1234567890', '$2b$10$x9GYDLX3PjZG7CxwtBKZBeVgJqYQkpXy.f51aKyiLIP13BXAcB48C', 'admin')
      ON CONFLICT (id) DO UPDATE SET 
        name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, role=EXCLUDED.role;
    `);

    const { rowCount } = await pool.query(`SELECT 1 FROM site_content LIMIT 1`);
    if (rowCount === 0) {
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
        await pool.query(
          'INSERT INTO site_content (section, content) VALUES ($1, $2) ON CONFLICT (section) DO NOTHING',
          [section, content]
        );
      }
    }

    console.log('PostgreSQL Database Initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize Postgres schema:', err);
  }
};

if (process.env.DATABASE_URL) {
  initDb();
} else {
  console.log('WARNING: DATABASE_URL not set in environment.');
}

module.exports = {
  query: async (sql, params = []) => {
    // 1) Translate SQLite "?" into PostgreSQL "$1, $2, etc"
    let counter = 1;
    let pgSql = sql.replace(/\?/g, () => `$${counter++}`);
    
    // 2) Emulate the .insertId behavior for SQLite compatibility
    const isModification = ['INSERT', 'UPDATE', 'DELETE'].some(cmd => pgSql.trim().toUpperCase().startsWith(cmd));
    if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
      pgSql += ' RETURNING id';
    }

    // Replace SQLite specific DATE/IFNULL syntax that fails in Postgres
    pgSql = pgSql.replace(/IFNULL\(/gi, 'COALESCE(');

    try {
      const result = await pool.query(pgSql, params);
      
      if (isModification) {
          return [{ insertId: result.rows[0]?.id || 0, affectedRows: result.rowCount }];
      } else {
          return [result.rows]; 
      }
    } catch (err) {
      console.error('SQL Error in query:', pgSql, params, err);
      throw err;
    }
  }
};
