const db = require('../config/db');
const bcrypt = require('bcrypt');

// @desc    Add a new patient and optionally create an appointment (Quick Booking)
// @route   POST /api/users/patients
// @access  Private (Admin only)
exports.addPatient = async (req, res) => {
  try {
    const { name, email, phone, patient_no, preferred_service, appointment_date, appointment_time, service_id } = req.body;

    if (!name || !phone || !patient_no) {
      return res.status(400).json({ message: 'Missing required patient fields (name, phone, patient_no)' });
    }

    // Handle optional email
    const finalEmail = email || `patient_${Date.now()}@lumedental.internal`;

    // Check if user exists
    const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ? AND email IS NOT NULL', [finalEmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const [existingNo] = await db.query('SELECT * FROM users WHERE patient_no = ? AND patient_no IS NOT NULL', [patient_no]);
    if (existingNo.length > 0) {
      return res.status(400).json({ message: `Patient No '${patient_no}' is already assigned` });
    }

    // Auto-generate a temporary password
    const tempPassword = 'Lume' + Math.floor(1000 + Math.random() * 9000);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Insert user
    const [userResult] = await db.query(
      `INSERT INTO users (name, email, phone, patient_no, preferred_service, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, 'patient')`,
      [name, finalEmail, phone, patient_no, preferred_service || null, hashedPassword]
    );

    const userId = userResult.insertId;

    // Create Appointment if details provided
    if (appointment_date && appointment_time && service_id) {
      await db.query(
        `INSERT INTO appointments (user_id, name, email, phone, service_id, appointment_date, status) VALUES (?, ?, ?, ?, ?, ?, 'confirmed')`,
        [userId, name, finalEmail, phone, service_id, `${appointment_date}T${appointment_time}`]
      );
    }

    res.status(201).json({ 
      message: 'Patient registered and booking confirmed', 
      id: userId,
      tempPassword 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single patient profile with records & treatment history
// @route   GET /api/users/patients/:id
// @access  Private (Admin only)
exports.getPatientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get basic info
    const [users] = await db.query('SELECT id, name, email, phone, created_at FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ message: 'Patient not found' });
    const user = users[0];

    // 2. Get medical record
    const [records] = await db.query('SELECT medical_history, allergies FROM patient_records WHERE user_id = ?', [id]);
    const record = records[0] || { medical_history: '', allergies: '' };

    // 3. Get treatment history
    const [appointments] = await db.query(`
      SELECT a.*, s.name as service_name 
      FROM appointments a 
      LEFT JOIN services s ON a.service_id = s.id 
      WHERE a.user_id = ? OR a.email = ?
      ORDER BY a.appointment_date DESC
    `, [id, user.email]);

    res.json({
      ...user,
      record,
      history: appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update patient medical record
// @route   PUT /api/users/patients/:id/record
// @access  Private (Admin only)
exports.updatePatientRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { medical_history, allergies } = req.body;

    // Check if record exists
    const [existing] = await db.query('SELECT id FROM patient_records WHERE user_id = ?', [id]);
    
    if (existing.length > 0) {
      await db.query('UPDATE patient_records SET medical_history = ?, allergies = ? WHERE user_id = ?', [medical_history, allergies, id]);
    } else {
      await db.query('INSERT INTO patient_records (user_id, medical_history, allergies) VALUES (?, ?, ?)', [id, medical_history, allergies]);
    }

    res.json({ message: 'Patient record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Private (Admin only)
exports.getPatients = async (req, res) => {
  try {
    const [patients] = await db.query("SELECT id, name, email, phone, created_at FROM users WHERE role = 'patient' ORDER BY created_at DESC");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
