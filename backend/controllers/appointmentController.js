const db = require('../config/db');

// @desc    Book a new appointment (Guest & Logged-in User)
// @route   POST /api/appointments
// @access  Public (Optional Auth)
exports.bookAppointment = async (req, res) => {
  try {
    const { name, email, phone, service_id, appointment_date, comments } = req.body;
    
    // Check if user is logged in (req.user will be populated if token is passed)
    // We will handle token manually here to allow optional authentication
    let user_id = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        user_id = decoded.id;
      } catch (err) {
        // Invalid token, just proceed as guest
      }
    }

    // Validation
    if (!name || !phone || !appointment_date || !service_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Allow multiple bookings per day (validation removed)

    // Insert Appointment
    await db.query(
      `INSERT INTO appointments 
      (user_id, name, email, phone, service_id, appointment_date, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, email || null, phone, service_id, appointment_date, comments || null]
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
      `SELECT a.*, s.name as service_name 
       FROM appointments a 
       LEFT JOIN services s ON a.service_id = s.id 
       ORDER BY a.appointment_date DESC`
    );
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id
// @access  Private (Admin only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
