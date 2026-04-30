<div align="center">

# 🦷 LUME DENTAL

**Premium Dental Care — Precision, Comfort & Confidence**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

*A high-performance, visually refined dental clinic website — built for a premium patient experience.*

</div>

---

## ✨ Overview

**Lume Dental** is a fully responsive, production-ready frontend for a modern dental clinic. It combines clinical precision with a sleek dark-mode aesthetic to establish trust and professionalism at first glance. The site features smooth micro-animations, a functional appointment booking modal, and a clearly structured service menu — all designed to convert visitors into patients.

> Currently accepting new patients. Book directly from the site.

---

## 🖥️ Live Preview

> Run locally with `npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
lume-dental/
├── public/                  # Static assets & clinic imagery
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Sticky navigation with booking CTA
│   │   ├── Hero.tsx          # Full-width hero with animated headline
│   │   ├── Features.tsx      # "Why Choose Us" — 4 key differentiators
│   │   ├── Services.tsx      # Cosmetic, Implants & Restorative sections
│   │   ├── Gallery.tsx       # Clinic gallery with hover effects
│   │   ├── Pricing.tsx       # Transparent service pricing cards
│   │   ├── Experts.tsx       # Meet the dental professionals
│   │   ├── Testimonials.tsx  # Patient reviews & social proof
│   │   ├── Contact.tsx       # Contact form & clinic details
│   │   ├── CTASection.tsx    # Final conversion section
│   │   ├── Footer.tsx        # Clinic hours, links & copyright
│   │   └── BookingModal.tsx  # Appointment booking overlay
│   ├── App.tsx               # Root component & booking state
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles & design tokens
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zupeirr/FUTURE_FS_03.git
cd FUTURE_FS_03

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your GEMINI_API_KEY in the .env file

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server on port 3000 |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with TypeScript compiler |
| `npm run clean` | Remove the `dist/` directory |

---

## 🏥 Sections & Features

| Section | Description |
|---|---|
| **Hero** | Animated headline, patient badge, dual CTA buttons |
| **Features** | State-of-the-art equipment, expert team, pain-free care, personalized plans |
| **Services** | Cosmetic Dentistry · Dental Implants · Restorative Care |
| **Gallery** | Clinic photography with grayscale-to-color hover effect |
| **Pricing** | Preventative · Cosmetic · Restorative — transparent pricing cards |
| **Experts** | Team bios with specializations |
| **Testimonials** | Patient reviews with star ratings |
| **Contact** | Validated contact form + clinic location details |
| **CTA** | Final booking push with animated button |
| **Booking Modal** | Full-screen appointment booking overlay |

---

## 💰 Service Pricing

| Category | Service | Starting Price |
|---|---|---|
| Preventative | Comprehensive Checkup | from $150 |
| Preventative | Professional Cleaning | from $120 |
| Preventative | Digital X-Rays | from $80 |
| Cosmetic ⭐ | Professional Whitening | from $350 |
| Cosmetic ⭐ | Porcelain Veneers | from $1,200/tooth |
| Cosmetic ⭐ | Invisalign® | Custom Quote |
| Restorative | Tooth-Colored Fillings | from $200 |
| Restorative | Dental Crowns | from $900 |
| Restorative | Dental Implants | from $2,500 |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI component framework |
| **TypeScript 5.8** | Type safety & developer experience |
| **Vite 6** | Lightning-fast build tooling |
| **Tailwind CSS v4** | Utility-first styling system |
| **Motion (Framer Motion)** | Smooth scroll & micro-animations |
| **Lucide React** | Consistent icon library |
| **React Hook Form** | Performant form handling |
| **Zod** | Schema validation |
| **Google Gemini AI** | AI-powered features (via `@google/genai`) |

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required — Gemini AI API key for AI-powered features
GEMINI_API_KEY="your_gemini_api_key_here"

# Required — Deployed app URL (used for callbacks & self-referential links)
APP_URL="https://your-app-url.com"
```

> ⚠️ Never commit your `.env` file. It is already excluded via `.gitignore`.

---

## 🕒 Clinic Hours

| Day | Hours |
|---|---|
| Monday – Friday | 9:00 AM – 6:00 PM |
| Saturday | 10:00 AM – 3:00 PM |
| Sunday | Closed |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for **LUME DENTAL** — *Your Perfect Smile Starts Here.*

© 2024 Lume Dental Systems Inc. All Rights Reserved.

</div>
