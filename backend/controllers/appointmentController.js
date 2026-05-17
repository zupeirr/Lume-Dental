const db = require('../config/db');

// @desc    Book a new appointment (Guest & Logged-in User)
// @route   POST /api/appointments
// @access  Public (Optional Auth)
exports.bookAppointment = async (req, res) => {
  try {
    const { name, email, phone, service_id, appointment_date, comments, dentist_id } = req.body;
    
    // Check if user is logged in
    let user_id = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        user_id = decoded.id;
      } catch (err) {}
    }


    // Double Booking Check (if dentist assigned)
    if (dentist_id) {
      const [overlap] = await db.query(
        "SELECT id FROM appointments WHERE dentist_id = ? AND appointment_date = ? AND status != 'cancelled'",
        [dentist_id, appointment_date]
      );
      if (overlap.length > 0) {
        return res.status(400).json({ message: "This dentist already has an appointment at this time slot." });
      }
    }

    // Insert Appointment
    await db.query(
      `INSERT INTO appointments 
      (user_id, name, email, phone, service_id, appointment_date, comments, dentist_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, email || null, phone, service_id, appointment_date, comments || null, dentist_id || null]
    );

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin only)
exports.getAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(
      `SELECT a.*, s.name as service_name, d.name as dentist_name 
       FROM appointments a 
       LEFT JOIN services s ON a.service_id = s.id 
       LEFT JOIN dentists d ON a.dentist_id = d.id
       ORDER BY a.appointment_date DESC`
    );
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update appointment details
// @route   PATCH /api/appointments/:id
// @access  Private (Admin only)
exports.updateAppointment = async (req, res) => {
  try {
    const { status, amount, payment_status, notes, dentist_id } = req.body;
    const { id } = req.params;

    // Build update query dynamically
    let updates = [];
    let params = [];

    if (status) { updates.push("status = ?"); params.push(status); }
    if (amount !== undefined) { updates.push("amount = ?"); params.push(amount); }
    if (payment_status) { updates.push("payment_status = ?"); params.push(payment_status); }
    if (notes !== undefined) { updates.push("notes = ?"); params.push(notes); }
    if (dentist_id !== undefined) { updates.push("dentist_id = ?"); params.push(dentist_id); }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    params.push(id);
    const [result] = await db.query(
      `UPDATE appointments SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
