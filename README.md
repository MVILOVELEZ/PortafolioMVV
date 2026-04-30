# Portafolio Profesional - Mariano Segundo Viloria Velez

He completado la creación de tu portafolio web siguiendo las instrucciones de `AGENTS.md`. El proyecto está diseñado con una estética **premium**, utilizando una paleta de colores **Verde Esmeralda** y **Amarillo Dorado** sobre un fondo oscuro elegante.

## 🚀 Tecnologías Utilizadas
- **HTML5 Semántico**: Para un SEO óptimo y accesibilidad.
- **CSS3 Nativo**: Sin frameworks, utilizando Flexbox y CSS Grid. Sistema de medidas basado en **1rem = 10px**.
- **JavaScript Vanila**: Para animaciones de scroll, interacción del DOM y lógica del panel de administración.
- **Supabase**: Integración preparada para Autenticación (Login) y Base de Datos (CRUD de proyectos).

## 📁 Estructura del Proyecto
- `index.html`: Página principal pública (Sobre mí, Habilidades, Proyectos, Contacto).
- `admin.html`: Panel de control privado para gestionar tus proyectos.
- `css/styles.css`: Sistema de diseño completo.
- `js/app.js`: Lógica de la parte pública.
- `js/admin.js`: Lógica de autenticación y gestión de datos.
- `img/`: Imágenes generadas mediante IA para los proyectos iniciales.

## 🛠️ Configuración de Supabase
Para conectar tu base de datos real, sigue estos pasos:
1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Crea una tabla llamada `projects` con las columnas: `id`, `title`, `category`, `desc`, `image`.
3. Obtén tu **URL** y **Anon Key** desde el panel de Supabase.
4. Sustituye los valores en `js/app.js` y `js/admin.js`:
   ```javascript
   const CONFIG = {
       supabaseUrl: 'TU_URL_DE_SUPABASE',
       supabaseKey: 'TU_API_KEY_ANON'
   };
   ```

## 🔐 Acceso al Panel Admin (Modo Demo)
Si aún no has configurado Supabase, puedes probar el panel con estos datos:
- **Usuario:** `admin@admin.com`
- **Contraseña:** `admin123`

---
*Nota: Todos los datos (proyectos, habilidades y experiencia) han sido inventados para esta fase inicial y pueden ser editados fácilmente desde el panel de administración.*
