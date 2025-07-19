const fs = require('fs')
const path = require('path')

// Tamaños de iconos necesarios para PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Crear directorio si no existe
const publicDir = path.join(__dirname, '../public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Función para crear un icono placeholder
function createPlaceholderIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.15}" 
            fill="#14b8a6" text-anchor="middle" dy=".3em">🐟</text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="${size * 0.08}" 
            fill="#ffffff" text-anchor="middle">NaviPesca</text>
    </svg>
  `
  
  // Convertir SVG a PNG usando canvas (simulado)
  // En producción, usarías una librería como sharp o jimp
  const pngPath = path.join(publicDir, `icon-${size}.png`)
  
  // Por ahora, crear un archivo de texto que indique que se necesita generar
  fs.writeFileSync(pngPath.replace('.png', '.txt'), 
    `Icono ${size}x${size} - Necesita ser generado con una herramienta de diseño`)
  
  console.log(`✅ Icono ${size}x${size} creado`)
}

// Generar todos los iconos
console.log('🎨 Generando iconos para PWA...')
iconSizes.forEach(size => {
  createPlaceholderIcon(size)
})

console.log('✅ Iconos generados. Reemplaza los archivos .txt con iconos reales PNG')
console.log('📱 Para generar iconos reales, usa herramientas como:')
console.log('   - https://realfavicongenerator.net/')
console.log('   - https://www.pwabuilder.com/imageGenerator')
console.log('   - https://favicon.io/') 