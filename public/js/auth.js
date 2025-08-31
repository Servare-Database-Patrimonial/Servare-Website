// Sistema de autenticación Auth0 para el sitio web principal
// Maneja login y redirección a la aplicación

console.log(`
    🏛️  Servare Database Patrimonial - Auth0 Integration
    
    Autenticación centralizada con Auth0
    Redirigiendo a la aplicación tras login exitoso
`);

// Auth0 Configuration
const AUTH0_CONFIG = {
  domain: 'dev-dysfldhoupz0fbe8.us.auth0.com',
  clientId: '0kwrYniO2IjhdYrqPIOx2Aoc2N9jz6iv'
};

// Auth0 Web SDK
let auth0Client = null;

// Wait for Auth0 SDK to load
function waitForAuth0SDK() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    const checkSDK = () => {
      attempts++;
      if (typeof window.createAuth0Client !== 'undefined') {
        resolve(window.createAuth0Client);
      } else if (attempts >= maxAttempts) {
        reject(new Error('Auth0 SDK failed to load after 5 seconds'));
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    
    checkSDK();
  });
}

// Initialize Auth0
async function initAuth0() {
  if (auth0Client) return auth0Client;
  
  try {
    console.log('🔐 Waiting for Auth0 SDK...');
    const createAuth0Client = await waitForAuth0SDK();
    console.log('✅ Auth0 SDK loaded');
    
    auth0Client = await createAuth0Client({
      domain: AUTH0_CONFIG.domain,
      clientId: AUTH0_CONFIG.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin + '/app',
        scope: 'openid profile email'
      }
    });
    
    console.log('✅ Auth0 client initialized');
    return auth0Client;
  } catch (error) {
    console.error('❌ Error initializing Auth0:', error);
    throw error;
  }
}

// Manejar login con Auth0 - Redirección directa
async function handleLogin(e) {
  if (e) e.preventDefault();
  
  try {
    console.log('🔐 Iniciando login con Auth0...');
    
    // Mostrar loading en todos los botones de login
    const loginBtns = document.querySelectorAll('#login-btn, #app-access-btn, #login-submit-btn');
    loginBtns.forEach(btn => {
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Conectando con Auth0...';
      }
    });
    
    // Construir URL de Auth0 manualmente para máxima compatibilidad
    const redirectUri = encodeURIComponent('https://servare-91966.web.app');
    const state = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 15);
    
    const auth0URL = `https://${AUTH0_CONFIG.domain}/authorize?` +
      `response_type=code&` +
      `client_id=${AUTH0_CONFIG.clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=openid%20profile%20email&` +
      `state=${state}&` +
      `nonce=${nonce}`;
    
    console.log('🚀 Redirigiendo a Auth0...');
    
    // Redirigir directamente
    window.location.href = auth0URL;
    
  } catch (error) {
    console.error('❌ Error en login Auth0:', error);
    
    // Mostrar error
    const errorMsg = `Error al conectar con Auth0: ${error.message}`;
    alert(errorMsg);
    
    // Restaurar botones
    const loginBtns = document.querySelectorAll('#login-btn, #app-access-btn, #login-submit-btn');
    loginBtns.forEach(btn => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.id === 'login-btn' ? 'Iniciar Sesión' : 'Acceder a la APP';
      }
    });
  }
}

// Función para redirigir directamente a la app (para botones que no requieren modal)
async function redirectToApp() {
  console.log('🚀 Redirigiendo a la aplicación...');
  await handleLogin();
}

// Funciones del modal (mantener compatibilidad)
function openLoginModal() {
  console.log('📱 Modal solicitado - redirigiendo directamente a Auth0');
  handleLogin();
}

function closeLoginModal() {
  // No hacer nada - Auth0 maneja el flujo
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM loaded - Configurando Auth0...');
  
  // Conectar botón principal "Iniciar Sesión"
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
    console.log('✅ Botón "Iniciar Sesión" conectado');
  }
  
  // Conectar botón "Acceder a la APP" (si existe)
  const appAccessBtn = document.getElementById('app-access-btn');
  if (appAccessBtn) {
    appAccessBtn.addEventListener('click', redirectToApp);
    console.log('✅ Botón "Acceder a la APP" conectado');
  }
  
  // Conectar formulario de login modal (si existe)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('✅ Formulario de login conectado');
  }
  
  // Conectar botón de submit del formulario (si existe)
  const loginSubmitBtn = document.getElementById('login-submit-btn');
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener('click', handleLogin);
    console.log('✅ Botón submit conectado');
  }
  
  console.log('🔐 Auth0 system ready');
});

// Exportar funciones para uso global
window.handleLogin = handleLogin;
window.redirectToApp = redirectToApp;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;

// Estado del usuario (simplificado para Auth0)
let currentUser = null;

console.log('🚀 Auth0 authentication system loaded');