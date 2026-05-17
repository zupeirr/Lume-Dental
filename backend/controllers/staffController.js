const db = require('../config/db');

// @desc    Get all dentists
// @route   GET /api/staff
// @access  Private (Admin)
exports.getDentists = async (req, res) => {
  try {
    const [dentists] = await db.query('SELECT * FROM dentists WHERE is_active = 1');
    res.json(dentists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dentist workload (appointments count per dentist)
// @route   GET /api/staff/workload
// @access  Private (Admin)
exports.getWorkload = async (req, res) => {
  try {
    const [workload] = await db.query(`
      SELECT d.name, 
             (SELECT COUNT(*) FROM appointments a WHERE a.dentist_id = d.id AND a.status != 'cancelled') as appointment_count
      FROM dentists d
      WHERE d.is_active = 1
    `);
    res.json(workload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
