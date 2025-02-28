const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dubfre44b/upload';
const CLOUDINARY_UPLOAD_PRESET = 'app_books'; 

const API_URL = 'http://localhost:3000/books';

// CREATE - método: POST
async function createBook(book) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al crear el libro:', error);
        throw error; 
    } 
}

// READ - método: GET
async function getAllBooks() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        return [];
    }
}

async function getOneBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al obtener el libro:', error);
        throw error;
    }
}

// UPDATE - método: PUT
async function updateBooks(id, updatedBook) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        throw error;
    }
}

// DELETE - método: DELETE
async function deleteBook(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) {
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        alert('Libro eliminado con éxito');
        return true;
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        alert(`Error al eliminar el libro: ${error.message}`);
        return false;
    }
}

async function uploadToCloudinary(file) {
    // Verificar que el archivo sea válido
    if (!file || !(file instanceof File)) {
        throw new Error('No se ha proporcionado un archivo válido');
    }
    
    if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Referencia al elemento de progreso
    const progressContainer = document.querySelector('.progress-container');
    const uploadProgress = document.getElementById('uploadProgress');
    
    if (progressContainer && uploadProgress) {
        uploadProgress.style.width = '0%';
        progressContainer.style.display = 'block';
    }
    
    try {
        // Usar XMLHttpRequest para manejar el progreso
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Configurar el evento de progreso
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && uploadProgress) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    uploadProgress.style.width = percentComplete + '%';
                    // Para depuración
                    console.log(`Progreso de carga: ${percentComplete}%`);
                }
            });
            
            // Configurar el evento de carga completa
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    if (progressContainer) {
                        progressContainer.style.display = 'none';
                    }
                    console.log('Imagen subida exitosamente:', data.secure_url);
                    resolve({
                        url: data.secure_url,
                        publicId: data.public_id
                    });
                } else {
                    console.error('Error de Cloudinary:', xhr.responseText);
                    let errorMsg = 'Error al subir la imagen a Cloudinary';
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        errorMsg = errorData.error?.message || errorMsg;
                    } catch (e) {
                        // Si no podemos analizar la respuesta, usamos el mensaje genérico
                    }
                    reject(new Error(errorMsg));
                }
            });
            
            // Configurar el evento de error
            xhr.addEventListener('error', () => {
                console.error('Error de conexión con Cloudinary');
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
                reject(new Error('Error de conexión al subir la imagen. Verifica tu conexión a internet.'));
            });
            
            // Configurar timeout
            xhr.addEventListener('timeout', () => {
                console.error('Timeout en la conexión con Cloudinary');
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
                reject(new Error('La subida de la imagen ha excedido el tiempo límite. Intenta con una imagen más pequeña o verifica tu conexión.'));
            });
            xhr.timeout = 30000;
            
            // Iniciar la petición
            xhr.open('POST', CLOUDINARY_URL, true);
            xhr.send(formData);
        });
    } catch (error) {
        console.error('Error en la carga a Cloudinary:', error);
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        throw error;
    }
}
