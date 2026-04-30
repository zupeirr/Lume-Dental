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

    // 5. Get Recent 5 Appointments
    const [recentAppointments] = await db.query(`
      SELECT a.*, s.name as service_name 
      FROM appointments a 
      LEFT JOIN services s ON a.service_id = s.id 
      ORDER BY a.created_at DESC 
      LIMIT 5
    `);

    res.json({
      totalUsers,
      totalAppointments,
      pendingAppointments,
      totalServices,
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
