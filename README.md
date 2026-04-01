# Servare Website

Corporate website for Servare Database Patrimonial - Professional heritage management platform.

## 🌐 Live Website

- **Production**: [servare.cloud](https://servare.cloud)
- **Application**: [servare.cloud/app](https://servare.cloud/app)

## 🏗️ Architecture

This is a **static corporate website** that serves as the marketing presence and entry point to the Servare React Native Web application.

### Dual-Serving Pattern
- **Website** (`/`) - Corporate landing page with features, methodology, and contact information
- **App Access** (`/app`) - Redirects to the React Native Web application via Cloudflare rules

## ⚡ Quick Start

### Development
```bash
npm install
npm run dev
```

Access at: `http://localhost:3001`

### Deployment
```bash
# Deploy to Netlify (primary)
npm run deploy:netlify

# Deploy to Vercel (alternative)
npm run deploy:vercel
```

## 📁 Project Structure

```
Servare-Website/
├── public/                     # Static website files
│   ├── index.html             # Main landing page
│   ├── css/style.css          # Website styles
│   ├── js/
│   │   ├── config.js          # Environment configuration
│   │   ├── script.js          # Website functionality
│   │   └── auth.js            # Simplified auth redirects
│   └── images/                # Website assets
├── assets/logos/              # Brand logo system
├── netlify.toml              # Netlify configuration
├── vercel.json               # Vercel configuration
└── package.json              # Dependencies
```

## 🔧 Configuration

### Environment URLs
The website automatically adapts to development vs production:

- **Development**: Redirects to `http://localhost:3000`
- **Production**: Redirects to `servare.cloud/app` → Firebase hosting

### Cloudflare Setup
Production uses Cloudflare redirect rules:
- `servare.cloud/app` → `https://servare-91966.web.app`

## 🎯 Features

### Corporate Website
- **Authentic Origin Story**: "Del terreno al código digital" narrative showcasing desert archaeological origins
- **Professional Heritage Presentation**: Complete methodology showcase focused on conservadores/restauradores
- **Visual Integration**: Hero background with aerial saltern office photo and team award recognition
- **Responsive Design**: Mobile-first approach optimized for all devices

### Functional Contact System (Updated Sept 13, 2025)
- **EmailJS Integration**: Fully functional contact form with organized email categorization
- **5 Contact Categories**: Implementación, Colaboración, Apoyo, Beta Access, Demo, General
- **8 Professional Areas**: Arqueología, Museos, Conservación, Archivos, Paleontología, etc.
- **Smart Email Formatting**: Priority tags and structured information for easy identification
- **Dynamic Fields**: Conditional "Other" fields for custom professional areas and interests

### Beta Access System
- **"Acceso Beta Cerrada"**: Updated button text reflecting current development phase
- **Beta Request Integration**: Direct routing to contact form with beta access category
- **Priority Handling**: High-priority tagging for beta access requests

### Authentication Integration
- **Simplified Flow**: Direct redirect to React Native Web app
- **No Auth0 SDK**: Optimized performance, no loading issues
- **Seamless UX**: One-click access from website to authentication

### SEO Optimized
- Semantic HTML structure
- Meta tags for social sharing
- Structured data for heritage management
- Fast loading static files

## 🚀 Hosting

### Primary: Netlify
- **Domain**: servare.cloud
- **Features**: Auto-deploy, custom headers, redirects
- **Config**: `netlify.toml`

### Alternative: Vercel
- **Config**: `vercel.json`
- **Features**: Edge functions, analytics

## 📧 Contact Integration

- **Email**: servare.dp@gmail.com
- **LinkedIn**: @servare-database-patrimonial
- **Location**: Santiago, Chile

## 🏆 Achievements

**All In Chile 2024 - DUOC UC National Competition Winner**
- Selected from 1,300+ innovative projects
- National recognition for heritage technology innovation
- Team photo and recognition prominently featured on website

## ⚠️ Technical Notes

### Current Status (September 13, 2025)
- ✅ **Complete Content Overhaul**: Authentic origin story integration with desert archaeological narrative
- ✅ **Visual Enhancement**: Hero background and team recognition photos integrated
- ✅ **EmailJS Contact System**: Fully functional with categorized email processing
- ✅ **Beta Access Flow**: Complete "Acceso Beta Cerrada" implementation
- ✅ **Production Deployment**: All improvements live at servare.cloud
- ✅ **Complete Auth0 migration**: Simplified authentication flow
- ✅ **Performance optimized**: No Auth0 SDK loading issues
- ✅ **Security enhanced**: Removed potential vulnerabilities

### App Integration
This website works in conjunction with the **Servare App-Web** project. The React Native Web build is hosted separately on Firebase and accessed via Cloudflare redirects.

### Future Enhancements
- **Biblioteca Patrimonial**: Heritage resource library (currently commented out)
- **Vitrina de Fichas**: Public record showcase (development pending)
- **Microservices (E2)**: Planned architecture for enhanced scalability
- **Production EmailJS**: Upgrade from development to production keys
- **Advanced SEO**: Further search engine optimization
- **Progressive Web App**: Enhanced mobile experience

## 📚 Documentation

For detailed development information, see `CLAUDE.md`.

---

**Business Context**: Servare transforms heritage management with intelligent technology and standardized methodologies, serving museums, archaeological sites, and cultural institutions worldwide.