// Sistema de autenticación Auth0 para el sitio web principal
// Maneja login y redirección a la aplicación

console.log(`
    🏛️  Servare Database Patrimonial - Simplified Auth
    
    Redirigiendo a la aplicación para autenticación
`);

// Sistema simplificado - sin Auth0 en el website

// Redirigir directamente a la aplicación para login
async function handleLogin(e) {
  if (e) e.preventDefault();
  
  console.log('🚀 Redirigiendo directamente a la aplicación para login...');
  window.location.href = 'https://servare-91966.web.app';
}

// Función para redirigir directamente a la app (para botones que no requieren modal)
async function redirectToApp() {
  console.log('🚀 Redirigiendo a la aplicación...');
  window.location.href = 'https://servare-91966.web.app';
}

// Funciones del modal (mantener compatibilidad)
function openLoginModal() {
  console.log('📱 Modal solicitado - redirigiendo a la app');
  window.location.href = 'https://servare-91966.web.app';
}

function closeLoginModal() {
  // No hacer nada - Auth0 maneja el flujo
}

// Estado de sesión simplificado
function checkAuthStatus() {
  console.log('🔍 Estado de sesión simplificado - siempre mostrar login');
  return { isAuthenticated: false, user: null };
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM loaded - Modo simplificado: todos los botones redirigen a la app');
  
  // Conectar botón "Iniciar Sesión" del header
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
    console.log('✅ Botón "Iniciar Sesión" del header conectado');
  }
  
  // Conectar botón "Iniciar Sesión" del hero
  const heroLoginBtn = document.getElementById('hero-login-btn');
  if (heroLoginBtn) {
    heroLoginBtn.addEventListener('click', handleLogin);
    console.log('✅ Botón "Iniciar Sesión" del hero conectado');
  }
  
  // Conectar botón "Acceder a la APP" (si existe)
  const appAccessBtn = document.getElementById('app-access-btn');
  if (appAccessBtn) {
    appAccessBtn.addEventListener('click', redirectToApp);
    console.log('✅ Botón "Acceder a la APP" conectado');
  }
  
  // Conectar botón del hero "Acceder a la APP" (si existe)
  const heroAppBtn = document.getElementById('hero-app-btn');
  if (heroAppBtn) {
    heroAppBtn.addEventListener('click', redirectToApp);
    console.log('✅ Botón "Acceder a la APP" del hero conectado');
  }
  
  // Conectar botón de la sección app "Iniciar Sesión para Acceder"
  const appSectionLogin = document.getElementById('app-section-login');
  if (appSectionLogin) {
    appSectionLogin.addEventListener('click', handleLogin);
    console.log('✅ Botón "Iniciar Sesión para Acceder" conectado');
  }
  
  // Conectar botón de la sección app "Acceder a la APP"
  const appSectionBtn = document.getElementById('app-section-btn');
  if (appSectionBtn) {
    appSectionBtn.addEventListener('click', redirectToApp);
    console.log('✅ Botón "Acceder a la APP" de sección conectado');
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
  
  console.log('🔐 Sistema simplificado listo - todos los botones redirigen a /app');
});

// Exportar funciones para uso global
window.handleLogin = handleLogin;
window.redirectToApp = redirectToApp;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;

// Agregar botón de perfil al header
function addProfileButton(user) {
  const header = document.querySelector('header .container');
  if (header && !document.getElementById('profile-btn')) {
    const profileBtn = document.createElement('button');
    profileBtn.id = 'profile-btn';
    profileBtn.className = 'profile-btn';
    profileBtn.innerHTML = `
      <img src="${user.picture || 'https://via.placeholder.com/32'}" alt="Perfil" class="profile-avatar">
      <span>${user.name || user.email}</span>
    `;
    profileBtn.onclick = () => showProfileModal(user);
    header.appendChild(profileBtn);
  }
}

// Mostrar modal de perfil
function showProfileModal(user) {
  const modal = document.createElement('div');
  modal.id = 'profile-modal';
  modal.className = 'modal profile-modal';
  modal.innerHTML = `
    <div class="modal-content profile-content">
      <span class="close-profile" onclick="closeProfileModal()">&times;</span>
      
      <div class="profile-header">
        <img src="${user.picture || 'https://via.placeholder.com/80'}" alt="Avatar" class="profile-avatar-large">
        <h2>${user.name || user.email}</h2>
        <p class="profile-email">${user.email}</p>
      </div>
      
      <div class="profile-info">
        <div class="profile-field">
          <label>Nombre de usuario:</label>
          <span>${user.nickname || user.name || 'No especificado'}</span>
        </div>
        
        <div class="profile-field">
          <label>Email verificado:</label>
          <span class="${user.email_verified ? 'verified' : 'unverified'}">
            ${user.email_verified ? '✅ Verificado' : '⚠️ No verificado'}
          </span>
        </div>
        
        <div class="profile-field">
          <label>Última actualización:</label>
          <span>${new Date(user.updated_at).toLocaleDateString('es-ES')}</span>
        </div>
        
        <div class="profile-field">
          <label>Proveedor de autenticación:</label>
          <span>🔒 Auth0</span>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn-secondary" onclick="window.location.href='https://servare.cloud/app'">
          🚀 Ir a la Aplicación
        </button>
        <button class="btn-danger" onclick="handleLogout()">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Cerrar modal de perfil
function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) {
    modal.remove();
  }
}

// Manejar logout
async function handleLogout() {
  try {
    console.log('🚪 Cerrando sesión...');
    
    const client = await initAuth0();
    await client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    
    // Remover elementos de usuario autenticado
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) profileBtn.remove();
    
    closeProfileModal();
    
    // Restaurar botones de login
    const loginBtns = document.querySelectorAll('#login-btn, #app-access-btn');
    loginBtns.forEach(btn => {
      if (btn) {
        btn.textContent = btn.id === 'login-btn' ? 'Iniciar Sesión' : 'Acceder a la APP';
        btn.onclick = handleLogin;
      }
    });
    
    console.log('✅ Sesión cerrada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Intenta de nuevo.');
  }
}

// Estado del usuario (simplificado para Auth0)
let currentUser = null;

console.log('🚀 Auth0 authentication system loaded');