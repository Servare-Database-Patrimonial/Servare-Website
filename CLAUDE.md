# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🌐 Common Development Commands

### Local Development
```bash
# Install dependencies  
npm install

# Start development server (recommended)
npm run dev
# or
npm start

# Preview build locally
npm run preview
```

The development server will run at:
- Website: http://localhost:3001
- App integration: http://localhost:3001/app

### Deployment
```bash
# Deploy website to GitHub Pages
git add .
git commit -m "Update website"
git push origin main

# Deploy app to Firebase Hosting
cd "../Servare App-Web"
npm run build:web
firebase deploy --only hosting
```

## 🏗️ Project Architecture

### Project Type
This is a **static corporate website** that serves two purposes:
1. **Corporate Landing Page** (`/`) - Marketing and information website
2. **App Host** (`/app`) - Hosts the compiled React Native Web application

### Technology Stack
- **Static HTML/CSS/JavaScript** - No build process required
- **Live Server** for development
- **GitHub Pages** for website hosting
- **Firebase Hosting** for app hosting

### Dual Architecture Pattern
The project implements a **dual-serving architecture**:
- **Website** (`public/index.html`) - Corporate landing page with sections for features, methodology, contact
- **App** (`public/app/`) - Compiled React Native Web application from the Servare App-Web project

## 📁 Directory Structure

```
Servare-Website/
├── public/                     # Static website files
│   ├── index.html             # Main landing page
│   ├── css/
│   │   └── style.css          # Website styles
│   ├── js/
│   │   ├── config.js          # URL configuration and app linking
│   │   ├── script.js          # Website functionality
│   │   └── auth.js            # Authentication integration
│   ├── images/                # Website assets
│   │   ├── servare-logo.png   # Main logo
│   │   ├── IsotipoColor.png   # Brand isotope
│   │   └── favicon.*          # Favicon files
│   └── app/                   # React Native Web compiled app
│       ├── index.html         # App entry point
│       └── assets/            # App assets and bundles
├── assets/                    # Logo variations and brand assets
│   └── logos/                 # Complete logo system
├── netlify.toml              # Netlify deployment configuration
├── vercel.json              # Vercel deployment configuration
├── firebase.json            # Firebase hosting configuration
└── package.json             # Development dependencies
```

## 🔧 Key Configuration Files

### URL Configuration (`public/js/config.js`)
Central configuration for environment-specific URLs:
```javascript
const SERVARE_CONFIG = {
    APP_URL: hostname === 'localhost' ? 'http://localhost:3000' : 'https://servare.cloud/app',
    WEBSITE_URL: hostname === 'localhost' ? 'http://localhost:3001' : 'https://servare.cloud'
};
```

**Important**: This file automatically handles development vs production URLs and manages navigation between the website and the app.

### Deployment Configurations
- **firebase.json**: Firebase Hosting setup for React Native Web app
- **CNAME**: GitHub Pages custom domain configuration

## 🎯 Website Functionality

### Main Sections
1. **Hero Section** - Value proposition and call-to-action
2. **¿Qué es Servare?** - Problem/solution explanation
3. **Metodología** - Technical capabilities showcase
4. **App Section** - Application access and features
5. **Biblioteca Patrimonial** - Resource library (in development)
6. **Vitrina de Fichas** - Public record showcase (in development)
7. **Contact** - Contact information and collaboration opportunities

### App Integration Features
- **Automatic login detection** - Shows different buttons based on auth state
- **Environment-aware links** - Adapts to development/production
- **Seamless navigation** - Between website and app
- **Phase management** - Shows pilot phase messaging

## 🎨 Visual Identity

### Brand Assets
The website includes a complete logo system in `assets/logos/`:
- **Color variants**: Light and dark theme versions
- **Format variations**: Horizontal, vertical, isotope
- **File formats**: PNG with proper naming convention

### Design System
- **Modern, professional design** focused on heritage management
- **Responsive layout** for all device sizes
- **Consistent typography** using Inter font family
- **Color scheme** matching the Servare brand identity

## 🔗 App Integration

### How It Works
1. **Website serves at root** (`/`) with corporate content
2. **App serves at subpath** (`/app`) with React Native Web build
3. **config.js manages** navigation between both environments
4. **Shared branding** ensures consistent experience

### Development Workflow
1. **Website changes**: Edit files in `public/` directly
2. **App integration**: Copy built app files to `public/app/`
3. **Testing**: Use `npm run dev` to test both parts locally
4. **Deployment**: Deploy entire `public/` folder to hosting service

## 🚀 Hosting and Production

### Website Hosting: GitHub Pages + Cloudflare
- **Domain**: https://servare.cloud (DNS managed by Cloudflare)
- **Hosting**: GitHub Pages with custom domain
- **Configuration**: `CNAME` file + Cloudflare DNS settings

### App Hosting: Firebase Hosting
- **Domain**: https://servare-91966.web.app
- **Features**: Static hosting for React Native Web build
- **Configuration**: `firebase.json`

### Cloudflare Configuration
- **DNS**: Points `servare.cloud` to GitHub Pages
- **Redirect Rules**: Should redirect `servare.cloud/app` → `servare-91966.web.app`

### Production URLs
- **Website**: https://servare.cloud (GitHub Pages via Cloudflare)
- **Application**: https://servare-91966.web.app (Firebase Hosting)

### Custom Domain Setup
The website is configured for the `servare.cloud` domain with proper:
- SSL certificates
- CDN optimization
- SEO meta tags
- Performance optimizations

## 📧 Contact Integration

### Contact Information
- **Email**: servare.dp@gmail.com  
- **LinkedIn**: @servare-database-patrimonial
- **Location**: Santiago, Chile

### Contact Form
The website includes a functional contact form (`#contact-form`) with:
- Name, email, institution, and message fields
- Interest area selection
- JavaScript validation
- Ready for backend integration

## 🎪 Special Features

### Authentication Integration (Updated August 31, 2025)
**Simplified Authentication Flow (COMPLETE):**
- ✅ Direct redirection to React Native Web app for authentication
- ✅ All Auth0 Universal Login handled by the application
- ✅ No Auth0 SDK dependencies on website (performance optimized)
- ✅ Seamless user experience from website to app

**Website Functionality:**
- ✅ Static marketing website with professional presentation
- ✅ "Iniciar Sesión" button redirects directly to `/app` 
- ✅ Cloudflare redirect rules handle routing automatically
- ✅ No session detection needed (simplified architecture)

**Security & Performance:**
- ✅ Eliminated Auth0 SDK loading issues on website
- ✅ Removed potential security bypass vulnerabilities  
- ✅ Optimized loading times (no unnecessary JavaScript)
- ✅ Complete separation of concerns (marketing vs authentication)

### Development Status Indicators  
Some sections show "En Desarrollo" (In Development) badges for:
- Biblioteca Patrimonial
- Vitrina de Fichas

### Achievement Highlighting
The contact section prominently displays:
- **All In Chile 2024 National Competition Winner**
- Competing among 1,300+ innovative projects

### Responsive Design
- Mobile-first approach
- Collapsible navigation
- Optimized images and assets
- Touch-friendly interface
- Profile features adapt to mobile screens

## ⚠️ Important Notes

### Current Status (August 31, 2025)
**Authentication System:**
- ✅ **Complete Auth0 migration**: Fully functional Universal Login
- ✅ **Security vulnerabilities resolved**: No bypasses or unsafe fallbacks
- ✅ **Performance optimized**: Fast loading, no unnecessary dependencies
- ✅ **User experience streamlined**: Direct flow from website to authentication

**Security Status:**
- ✅ **Firebase API key secured**: New restricted key with domain/API limitations
- ✅ **Auth0 production ready**: Using development keys (upgrade to production keys recommended)
- ✅ **Session management secure**: Proper authentication flow without vulnerabilities

### App Integration Dependency
This website is designed to work in conjunction with the **Servare App-Web** project. The compiled React Native Web build should be placed in `public/app/` for full functionality.

### Environment Management
The `config.js` file automatically detects the environment and adjusts URLs accordingly. Always test both development and production configurations.

### Asset Management
- **Website assets**: Store in `public/images/`  
- **Logo variations**: Available in `assets/logos/`
- **App assets**: Managed by the React Native Web build process

### Future Enhancements
1. **Microservices Architecture (E2)**: Future implementation planned for microservices architecture
2. **Production Auth0 Keys**: Upgrade from development to production keys for social connections
3. **Advanced SEO**: Further optimization for search engine performance

## 🔍 SEO and Performance

### SEO Optimization
- Semantic HTML structure
- Meta tags for description and keywords
- Open Graph tags for social sharing
- Structured data for heritage management industry

### Performance Features
- Optimized images with proper sizing
- Minimal JavaScript footprint
- CSS optimization
- Fast loading static files

---

**Business Context**: This is the corporate website for Servare, a heritage management platform that combines traditional conservation methodologies with modern digital tools. The website serves as the primary marketing presence and entry point to the React Native Web application.