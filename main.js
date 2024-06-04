document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'BOOKSHELF_APPS';
    let books = [];
    let bookToDeleteId = null;
    let bookToEditId = null;
 
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
 
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
 
    const editModal = document.getElementById('editModal');
    const editBookForm = document.getElementById('editBookForm');
    const confirmEditButton = document.getElementById('confirmEdit');
    const cancelEditButton = document.getElementById('cancelEdit');
 
    inputBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
 
        window.location.reload();
    });
 
    searchBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBook();
    });
 
    confirmDeleteButton.addEventListener('click', function() {
        deleteBook(bookToDeleteId);
        closeDeleteModal();
    });
 
    cancelDeleteButton.addEventListener('click', function() {
        closeDeleteModal();
    });
 
    confirmEditButton.addEventListener('click', function(event) {
        event.preventDefault();
        updateBookDetails(bookToEditId);
        closeEditModal();
    });
 
    cancelEditButton.addEventListener('click', function() {
        closeEditModal();
    });
 
    function openDeleteModal(bookId) {
        bookToDeleteId = bookId;
        deleteModal.style.display = 'block';
    }
 
    function closeDeleteModal() {
        bookToDeleteId = null;
        deleteModal.style.display = 'none';
    }
 
    function openEditModal(book) {
        bookToEditId = book.id;
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookAuthor').value = book.author;
        document.getElementById('editBookYear').value = book.year;
        document.getElementById('editBookIsComplete').checked = book.isComplete;
        editModal.style.display = 'block';
    }
 
    function closeEditModal() {
        bookToEditId = null;
        editModal.style.display = 'none';
    }
 
    function generateId() {
        return +new Date();
    }
 
    function addBook() {
        const bookTitle = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = parseInt(document.getElementById('inputBookYear').value);
        const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
 
        const book = {
            id: generateId(),
            title: bookTitle,
            author: bookAuthor,
            year: bookYear,
            isComplete: bookIsComplete,
        };
 
        books.push(book);
        updateLocalStorage();
        renderBooks();
    }
 
    function updateLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
 
    function loadBooksFromStorage() {
        const serializedBooks = localStorage.getItem(STORAGE_KEY);
        if (serializedBooks) {
            books = JSON.parse(serializedBooks);
        }
        closeDeleteModal();
        closeEditModal();
        renderBooks();
    }
 
    function renderBooks() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
 
        for (const book of books) {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.append(bookElement);
            } else {
                incompleteBookshelfList.append(bookElement);
            }
        }
    }
 
    function createBookElement(book) {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');
 
        const bookTitle = document.createElement('h3');
        bookTitle.innerText = book.title;
 
        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = `Penulis: ${book.author}`;
 
        const bookYear = document.createElement('p');
        bookYear.innerText = `Tahun: ${book.year}`;
 
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
 
        const toggleReadButton = document.createElement('button');
        toggleReadButton.classList.add('green');
        toggleReadButton.innerText = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        toggleReadButton.addEventListener('click', function() {
            toggleReadStatus(book.id);
        });
 
        const editButton = document.createElement('button');
        editButton.classList.add('blue');
        editButton.innerText = 'Edit buku';
        editButton.addEventListener('click', function() {
            openEditModal(book);
        });
 
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.addEventListener('click', function() {
            openDeleteModal(book.id);
        });
 
        actionContainer.append(toggleReadButton, editButton, deleteButton);
        bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);
 
        return bookItem;
    }
 
    function toggleReadStatus(bookId) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            updateLocalStorage();
            renderBooks();
        }
    }
 
    function updateBookDetails(bookId) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            book.title = document.getElementById('editBookTitle').value;
            book.author = document.getElementById('editBookAuthor').value;
            book.year = parseInt(document.getElementById('editBookYear').value);
            book.isComplete = document.getElementById('editBookIsComplete').checked;
 
            updateLocalStorage();
            renderBooks();
        }
    }
 
    function deleteBook(bookId) {
        books = books.filter(book => book.id !== bookId);
        updateLocalStorage();
        renderBooks();
    }
 
    function searchBook() {
        const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchBookTitle));
 
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
 
        for (const book of filteredBooks) {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.append(bookElement);
            } else {
                incompleteBookshelfList.append(bookElement);
            }
        }
    }
 
    loadBooksFromStorage();
});