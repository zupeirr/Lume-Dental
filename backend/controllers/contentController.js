const db = require('../config/db');

// Default content used the very first time (seeds the DB)
const DEFAULTS = {
  services: JSON.stringify([
    {
      title: "Cosmetic Dentistry",
      description: "Enhance the aesthetics of your smile with premium veneers, whitening, and smile contouring.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1nSqxo1i0irC_dlAJU5q-9MRcKxSFwnAFN0L8mdsaGh-ZZUpQop34_GZpVJbTBmWhUerUVvnLoJlztBSV8EIbl3l7Rq7EoM_giANRqj4mNHH-3l8AsECOuFcN5FG62y8QvWOnFDmRVfnzAMDyOW18iWaDE481croVfT2RK_UnqvqYaegv1ora-t0jy7BldoCgoPzGn_NbAQREsiK24l5S152hDrXNe_jy3Ddlc0k4bBat10zrk3QdarBiRA1ZUiP32PCRiJMd8Z4Z",
      bullets: ["Professional Whitening", "Porcelain Veneers"]
    },
    {
      title: "Dental Implants",
      description: "Permanent, natural-looking tooth replacement solutions using biocompatible titanium materials.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVm84C_CdaVts5Zxez16ARAHDZ8GUNeca-HrmpS6-m1G1Io4V8hu89Yc0gA61IWzv3aMsTgOVtjJRdaidW3IHGwd3qNyImbRwsmKa25wszDTtY_CecBAw27fPSIbgsNgjpj1wIa2a9VsprjAiSG2moMCvvEEHTxjDWzRo6wdr_hQWRQbt2PqG2LeXHxmY4WMvHrjcldTeH7lU5XiTBbQkImc734uXuN0csp0_pDGoSSo1YxSwOXw-tUG8Pz5aRO4fxFDVGpSQkft6r",
      bullets: ["Full Arch Reconstruction", "Guided Surgery"]
    },
    {
      title: "Restorative Care",
      description: "Restoring function and health to damaged teeth with durable, tooth-colored materials.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkxawpiEiFVAMUjUdIiRX9AxDXvkAjZeKG8fOs6TSBNy1Gv0VZeZisliT7lHW-gRqOo4xSX838_GUr7DDiTOfiU1gA_kE49nKZFczwhT9LFk-Ho1elaMXgBFiWLk7uDu04Q9OCEWkSP5xW1J4OQ22zzHAxxPTD-b4DwilG1RcmfeyIX8L6nafQMiidfJ5cr73lKHrRbidy5P9lf3uQaOHfkDjElY0j6JVTfbwV9LmaZcAvxIuJ5HKcCGJm_mDufs5IMPx4FovObnft",
      bullets: ["Metal-Free Fillings", "Precision Crowns"]
    }
  ]),

  pricing: JSON.stringify([
    {
      title: "Preventative Care",
      description: "Essential maintenance for long-term health.",
      highlight: false,
      services: [
        { name: "Comprehensive Checkup", price: "from $150" },
        { name: "Professional Cleaning", price: "from $120" },
        { name: "Digital X-Rays", price: "from $80" }
      ]
    },
    {
      title: "Cosmetic Dentistry",
      description: "Enhance your natural smile confidently.",
      highlight: true,
      services: [
        { name: "Professional Whitening", price: "from $350" },
        { name: "Porcelain Veneers", price: "from $1,200/th" },
        { name: "Invisalign®", price: "Custom Quote" }
      ]
    },
    {
      title: "Restorative Care",
      description: "Repair and restore structural integrity.",
      highlight: false,
      services: [
        { name: "Tooth-Colored Fillings", price: "from $200" },
        { name: "Dental Crowns", price: "from $900" },
        { name: "Dental Implants", price: "from $2,500" }
      ]
    }
  ]),

  gallery: JSON.stringify([
    {
      id: 1,
      title: "Smile Design",
      description: "Full arch reconstruction with precision-fit porcelain veneers.",
      before: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
      after: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Orthodontic Clarity",
      description: "Seamless alignment correction using advanced clear aligner tech.",
      before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800",
      after: "/regenerated_image_1777535324973.png"
    },
    {
      id: 3,
      title: "Restorative Art",
      description: "Ceramic crown replacement restoring both function and aesthetics.",
      before: "/regenerated_image_1777534956328.png",
      after: "/regenerated_image_1777535516110.png"
    }
  ])
};

// @desc    Get all site content sections
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT section, content FROM site_content');
    const result = {};
    rows.forEach(row => {
      try { result[row.section] = JSON.parse(row.content); } catch { result[row.section] = row.content; }
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single content section
// @route   GET /api/content/:section
// @access  Public
exports.getSection = async (req, res) => {
  try {
    const { section } = req.params;
    const [rows] = await db.query('SELECT content FROM site_content WHERE section = ?', [section]);
    if (!rows.length) return res.status(404).json({ message: 'Section not found' });
    res.json(JSON.parse(rows[0].content));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a site content section
// @route   PUT /api/content/:section
// @access  Private (Admin only)
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const allowed = ['services', 'pricing', 'gallery'];
    if (!allowed.includes(section)) {
      return res.status(400).json({ message: 'Invalid section. Allowed: services, pricing, gallery' });
    }

    const content = JSON.stringify(req.body);

    await db.query(
      `INSERT INTO site_content (section, content) VALUES (?, ?)
       ON CONFLICT(section) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP`,
      [section, content]
    );

    res.json({ message: `Section '${section}' updated successfully`, data: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
