const { Pool } = require('pg');
require('dotenv').config();

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else if (process.env.PGHOST) {
  pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  console.error("No database connection environment variables set!");
}

const initDb = async () => {
  console.log('Initializing Postgres Database...');

  // 1. Create users
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'patient',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'users' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'users' table:", err);
  }

  // 2. Create services
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        bullets TEXT[]
      )
    `);
    console.log("Table 'services' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'services' table:", err);
  }

  // 3. Create dentists
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dentists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        image TEXT,
        availability JSONB
      )
    `);
    console.log("Table 'dentists' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'dentists' table:", err);
  }

  // 4. Create appointments
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_id INT,
        dentist_id INT,
        date VARCHAR(100),
        time VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        type VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'appointments' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'appointments' table:", err);
  }

  // 5. Create notifications
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT,
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'notifications' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'notifications' table:", err);
  }

  // 6. Create site_content
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(100) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'site_content' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'site_content' table:", err);
  }

  // 7. Create patient_records
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patient_records (
        id SERIAL PRIMARY KEY,
        patient_id INT NOT NULL,
        medical_history TEXT,
        allergies TEXT,
        last_visit VARCHAR(100),
        next_appointment VARCHAR(100),
        treatment_plans JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'patient_records' checked/created successfully.");
  } catch (err) {
    console.error("Error creating 'patient_records' table:", err);
  }

  // Seeding initial services
  try {
    const servicesCount = await pool.query('SELECT COUNT(*) FROM services');
    if (parseInt(servicesCount.rows[0].count) === 0) {
      const defaultServices = [
        {
          title: 'Cosmetic Dentistry',
          description: 'Enhance the aesthetics of your smile with premium veneers, whitening, and smile contouring.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1nSqxo1i0irC_dlAJU5q-9MRcKxSFwnAFN0L8mdsaGh-ZZUpQop34_GZpVJbTBmWhUerUVvnLoJlztBSV8EIbl3l7Rq7EoM_giANRqj4mNHH-3l8AsECOuFcN5FG62y8QvWOnFDmRVfnzAMDyOW18iWaDE481croVfT2RK_UnqvqYaegv1ora-t0jy7BldoCgoPzGn_NbAQREsiK24l5S152hDrXNe_jy3Ddlc0k4bBat10zrk3QdarBiRA1ZUiP32PCRiJMd8Z4Z',
          bullets: ['Professional Whitening', 'Porcelain Veneers']
        },
        {
          title: 'Dental Implants',
          description: 'Permanent, natural-looking tooth replacement solutions using biocompatible titanium materials.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVm84C_CdaVts5Zxez16ARAHDZ8GUNeca-HrmpS6-m1G1Io4V8hu89Yc0gA61IWzv3aMsTgOVtjJRdaidW3IHGwd3qNyImbRwsmKa25wszDTtY_CecBAw27fPSIbgsNgjpj1wIa2a9VsprjAiSG2moMCvvEEHTxjDWzRo6wdr_hQWRQbt2PqG2LeXHxmY4WMvHrjcldTeH7lU5XiTBbQkImc734uXuN0csp0_pDGoSSo1YxSwOXw-tUG8Pz5aRO4fxFDVGpSQkft6r',
          bullets: ['Full Arch Reconstruction', 'Guided Surgery']
        },
        {
          title: 'Restorative Care',
          description: 'Restoring function and health to damaged teeth with durable, tooth-colored materials.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxawpiEiFVAMUjUdIiRX9AxDXvkAjZeKG8fOs6TSBNy1Gv0VZeZisliT7lHW-gRqOo4xSX838_GUr7DDiTOfiU1gA_kE49nKZFczwhT9LFk-Ho1elaMXgBFiWLk7uDu04Q9OCEWkSP5xW1J4OQ22zzHAxxPTD-b4DwilG1RcmfeyIX8L6nafQMiidfJ5cr73lKHrRbidy5P9lf3uQaOHfkDjElY0j6JVTfbwV9LmaZcAvxIuJ5HKcCGJm_mDufs5IMPx4FovObnft',
          bullets: ['Metal-Free Fillings', 'Precision Crowns']
        }
      ];
      for (const s of defaultServices) {
        await pool.query(
          'INSERT INTO services (title, description, image, bullets) VALUES ($1, $2, $3, $4)',
          [s.title, s.description, s.image, s.bullets]
        );
      }
      console.log('Services seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to seed services:', err);
  }

  // Seeding initial Admin
  try {
    const adminCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    if (parseInt(adminCount.rows[0].count) === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password",
        ['Admin', 'admin@lumedental.com', hashedPassword, 'admin']
      );
      console.log('Admin user seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to seed Admin user:', err);
  }

  // Seeding site content
  try {
    const contentCount = await pool.query('SELECT COUNT(*) FROM site_content');
    if (parseInt(contentCount.rows[0].count) === 0) {
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
      console.log('Site content seeded successfully.');
    } else {
      console.log('Site content already seeded.');
    }
  } catch (err) {
    console.error('Failed to seed site content:', err);
  }

  console.log('PostgreSQL Database Initialized successfully!');
};

if (process.env.DATABASE_URL || process.env.PGHOST) {
  initDb();
} else {
  console.log('WARNING: Neither DATABASE_URL nor PGHOST set in environment.');
}

module.exports = {
  query: async (sql, params = []) => {
    let counter = 1;
    let pgSql = sql.replace(/\?/g, () => `$${counter++}`);
    
    const isModification = ['INSERT', 'UPDATE', 'DELETE'].some(cmd => pgSql.trim().toUpperCase().startsWith(cmd));
    if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
      pgSql += ' RETURNING id';
    }

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