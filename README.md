# Biblioteca Personal

## Descripción

Biblioteca Personal es una aplicación web interactiva que te permite gestionar tu colección de libros de manera sencilla y elegante. Con esta aplicación podrás añadir, editar, eliminar y buscar tus libros favoritos, manteniendo un registro organizado de tu biblioteca personal.

## Características

- ✨ **Interfaz intuitiva** diseñada para facilitar la gestión de tu colección
- 📚 **Catálogo visual** con portadas de libros
- 🔍 **Búsqueda rápida** por título o autor
- ⭐ **Sistema de puntuación** para valorar tus lecturas
- 📸 **Carga de imágenes** para personalizar las portadas
- 💾 **Almacenamiento persistente** de tu colección

## Tecnologías utilizadas

- HTML5 y CSS3 para la estructura y diseño
- JavaScript vanilla para la lógica del cliente
- Cloudinary para el almacenamiento de imágenes
- API REST para la gestión de datos
- Fuentes de Google Fonts (Inter)

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/biblioteca-personal.git
cd biblioteca-personal
```

2. Instala las dependencias del servidor (asegúrate de tener Node.js instalado):

```bash
npm install
```

3. Configura la API REST:

   - La aplicación espera un servidor en `http://localhost:3000`
   - Asegúrate de que la API tenga un endpoint `/books` configurado

4. Inicia el servidor:

```bash
npx json-server --watch server/db.json
```

5. Abre `index.html` en tu navegador o configura un servidor web estático

## Configuración de Cloudinary

La aplicación utiliza Cloudinary para almacenar las portadas de los libros. Para configurarlo:

1. Regístrate en [Cloudinary](https://cloudinary.com/) y obtén tus credenciales
2. Crea un preset de carga llamado `app_books`
3. Asegúrate de que la variable `CLOUDINARY_URL` en `services.js` apunte a tu cuenta:

```javascript
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/tu-cloud-name/upload";
```

## Uso

### Añadir un libro

1. Haz clic en el botón "Agregar Nuevo Libro"
2. Completa el formulario con los detalles del libro
3. Opcionalmente, carga una imagen de portada
4. Haz clic en "Guardar Libro"

### Editar un libro

1. Encuentra el libro que deseas modificar
2. Haz clic en el botón "Editar"
3. Actualiza la información según necesites
4. Guarda los cambios

### Eliminar un libro

1. Localiza el libro que deseas eliminar
2. Haz clic en el botón "Eliminar"
3. Confirma la acción

### Buscar libros

Utiliza el campo de búsqueda en la parte superior para filtrar por título o autor.

## Estructura del proyecto

```
biblioteca-personal/
├── index.html          # Estructura principal de la aplicación
├── src/
│   ├── app.js          # Lógica principal y manipulación del DOM
│   ├── services.js     # Servicios de API y Cloudinary
│   └── styles.css      # Estilos CSS
```

## API

La aplicación se comunica con un servidor backend a través de estos endpoints:

- `GET /books` - Obtener todos los libros
- `GET /books/:id` - Obtener un libro específico
- `POST /books` - Crear un nuevo libro
- `PUT /books/:id` - Actualizar un libro existente
- `DELETE /books/:id` - Eliminar un libro

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcion`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añade nueva función'`)
4. Sube tus cambios (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

¡Disfruta organizando tu biblioteca personal! 📚
