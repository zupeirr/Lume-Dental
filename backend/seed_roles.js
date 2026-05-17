const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seedRoles() {
  console.log('Starting Role Seeding...');

  const users = [
    { name: 'Practice Receptionist', email: 'reception@lumedental.com', password: 'Staff123!', role: 'receptionist' },
    { name: 'Dr. Sarah Mitchell', email: 'dentist@lumedental.com', password: 'Clinical123!', role: 'dentist' }
  ];

  for (const u of users) {
    try {
      // Check if exists
      const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [u.email]);
      if (existing.length > 0) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);

      await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [u.name, u.email, hashedPassword, u.role]
      );
      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    } catch (e) {
      console.error(`Error creating ${u.role}:`, e);
    }
  }

  console.log('Seeding finished.');
  process.exit(0);
}

seedRoles();
