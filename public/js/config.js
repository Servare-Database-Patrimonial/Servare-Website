// Configuración de enlaces para Servare Website
// Este archivo maneja la separación entre la página web y la aplicación

const SERVARE_CONFIG = {
    // URL de la aplicación (cambiar según el entorno)
    APP_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://servare.cloud/app',
    
    // URL de la página web
    WEBSITE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : 'https://servare.cloud',
    
    // Configuración de enlaces
    LINKS: {
        APP_ACCESS: '/app',
        APP_DOWNLOAD: '/download',
        CONTACT: '/contacto',
        ABOUT: '/que-es',
        METHODOLOGY: '/metodologia',
        LIBRARY: '/biblioteca',
        SHOWCASE: '/vitrina'
    },
    
    // Configuración de analytics
    ANALYTICS: {
        ENABLED: true,
        TRACKING_ID: 'GA_TRACKING_ID' // Cambiar por tu ID de Google Analytics
    },
    
    // Configuración de contacto
    CONTACT: {
        EMAIL: 'servare.dp@gmail.com',
        PHONE: '+56 9 1234 5678',
        ADDRESS: 'Santiago, Chile'
    }
};

// Función para redirigir a la aplicación
function redirectToApp() {
    window.location.href = SERVARE_CONFIG.APP_URL;
}

// Función para abrir enlace externo
function openExternalLink(url, newTab = true) {
    if (newTab) {
        window.open(url, '_blank');
    } else {
        window.location.href = url;
    }
}

// Función para manejar enlaces de la aplicación
function handleAppLinks() {
    const appLinks = document.querySelectorAll('a[href="/app"]');
    appLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToApp();
        });
    });
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SERVARE_CONFIG;
} else {
    window.SERVARE_CONFIG = SERVARE_CONFIG;
    window.redirectToApp = redirectToApp;
    window.openExternalLink = openExternalLink;
    window.handleAppLinks = handleAppLinks;
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleAppLinks);
    } else {
        handleAppLinks();
    }
}
