# Servare Website

Página web corporativa de Servare - Database Patrimonial con autenticación Auth0.

## 🏗️ Arquitectura

- **Sitio Web Principal**: Landing page corporativa estática  
- **Autenticación**: Auth0 Universal Login
- **Aplicación**: Redirige a servare.cloud/app después del login

## 🚀 URLs de Producción

- **Sitio Web**: https://servare.cloud (GitHub Pages)
- **Aplicación**: https://servare.cloud/app (Firebase Hosting)

## 🔐 Flujo de Autenticación

1. Usuario entra a `servare.cloud`
2. Presiona "Iniciar Sesión" 
3. Redirige a Auth0 Universal Login
4. Después del login → `servare.cloud/app`

## 📁 Estructura del Proyecto

```
public/                 # GitHub Pages deployment
├── css/               # Estilos del sitio web
├── js/                
│   ├── auth.js        # Auth0 integration
│   ├── config.js      # URLs y configuración
│   └── script.js      # Funcionalidad del sitio
├── images/            # Assets del sitio
└── index.html         # Página principal
```

## 🛠️ Desarrollo Local

```bash
npm install
npm run dev    # localhost:3001
```

## 🚀 Despliegue

```bash
git add .
git commit -m "Update website"  
git push origin main
```

GitHub Pages actualiza automáticamente.

## ⚙️ Configuración Auth0

- **Domain**: dev-dysfldhoupz0fbe8.us.auth0.com
- **Client ID**: 0kwrYniO2IjhdYrqPIOx2Aoc2N9jz6iv  
- **Callback URL**: https://servare.cloud/app

## 📞 Contacto

- **Email**: servare.dp@gmail.com
- **LinkedIn**: @servare-database-patrimonial
