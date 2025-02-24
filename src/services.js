const API_URL = 'http://localhost:3000/books';

// CREATE - método: POST

async function createBook(book) {
    try{
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al crear el libro:', error);
        alert('Error al crear el libro')
    } 
}


// READ - método: GET

async function getAllBooks() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        return [];
    }
}

async function getOneBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener el libro:', error);
    }
}

// UPDATE - método: PUT

async function updateBooks(id, updatedBook) {
    try {
        const response = await fetch(`${API_URL}/${(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        alert('Error al actualizar el libro');
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
        if (response.ok) {
            alert('Libro eliminado con éxito');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        alert('Error al eliminar el libro');
        return false;
    }
}