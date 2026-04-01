# 🔒 Recomendaciones de Seguridad - Servare Website

## ✅ Cambios Implementados

### 1. Forzar HTTPS en Producción
- **Archivo modificado**: `public/js/config.js`
- **Mejora**: Redireccionamiento automático de HTTP a HTTPS
- **Código agregado**:
```javascript
if (SERVARE_CONFIG.FORCE_HTTPS && window.location.protocol === 'http:') {
    window.location.href = window.location.href.replace('http:', 'https:');
}
```

### 2. Workflow de Seguridad
- **Archivo creado**: `.github/workflows/security-headers.yml`
- **Propósito**: Verificar contenido mixto en cada push

## 🔧 Configuración Adicional Requerida

### Para GitHub Pages

**1. Verificar que HTTPS esté habilitado:**
1. Ve a: `https://github.com/Servare-Database-Patrimonial/Servare-Website/settings/pages`
2. Asegúrate que "Enforce HTTPS" esté activado (checkbox marcado)
3. Verifica que el dominio personalizado `servare.cloud` tenga SSL válido

**2. Configuración DNS de Cloudflare:**
Si usas Cloudflare para `servare.cloud`, verifica:
- SSL/TLS mode: **Full (strict)** o **Full**
- Always Use HTTPS: **Activado**
- Automatic HTTPS Rewrites: **Activado**
- Minimum TLS Version: **TLS 1.2** o superior

**Pasos en Cloudflare:**
```
1. Dashboard Cloudflare → Selecciona servare.cloud
2. SSL/TLS → Overview → Mode: Full (strict)
3. SSL/TLS → Edge Certificates:
   - Always Use HTTPS: ON
   - Automatic HTTPS Rewrites: ON
   - Minimum TLS Version: TLS 1.2
```

### Para mejorar la seguridad

**3. Agregar Security Headers (opcional pero recomendado):**

Crea el archivo `public/_headers` con este contenido:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdn.auth0.com https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com
```

**Nota**: GitHub Pages NO soporta archivos `_headers` nativamente. Estas configuraciones deben hacerse en Cloudflare.

**En Cloudflare (Transform Rules):**
```
1. Rules → Transform Rules → HTTP Response Header Modification
2. Create rule:
   - Rule name: Security Headers
   - When incoming requests match: All incoming requests
   - Then modify headers:
     - X-Frame-Options: DENY
     - X-Content-Type-Options: nosniff
     - X-XSS-Protection: 1; mode=block
```

## 🚨 Causas Comunes de "Página No Segura"

### 1. Contenido Mixto (Mixed Content)
**Síntoma**: Página carga en HTTPS pero algunos recursos en HTTP

**Solución aplicada**:
- ✅ Forzar HTTPS automáticamente en producción
- ✅ Todas las CDNs usan HTTPS (Auth0, EmailJS, Google Fonts)

### 2. Certificado SSL Inválido/Expirado
**Verificar**:
```bash
# En terminal, verificar certificado:
openssl s_client -connect servare.cloud:443 -servername servare.cloud < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

**Solución**: Renovar certificado en GitHub Pages o Cloudflare

### 3. Configuración DNS Incorrecta
**Verificar registros DNS**:
- Tipo A: Apunta a IPs de GitHub Pages
- O CNAME: Apunta a `servare-database-patrimonial.github.io`

**Comando para verificar**:
```bash
dig servare.cloud
nslookup servare.cloud
```

### 4. Cache del Navegador
**Solución para usuarios**:
- Ctrl + F5 (forzar recarga sin caché)
- Limpiar caché del navegador
- Modo incógnito para probar

## 📊 Herramientas de Verificación

### Verificar seguridad del sitio:

1. **SSL Labs**: https://www.ssllabs.com/ssltest/analyze.html?d=servare.cloud
   - Calificación objetivo: A o A+

2. **Security Headers**: https://securityheaders.com/?q=servare.cloud
   - Calificación objetivo: B o superior

3. **Mozilla Observatory**: https://observatory.mozilla.org/analyze/servare.cloud
   - Calificación objetivo: B+ o superior

## 🎯 Checklist de Implementación

- [x] Forzar HTTPS en config.js
- [x] Crear workflow de seguridad
- [ ] Activar "Enforce HTTPS" en GitHub Pages
- [ ] Configurar Cloudflare SSL/TLS mode a "Full (strict)"
- [ ] Activar "Always Use HTTPS" en Cloudflare
- [ ] Agregar Security Headers en Cloudflare Transform Rules
- [ ] Verificar certificado SSL con SSL Labs
- [ ] Probar sitio en diferentes navegadores
- [ ] Probar en modo incógnito

## 📝 Notas Adicionales

- Los cambios en DNS/Cloudflare pueden tardar hasta 24 horas en propagarse
- GitHub Pages regenera SSL automáticamente cada 90 días
- Cloudflare ofrece SSL gratuito con su plan Free

## 🆘 Soporte

Si las advertencias persisten después de implementar todo:
1. Verifica con DevTools (F12) → Console → Buscar errores de contenido mixto
2. Verifica con DevTools → Network → Buscar recursos HTTP
3. Contacta soporte de GitHub Pages o Cloudflare según corresponda

---

**Última actualización**: Octubre 28, 2025
**Aplicado por**: Claude AI
**Archivos modificados**:
- `public/js/config.js`
- `.github/workflows/security-headers.yml` (nuevo)
- `SECURITY_RECOMMENDATIONS.md` (nuevo)
