<div align="center">

![TechFiesta Banner](./techfiesta_banner.jpeg)

# 🌿 AyuTrace Frontend

### *Blockchain-Powered Ayurvedic Supply Chain Transparency*

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Track. Verify. Trust.** 🔍✨

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

---

</div>

## 🎯 What is AyuTrace?

**AyuTrace** is a revolutionary supply chain management platform designed specifically for the **Ayurvedic medicine industry**. Built for TechFiesta, it leverages **blockchain technology** to ensure transparency, authenticity, and traceability from raw materials to finished products.

> *"In a world where trust is scarce, we make it transparent."

---

## ✨ Features That'll Blow Your Mind

### 🏭 **Multi-Role Dashboard System**
- **Manufacturers** - Track production, batch management, and quality control
- **Distributors** - Modern inventory management with real-time analytics
- **Labs** - Test verification and certification management
- **Checkers** - Quality assurance and compliance verification
- **Admins** - System-wide monitoring and user management

### 🔐 **Blockchain Integration**
- Immutable product history tracking
- Smart contract-based verification
- Tamper-proof supply chain records
- QR code-based product authentication

### 📱 **Modern UX/UI**
- Responsive design that works everywhere
- Dark mode support (coming soon!)
- Real-time analytics with beautiful charts
- Smooth animations with Framer Motion
- Mobile-first navigation

### 🎨 **Tech Stack Highlights**
- ⚡ **Blazing Fast** - Vite for lightning-quick builds
- 🎭 **Beautiful Animations** - Framer Motion for smooth transitions
- 📊 **Data Visualization** - Recharts for stunning analytics
- 🔍 **QR Scanner** - Built-in camera-based product scanning
- 🎯 **Type Safety** - ESLint configured for code quality

---

## 🚀 Quick Start

### Prerequisites

Make sure you have these installed:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A cup of coffee ☕ (highly recommended)

### Installation

```bash
# Clone this awesome repository
git clone https://github.com/adityabhalgat/ayutrace-frontend.git

# Navigate to the project
cd ayutrace-frontend

# Install dependencies (grab that coffee now!)
npm install

# Fire up the dev server 🔥
npm run dev
```

**Boom!** 💥 Your app should now be running at `http://localhost:5173`

---

## 📜 Available Scripts

```bash
# 🔥 Development server with hot reload
npm run dev

# 🏗️ Production build
npm run build

# 🎭 Staging build
npm run build:staging

# 📊 Build with bundle analyzer
npm run build:analyze

# 👀 Preview production build
npm run preview

# 🔍 Lint your code
npm run lint

# 🛠️ Auto-fix linting issues
npm run lint:fix

# 🧹 Clean build directory
npm run clean

# ✅ Type checking
npm run type-check
```

---

## 🏗️ Project Structure

```
ayutrace-frontend/
│
├── 📁 src/
│   ├── 📁 components/        # Reusable React components
│   │   ├── 📁 Admin/         # Admin dashboard components
│   │   ├── 📁 Dashboard/     # Main dashboard components
│   │   ├── 📁 Distributor/   # Distributor-specific components
│   │   ├── 📁 Labs/          # Laboratory testing components
│   │   ├── 📁 Common/        # Shared components (QR Scanner, etc.)
│   │   ├── 📁 Modals/        # Modal dialogs
│   │   └── 📁 UI/            # UI primitives (Loading, Icons, etc.)
│   │
│   ├── 📁 pages/             # Route pages
│   │   ├── landing.jsx       # Landing page
│   │   ├── login.jsx         # Authentication
│   │   ├── AdminDashboard.jsx
│   │   ├── DistributorDashboard.jsx
│   │   └── ... (more dashboards)
│   │
│   ├── 📁 contexts/          # React Context providers
│   │   └── AuthContext.jsx  # Authentication state
│   │
│   ├── 📁 hooks/             # Custom React hooks
│   │   └── useResponsive.js # Responsive design utilities
│   │
│   ├── 📁 utils/             # Utility functions
│   │   ├── jwt.js           # JWT handling
│   │   └── qrReader.js      # QR code processing
│   │
│   ├── 📁 config/            # Configuration files
│   │   ├── blockchain.js    # Blockchain settings
│   │   └── environment.js   # Environment variables
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── api.js               # API client
│
├── 📁 public/               # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
├── package.json             # Dependencies
└── vercel.json              # Deployment config
```

---

## 🎨 Tech Stack Deep Dive

### **Core Framework**
- **React 19.1** - The latest and greatest
- **React Router DOM 6.30** - Client-side routing
- **Vite 7.1** - Next-gen frontend tooling

### **UI & Styling**
- **TailwindCSS 4.1** - Utility-first CSS framework
- **Framer Motion 12.23** - Production-ready animations
- **Heroicons 2.2** - Beautiful hand-crafted SVG icons

### **Data Visualization**
- **Recharts 3.2** - Composable charting library for React

### **QR Code Handling**
- **jsQR** - QR code scanning from camera
- **react-qr-code** - QR code generation
- **qr-code-styling** - Beautiful styled QR codes

### **Development Tools**
- **ESLint** - Code linting and formatting
- **TypeScript checking** - Type safety without full TS migration

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_backend_api_url
VITE_BLOCKCHAIN_NETWORK=your_blockchain_network
VITE_CONTRACT_ADDRESS=your_smart_contract_address
```

### Build Modes

```bash
# Development (with hot reload)
npm run dev

# Staging (for testing)
npm run build:staging

# Production (optimized build)
npm run build
```

---

## 🎯 Key Features Breakdown

### 🔐 Authentication System
- JWT-based authentication
- Role-based access control (RBAC)
- Secure token management
- Protected routes

### 📱 QR Code Scanner
```jsx
import QRScanner from './components/Common/QRScanner';

<QRScanner 
  onScan={(data) => console.log('Scanned:', data)}
  onError={(err) => console.error(err)}
/>
```

### 📊 Analytics Dashboard
- Real-time data visualization
- Interactive charts and graphs
- Supply chain monitoring
- Performance metrics

### 🏭 Product Tracking
- Batch-level traceability
- Raw material verification
- Manufacturing process logs
- Quality control checkpoints
- Distribution tracking

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the project and serve the `dist` folder:

```bash
npm run build
# Upload contents of 'dist' folder to your hosting provider
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### 🚧 In Progress
- [ ] Dark mode implementation
- [ ] Offline support with PWA
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### 🎯 Future Plans
- [ ] AI-powered fraud detection
- [ ] Integration with more blockchain networks
- [ ] Real-time notifications
- [ ] Batch QR code generation
- [ ] Export reports to PDF/Excel

---

## 📚 Documentation

For detailed documentation, visit:
- [User Guide](docs/USER_GUIDE.md)
- [API Reference](docs/API.md)
- [Component Library](docs/COMPONENTS.md)
- [Contributing Guide](CONTRIBUTING.md)

---

<div align="center">

### Made with ❤️ for TechFiesta

**If you found this project helpful, please give it a ⭐!**

<p>
  <a href="#-ayutrace-frontend">Back to Top ↑</a>
</p>

---

*"The future of Ayurvedic supply chain is transparent, and it starts here."* 🌿✨

</div>
