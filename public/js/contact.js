// Sistema de contacto con EmailJS - Servare Website
// Implementa etiquetas categorizadas para fácil identificación de emails

console.log('📧 Sistema de contacto EmailJS cargando...');

// Configuración EmailJS - Servare Database Patrimonial
const EMAIL_CONFIG = {
    SERVICE_ID: 'service_ben531s',      // Service ID configurado
    TEMPLATE_ID: 'template_j2qufea',    // Template ID configurado  
    PUBLIC_KEY: 'ywSkpDeLSkQmNjMxF'     // Public Key configurado
};

// Mapeo de categorías para etiquetas en el email
const CATEGORY_LABELS = {
    'implementacion': {
        tag: '[SERVARE - IMPLEMENTACIÓN INSTITUCIONAL]',
        priority: '🔴 ALTA',
        description: 'Consulta sobre implementación en institución'
    },
    'colaboracion': {
        tag: '[SERVARE - COLABORACIÓN ACADÉMICA]',
        priority: '🟡 MEDIA',
        description: 'Interés en colaboración académica/investigación'
    },
    'apoyo': {
        tag: '[SERVARE - APOYO Y PATROCINIO]',
        priority: '🟢 ALTA',
        description: 'Interés en apoyar y patrocinar el proyecto'
    },
    'beta': {
        tag: '[SERVARE - ACCESO A BETA]',
        priority: '🔴 ALTA',
        description: 'Solicitud de acceso a la versión beta de la plataforma'
    },
    'demo': {
        tag: '[SERVARE - SOLICITUD DEMO]',
        priority: '🔴 ALTA',
        description: 'Solicitud de demostración del producto'
    },
    'otro': {
        tag: '[SERVARE - CONSULTA GENERAL]',
        priority: '🟡 MEDIA',
        description: 'Consulta general o sin categoría específica'
    }
};

// Mapeo de áreas profesionales para mejor identificación
const PROFESSIONAL_AREAS = {
    'arqueologia': 'ARQUEOLOGÍA',
    'museos': 'MUSEOS',
    'conservacion-restauracion': 'CONSERVACIÓN Y RESTAURACIÓN',
    'archivos': 'ARCHIVOS',
    'paleontologia': 'PALEONTOLOGÍA',
    'gestion-cultural': 'GESTIÓN CULTURAL',
    'investigacion': 'INVESTIGACIÓN',
    'educacion': 'EDUCACIÓN',
    'otro-profesional': 'OTRO (ESPECIFICADO)'
};

// Inicializar EmailJS cuando se carga la página
function initializeEmailJS() {
    try {
        if (EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
            console.log('✅ EmailJS inicializado correctamente');
            return true;
        } else {
            console.warn('⚠️ EmailJS no configurado - usando modo demo');
            return false;
        }
    } catch (error) {
        console.error('❌ Error inicializando EmailJS:', error);
        return false;
    }
}

// Funciones auxiliares para formatear información
function getAreaProfesional(formData) {
    if (!formData.area_profesional) {
        return 'No especificada';
    }
    
    if (formData.area_profesional === 'otro-profesional' && formData.otro_area_texto) {
        return `${formData.otro_area_texto.toUpperCase()} (especificado)`;
    }
    
    return PROFESSIONAL_AREAS[formData.area_profesional] || formData.area_profesional.toUpperCase();
}

function getAreaInteres(formData) {
    if (formData.interes === 'otro' && formData.otro_interes_texto) {
        return `${formData.otro_interes_texto.toUpperCase()} (especificado)`;
    }
    
    return formData.interes.toUpperCase();
}

// Función para mostrar/ocultar campos "Otro"
function toggleOtherFields() {
    const areaProfesional = document.getElementById('area-profesional');
    const areaInteres = document.getElementById('interes');
    const otroAreaGroup = document.getElementById('otro-area-group');
    const otroInteresGroup = document.getElementById('otro-interes-group');
    
    // Manejar Área Profesional
    if (areaProfesional && otroAreaGroup) {
        areaProfesional.addEventListener('change', function() {
            if (this.value === 'otro-profesional') {
                otroAreaGroup.style.display = 'block';
                document.getElementById('otro-area-texto').required = true;
            } else {
                otroAreaGroup.style.display = 'none';
                document.getElementById('otro-area-texto').required = false;
                document.getElementById('otro-area-texto').value = '';
            }
        });
    }
    
    // Manejar Área de Interés
    if (areaInteres && otroInteresGroup) {
        areaInteres.addEventListener('change', function() {
            if (this.value === 'otro') {
                otroInteresGroup.style.display = 'block';
                document.getElementById('otro-interes-texto').required = true;
            } else {
                otroInteresGroup.style.display = 'none';
                document.getElementById('otro-interes-texto').required = false;
                document.getElementById('otro-interes-texto').value = '';
            }
        });
    }
}

// Función para enviar email con etiquetas organizadas
async function sendContactEmail(formData) {
    const category = CATEGORY_LABELS[formData.interes] || CATEGORY_LABELS['otro'];
    const timestamp = new Date().toLocaleString('es-ES', {
        timeZone: 'America/Santiago',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Parámetros que coinciden con tu configuración EmailJS actual
    const templateParams = {
        // === VARIABLES QUE COINCIDEN CON TU TEMPLATE ===
        subject: `WEB - ${category.tag} | ${formData.nombre} (${PROFESSIONAL_AREAS[formData.area_profesional] || 'Sin área'}) | ${category.priority}`, // Subject optimizado para {{subject}}
        email_body: `🏛️ NUEVA CONSULTA SERVARE DATABASE PATRIMONIAL
${category.tag}

📊 INFORMACIÓN DEL CONTACTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nombre: ${formData.nombre}
📧 Email: ${formData.email}
🏢 Institución: ${formData.institucion || 'No especificada'}
💼 Cargo: ${formData.cargo || 'No especificado'}
🔬 Área Profesional: ${getAreaProfesional(formData)}
🎯 Área de Interés: ${getAreaInteres(formData)}

📝 MENSAJE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.mensaje}

⚙️ METADATOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha: ${timestamp}
🌐 Origen: ${window.location.href}
📱 Dispositivo: ${navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Escritorio'}
🔍 Prioridad: ${category.priority}

📈 SEGUIMIENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${category.description}

Responder directamente a: ${formData.email}`,
        
        // === DATOS ADICIONALES PARA REFERENCIA ===
        from_name: `Formulario Servare - ${formData.nombre}`, // Cambia el remitente
        reply_to: formData.email, // Para responder directamente al usuario
        user_email: formData.email,
        institution: formData.institucion || 'No especificada',
        position: formData.cargo || 'No especificado',
        interest_area: formData.interes,
        message: formData.mensaje,
        category_tag: category.tag,
        priority: category.priority,
        timestamp: timestamp
    };

    try {
        console.log('📤 Enviando email con parámetros:', templateParams);
        
        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email enviado exitosamente:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return { success: false, error };
    }
}

// Función para mostrar modo demo cuando EmailJS no está configurado
function showDemoMode(formData) {
    const category = CATEGORY_LABELS[formData.interes] || CATEGORY_LABELS['otro'];
    
    console.log(`
📧 MODO DEMO - Email que se enviaría:
${category.tag} ${formData.nombre}

Prioridad: ${category.priority}
Email: ${formData.email}
Institución: ${formData.institucion || 'No especificada'}
Mensaje: ${formData.mensaje}
    `);
    
    // Mostrar modal de confirmación
    alert(`✅ MODO DEMO ACTIVADO

El formulario funcionaría así:

📧 Asunto: ${category.tag} ${formData.nombre}
🎯 Prioridad: ${category.priority} 
📨 Email: ${formData.email}

Para activar el envío real:
1. Configura EmailJS en js/contact.js
2. Reemplaza YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY

¡Gracias por tu interés en Servare!`);
}

// Manejar envío del formulario de contacto
async function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validación básica
    if (!data.nombre || !data.email || !data.interes || !data.mensaje) {
        alert('❌ Por favor completa todos los campos obligatorios.');
        return;
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('❌ Por favor ingresa un email válido.');
        return;
    }
    
    // UI de carga
    submitBtn.textContent = '📤 Enviando mensaje...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    try {
        // Verificar si EmailJS está configurado
        const isEmailJSConfigured = EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
        
        if (isEmailJSConfigured) {
            // Envío real con EmailJS
            const result = await sendContactEmail(data);
            
            if (result.success) {
                // Éxito
                const category = CATEGORY_LABELS[data.interes] || CATEGORY_LABELS['otro'];
                
                alert(`✅ ¡Mensaje enviado exitosamente!

Hola ${data.nombre}, tu consulta ha sido enviada con la etiqueta:
${category.tag}

Te contactaremos pronto a: ${data.email}

¡Gracias por tu interés en Servare! 🏛️`);
                
                form.reset();
                
                // Scroll suave al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            } else {
                // Error en el envío
                alert(`❌ Error al enviar el mensaje.

Por favor intenta nuevamente o contáctanos directamente a:
📧 servare.dp@gmail.com

Disculpa las molestias.`);
            }
        } else {
            // Modo demo (sin configuración)
            showDemoMode(data);
            form.reset();
        }
        
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        alert('❌ Error inesperado. Por favor intenta nuevamente.');
    } finally {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📧 Inicializando sistema de contacto...');
    
    // Inicializar EmailJS
    const emailJSReady = initializeEmailJS();
    
    // Conectar formulario
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Remover el listener anterior de script.js si existe
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        
        // Agregar nuevo listener
        newForm.addEventListener('submit', handleContactForm);
        console.log('✅ Formulario de contacto conectado con sistema de etiquetas');
    } else {
        console.warn('⚠️ No se encontró el formulario de contacto');
    }
    
    // Configurar funcionalidad de campos "Otro" dinámicos
    toggleOtherFields();
    console.log('✅ Campos dinámicos "Otro" configurados');
    
    // Log del sistema
    console.log(`
📧 Sistema de Contacto Servare Listo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EmailJS: ${emailJSReady ? 'Configurado' : 'Modo Demo'}
📧 Etiquetas disponibles: ${Object.keys(CATEGORY_LABELS).length}
🎯 Formulario: Conectado con sistema de identificación
    `);
});

// Exportar funciones para uso global
window.handleContactForm = handleContactForm;
window.sendContactEmail = sendContactEmail;

console.log('📧 Sistema de contacto cargado - Listo para configurar EmailJS');