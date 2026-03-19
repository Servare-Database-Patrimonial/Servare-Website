// Contact form with EmailJS - Servare Website

var EMAIL_CONFIG = {
  SERVICE_ID: 'service_ben531s',
  TEMPLATE_ID: 'template_j2qufea',
  PUBLIC_KEY: 'ywSkpDeLSkQmNjMxF'
};

var CATEGORY_LABELS = {
  'implementacion': {
    tag: '[SERVARE - IMPLEMENTACION INSTITUCIONAL]',
    priority: 'ALTA',
    description: 'Consulta sobre implementacion en institucion'
  },
  'colaboracion': {
    tag: '[SERVARE - COLABORACION ACADEMICA]',
    priority: 'MEDIA',
    description: 'Interes en colaboracion academica/investigacion'
  },
  'apoyo': {
    tag: '[SERVARE - APOYO Y PATROCINIO]',
    priority: 'ALTA',
    description: 'Interes en apoyar y patrocinar el proyecto'
  },
  'beta': {
    tag: '[SERVARE - ACCESO A BETA]',
    priority: 'ALTA',
    description: 'Solicitud de acceso a la version beta de la plataforma'
  },
  'demo': {
    tag: '[SERVARE - SOLICITUD DEMO]',
    priority: 'ALTA',
    description: 'Solicitud de demostracion del producto'
  },
  'otro': {
    tag: '[SERVARE - CONSULTA GENERAL]',
    priority: 'MEDIA',
    description: 'Consulta general'
  }
};

var PROFESSIONAL_AREAS = {
  'arqueologia': 'Arqueologia',
  'museos': 'Museos',
  'conservacion-restauracion': 'Conservacion y Restauracion',
  'archivos': 'Archivos',
  'paleontologia': 'Paleontologia',
  'gestion-cultural': 'Gestion Cultural',
  'investigacion': 'Investigacion',
  'educacion': 'Educacion',
  'otro-profesional': 'Otro (especificado)'
};

function initializeEmailJS() {
  try {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error('Error initializing EmailJS:', error);
    return false;
  }
}

function toggleOtherFields() {
  var areaProfesional = document.getElementById('area-profesional');
  var areaInteres = document.getElementById('interes');
  var otroAreaGroup = document.getElementById('otro-area-group');
  var otroInteresGroup = document.getElementById('otro-interes-group');

  if (areaProfesional && otroAreaGroup) {
    areaProfesional.addEventListener('change', function() {
      var show = this.value === 'otro-profesional';
      otroAreaGroup.style.display = show ? 'block' : 'none';
      var input = document.getElementById('otro-area-texto');
      input.required = show;
      if (!show) input.value = '';
    });
  }

  if (areaInteres && otroInteresGroup) {
    areaInteres.addEventListener('change', function() {
      var show = this.value === 'otro';
      otroInteresGroup.style.display = show ? 'block' : 'none';
      var input = document.getElementById('otro-interes-texto');
      input.required = show;
      if (!show) input.value = '';
    });
  }
}

function getAreaProfesional(data) {
  if (!data.area_profesional) return 'No especificada';
  if (data.area_profesional === 'otro-profesional' && data.otro_area_texto) {
    return data.otro_area_texto + ' (especificado)';
  }
  return PROFESSIONAL_AREAS[data.area_profesional] || data.area_profesional;
}

function getAreaInteres(data) {
  if (data.interes === 'otro' && data.otro_interes_texto) {
    return data.otro_interes_texto + ' (especificado)';
  }
  return data.interes;
}

async function handleContactForm(event) {
  event.preventDefault();

  var form = event.target;
  var submitBtn = form.querySelector('.btn-submit');
  var originalText = submitBtn.textContent;

  var formData = new FormData(form);
  var data = Object.fromEntries(formData);

  // Validation
  if (!data.nombre || !data.email || !data.interes || !data.mensaje) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('Por favor ingresa un email valido.');
    return;
  }

  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  var category = CATEGORY_LABELS[data.interes] || CATEGORY_LABELS['otro'];
  var timestamp = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  var templateParams = {
    subject: 'WEB - ' + category.tag + ' | ' + data.nombre + ' (' + getAreaProfesional(data) + ') | ' + category.priority,
    email_body: 'NUEVA CONSULTA SERVARE DATABASE PATRIMONIAL\n' +
      category.tag + '\n\n' +
      'INFORMACION DEL CONTACTO:\n' +
      'Nombre: ' + data.nombre + '\n' +
      'Email: ' + data.email + '\n' +
      'Institucion: ' + (data.institucion || 'No especificada') + '\n' +
      'Cargo: ' + (data.cargo || 'No especificado') + '\n' +
      'Area Profesional: ' + getAreaProfesional(data) + '\n' +
      'Area de Interes: ' + getAreaInteres(data) + '\n\n' +
      'MENSAJE:\n' + data.mensaje + '\n\n' +
      'METADATOS:\n' +
      'Fecha: ' + timestamp + '\n' +
      'Origen: ' + window.location.href + '\n' +
      'Dispositivo: ' + (navigator.userAgent.includes('Mobile') ? 'Movil' : 'Escritorio') + '\n' +
      'Prioridad: ' + category.priority + '\n\n' +
      'Responder directamente a: ' + data.email,
    from_name: 'Formulario Servare - ' + data.nombre,
    reply_to: data.email,
    user_email: data.email,
    institution: data.institucion || 'No especificada',
    position: data.cargo || 'No especificado',
    interest_area: data.interes,
    message: data.mensaje,
    category_tag: category.tag,
    priority: category.priority,
    timestamp: timestamp
  };

  try {
    await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams);
    alert('Mensaje enviado exitosamente.\n\nTe contactaremos pronto a: ' + data.email);
    form.reset();
    // Hide dynamic fields after reset
    var otroAreaGroup = document.getElementById('otro-area-group');
    var otroInteresGroup = document.getElementById('otro-interes-group');
    if (otroAreaGroup) otroAreaGroup.style.display = 'none';
    if (otroInteresGroup) otroInteresGroup.style.display = 'none';
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error al enviar el mensaje.\n\nPor favor contactanos directamente a: servare@management.cloud');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializeEmailJS();
  toggleOtherFields();

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
});
