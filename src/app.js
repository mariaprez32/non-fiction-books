const toggleFormBtn = document.getElementById('toggleFormBtn');
const formContainer = document.getElementById('formContainer');

// Elementos del DOM
const bookForm = document.getElementById('bookForm');
const booksList = document.getElementById('booksList');
const searchInput = document.getElementById('searchInput');
const coverImageInput = document.getElementById('coverImage');
const imagePreview = document.getElementById('imagePreview');
const uploadProgress = document.getElementById('uploadProgress'); // Añadir este elemento para mostrar progreso

// Cargar libros 
document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
});

async function renderBooks(searchTerm = '') {
    try {
        const books = await getAllBooks();
        let booksToRender = books;
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            booksToRender = books.filter(book => 
                book.title.toLowerCase().includes(term) ||
                book.autor.toLowerCase().includes(term)
            );
        }
        
        booksList.innerHTML = '';
        booksToRender.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <div class="book-cover-container">
                    ${book.coverImage ? 
                        `<img src="${book.coverImage}" alt="${book.title}" class="book-cover" loading="lazy">` : 
                        `<div class="no-cover">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 10px;">📚</div>
                                Sin portada
                            </div>
                        </div>`
                    }
                </div>
                <div class="book-title">${book.title}</div>
                <div class="book-info">Autor: ${book.autor}</div>
                <div class="book-info">Año: ${book.year}</div>
                <div class="book-info">Editorial: ${book.publisher}</div>
                ${book.rating ? `<div class="book-rating">${'★'.repeat(book.rating)}${'☆'.repeat(5-book.rating)}</div>` : ''}
                <div class="book-actions">
                    <button class="btn-edit" onclick="editBook('${book.id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteBookHandler('${book.id}')">Eliminar</button>
                </div>
            `;
            booksList.appendChild(bookCard);
        });
    } catch (error) {
        console.error('Error al renderizar libros:', error);
        booksList.innerHTML = '<div class="error-message">Error al cargar los libros. Intenta de nuevo más tarde.</div>';
    }
}

// Manejar la previsualización de la imagen
coverImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});


toggleFormBtn.addEventListener('click', () => {
    formContainer.classList.toggle('expanded');
    formContainer.classList.toggle('collapsed');
    
    // Cambiar el texto del botón
    const isExpanded = formContainer.classList.contains('expanded');
    toggleFormBtn.textContent = isExpanded ? 'Cerrar Formulario' : 'Agregar Nuevo Libro';
});


bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Mostrar indicador de carga
    const submitButton = bookForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Guardando...';
    submitButton.disabled = true;
    
    const bookData = {
        title: document.getElementById('title').value,
        autor: document.getElementById('autor').value,
        year: parseInt(document.getElementById('year').value),
        publisher: document.getElementById('publisher').value,
        rating: parseInt(document.getElementById('rating').value) || null
    };

    const bookId = document.getElementById('bookId').value;
    
    try {
        // Si estamos en modo edición y hay un ID
        if (bookId) {
            // Obtener el libro existente para comprobar si ya tiene imagen
            const existingBook = await getOneBook(bookId);
            
            // Si se ha seleccionado una nueva imagen
            if (coverImageInput.files.length > 0) {
                try {
                    console.log("Subiendo nueva imagen...");
                    const file = coverImageInput.files[0];
                    
                    // Validar tamaño de archivo (máximo 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        throw new Error('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.');
                    }
                    
                    // Intenta subir la imagen a Cloudinary
                    const imageData = await uploadToCloudinary(file);
                    bookData.coverImage = imageData.url;
                    bookData.imagePublicId = imageData.publicId;
                    console.log("Imagen subida exitosamente:", bookData.coverImage);
                } catch (imageError) {
                    // Error específico para la carga de imágenes
                    console.error('Error al subir la imagen:', imageError);
                    alert(`Error al subir la imagen: ${imageError.message}`);
                    
                    // Restaurar el botón
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    return; // Detener el proceso si la imagen falla
                }
            } else {
                // Mantener la imagen existente si no se subió una nueva
                if (existingBook.coverImage) {
                    bookData.coverImage = existingBook.coverImage;
                    bookData.imagePublicId = existingBook.imagePublicId;
                }
            }
            
            // Actualizar el libro
            await updateBooks(bookId, bookData);
            console.log("Libro actualizado con éxito");
        } else {
            if (coverImageInput.files.length > 0) {
                try {
                    console.log("Subiendo imagen para nuevo libro...");
                    const file = coverImageInput.files[0];
                    
                    // Validar tamaño de archivo
                    if (file.size > 5 * 1024 * 1024) {
                        throw new Error('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.');
                    }
                    
                    const imageData = await uploadToCloudinary(file);
                    bookData.coverImage = imageData.url;
                    bookData.imagePublicId = imageData.publicId;
                    console.log("Imagen subida exitosamente:", bookData.coverImage);
                } catch (imageError) {
                    console.error('Error al subir la imagen:', imageError);
                    alert(`Error al subir la imagen: ${imageError.message}`);
                    
                    // Restaurar el botón
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    return; 
                }
            }
            
            // Crear el libro con o sin imagen
            await createBook(bookData);
            console.log("Nuevo libro creado con éxito");
        }
        
        alert(bookId ? 'Libro actualizado con éxito' : 'Libro añadido con éxito');
        
        // Actualizar la lista y resetear el formulario
        await renderBooks();
        resetForm();
    } catch (error) {
        console.error('Error al guardar el libro:', error);
        alert(`Error al guardar el libro: ${error.message}`);
    } finally {
        // Restaurar el botón siempre
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

function resetForm() {
    bookForm.reset();
    document.getElementById('bookId').value = '';
    imagePreview.style.backgroundImage = '';
    if (uploadProgress) uploadProgress.style.width = '0%';
    formContainer.classList.remove('expanded');
    formContainer.classList.add('collapsed');
    toggleFormBtn.textContent = 'Agregar Nuevo Libro';
}

async function editBook(id) {
    formContainer.classList.add('expanded');
    formContainer.classList.remove('collapsed');
    toggleFormBtn.textContent = 'Cerrar Formulario';
    
    try {
        const book = await getOneBook(id);
        if (book) {
            document.getElementById('bookId').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('autor').value = book.autor;
            document.getElementById('year').value = book.year;
            document.getElementById('publisher').value = book.publisher;
            document.getElementById('rating').value = book.rating || '';
            if (book.coverImage) {
                imagePreview.style.backgroundImage = `url(${book.coverImage})`;
            }
        }
    } catch (error) {
        console.error('Error al obtener datos del libro para editar:', error);
        alert('Error al cargar el libro para editar');
    }
}

async function deleteBookHandler(id) {
    try {
        const book = await getOneBook(id);
        const deleted = await deleteBook(id);
        
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
}

// Evento de búsqueda
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderBooks(searchTerm);
});