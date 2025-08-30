# Servare Website

Página web corporativa de Servare - Database Patrimonial, configurada para servir tanto el sitio web como la aplicación React Native Web.

## Estructura del Proyecto

```
Servare-website/
├── public/                 # Contenido estático del sitio web
│   ├── app/               # Aplicación React Native Web compilada
│   │   ├── index.html     # Punto de entrada de la app
│   │   └── static/        # Assets de la aplicación
│   ├── css/               # Estilos del sitio web
│   ├── js/                # JavaScript del sitio web
│   │   └── config.js      # Configuración de URLs y enlaces
│   ├── images/            # Imágenes del sitio web
│   └── index.html         # Página principal del sitio web
├── netlify.toml           # Configuración para Netlify
├── vercel.json            # Configuración para Vercel
└── package.json           # Configuración del proyecto
```

## URLs de Producción

- **Sitio Web**: https://servare.cloud
- **Aplicación**: https://servare.cloud/app

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# O usar el comando estándar
npm start
```

El sitio estará disponible en:
- Sitio web: http://localhost:3001
- Aplicación: http://localhost:3001/app

## Despliegue

### Netlify (Recomendado)
```bash
npm run deploy:netlify
```

### Vercel
```bash
npm run deploy:vercel
```

### Manual
Sube la carpeta `public/` a tu servicio de hosting estático.

## Configuración

### URLs de Producción
Las URLs se configuran automáticamente en `public/js/config.js`:
- Producción: https://servare.cloud
- Desarrollo: http://localhost:3001

### Dominios Personalizados
Para usar un dominio personalizado, actualiza:
1. `public/js/config.js` - URLs de producción
2. `netlify.toml` o `vercel.json` - Configuración del hosting

## Funcionalidades

- ✅ Sitio web corporativo estático
- ✅ Aplicación React Native Web integrada
- ✅ Routing automático para `/app`
- ✅ Configuración de headers de seguridad
- ✅ Cache optimizado para assets estáticos
- ✅ Enlaces dinámicos entre sitio web y aplicación

## Arquitectura

El proyecto maneja dos aplicaciones en una:
1. **Sitio Web** (`/`): Landing page corporativa estática
2. **Aplicación** (`/app`): React Native Web compilada

Los enlaces entre ambas se manejan automáticamente mediante `config.js`.

## Soporte

Para cambios en el código local que se reflejen en servare.cloud, asegúrate de:
1. Hacer cambios en esta carpeta `Servare-website/`
2. Desplegar usando `npm run deploy:netlify` o `npm run deploy:vercel`
3. Los cambios se verán reflejados en https://servare.cloud

## Contacto

- Email: servare.dp@gmail.com
- LinkedIn: @servare-database-patrimonial
