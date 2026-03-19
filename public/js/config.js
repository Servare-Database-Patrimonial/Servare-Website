// URL configuration for Servare Website

var SERVARE_CONFIG = {
  APP_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://servare-91966.web.app',

  WEBSITE_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://servare.cloud',

  CONTACT: {
    EMAIL: 'servare@management.cloud',
    LINKEDIN: 'https://www.linkedin.com/company/servare-database-patrimonial',
    LOCATION: 'Santiago, Chile'
  }
};

// Redirect to app
function redirectToApp(e) {
  if (e) e.preventDefault();
  window.location.href = SERVARE_CONFIG.APP_URL;
}
