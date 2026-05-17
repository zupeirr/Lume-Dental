const db = require('../config/db');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    // 1. Get Total Stats
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = users[0].count;

    const [appointments] = await db.query('SELECT COUNT(*) as count FROM appointments');
    const totalAppointments = appointments[0].count;

    const [pending] = await db.query("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
    const pendingAppointments = pending[0].count;

    const [services] = await db.query('SELECT COUNT(*) as count FROM services');
    const totalServices = services[0].count;

    // 2. Get Appointments Over Time
    const [appointmentsByDate] = await db.query(`
      SELECT DATE(appointment_date) as date, COUNT(*) as total
      FROM appointments
      GROUP BY DATE(appointment_date)
      ORDER BY date
    `);

    // 3. Get Services Popularity
    const [serviceStats] = await db.query(`
      SELECT s.name, COUNT(a.id) as total
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      GROUP BY s.name
      ORDER BY total DESC
    `);

    // 4. Get Appointment Status Breakdown
    const [statusStats] = await db.query(`
      SELECT status, COUNT(*) as total
      FROM appointments
      GROUP BY status
    `);

    // 5. Get All Appointments (no limit)
    const [recentAppointments] = await db.query(`
      SELECT a.*, s.name as service_name, d.name as dentist_name
      FROM appointments a 
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN dentists d ON a.dentist_id = d.id
      ORDER BY a.created_at DESC
    `);

    // 6. Get Revenue Stats
    const [revenue] = await db.query("SELECT SUM(amount) as total FROM appointments WHERE payment_status = 'paid'");
    const totalRevenue = revenue[0].total || 0;

    const [pendingRevenue] = await db.query("SELECT SUM(amount) as total FROM appointments WHERE payment_status = 'unpaid'");
    const pendingPayments = pendingRevenue[0].total || 0;

    res.json({
      totalUsers,
      totalAppointments,
      pendingAppointments,
      totalServices,
      totalRevenue,
      pendingPayments,
      appointmentsByDate,
      serviceStats,
      statusStats,
      recentAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get unique patient list aggregated from all appointments
// @route   GET /api/dashboard/patients
// @access  Private (Admin only)
exports.getPatientList = async (req, res) => {
  try {
    // Aggregate unique patients from appointments by email (or name if no email)
    const [patients] = await db.query(`
      SELECT
        email,
        name,
        phone,
        COUNT(*) as total_visits,
        MAX(appointment_date) as last_visit,
        MIN(appointment_date) as first_visit,
        SUM(amount) as total_spent,
        GROUP_CONCAT(DISTINCT s.name) as services_used,
        MAX(a.status) as last_status
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      GROUP BY COALESCE(NULLIF(email,''), name)
      ORDER BY last_visit DESC
    `);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
