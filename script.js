

// // Initialize state
// let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
// let books = JSON.parse(localStorage.getItem('books')) || [];

// // Load data from JSON
// // async function loadLibraryData() {
// //     try {
// //         const response = await fetch('data.json');
// //         const data = await response.json();
// //         console.log(data,11);
        
// //         if (!localStorage.getItem('books')) {
// //             books = data.books;
            
// //             localStorage.setItem('books', JSON.stringify(books));
// //             console.log(books,99);
// //         } else {
// //             books = JSON.parse(localStorage.getItem('books'));
// //         }
// //         if (!localStorage.getItem('users')) {
// //             localStorage.setItem('users', JSON.stringify(data.users)); // Only load users if not already present
// //         }
// //         return data;
// //     } catch (error) {
// //         console.error('Error loading library data:', error);
// //         localStorage.setItem('books', JSON.stringify([]));
// //         localStorage.setItem('users', JSON.stringify([]));
// //         return { users: [], books: [] };
// //     }
// async function loadLibraryData() {
//     try {
//         const response = await fetch("data.json");
//         if (!response.ok) {
//             throw new Error("Failed to fetch data.json");
//         }
//         const data = await response.json();

//         // Save books to localStorage if not already present
//         if (!localStorage.getItem('books')) {
//             books = data.map(book => ({
//                 id: book.id,
//                 title: book.title,
//                 author: book.author,
//                 genre: book.genre,
//                 isAvailability: book.availability === "Available",
//                 coverImage: book.cover_image
//                 // borrowedBy: book.borrowedBy || null 
//             }));
//             localStorage.setItem('books', JSON.stringify(books));
//         } else {
//             books = JSON.parse(localStorage.getItem('books'));
//         }

//         return data;
//     } catch (error) {
//         console.error("Error loading library data:", error);
//         localStorage.setItem('books', JSON.stringify([]));
//         return [];
//     }
// }


// // Save books to localStorage
// function saveBooks() {
//     localStorage.setItem('books', JSON.stringify(books));
// }

// // Save users to localStorage
// function saveUsers(users) {
//     localStorage.setItem('users', JSON.stringify(users));
// }

// // Show temporary alert
// function showAlert(message, type = 'success') {
//     const alertContainer = document.getElementById('alertContainer');
//     if (alertContainer) {
//         alertContainer.innerHTML = `
//             <div class="alert alert-${type} alert-dismissible fade show" role="alert">
//                 ${message}
//                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>
//         `;
//         setTimeout(() => {
//             const alert = bootstrap.Alert.getOrCreateInstance(alertContainer.querySelector('.alert'));
//             if (alert) alert.close();
//         }, 5000);
//     } else {
//         console.error('Error: alertContainer element not found in the DOM.');
//     }
// }

// // Display books for user or librarian
// function displayBooks() {
//     const userBookList = document.getElementById('userBookList');
//     const librarianBookList = document.getElementById('librarianBookList');
//     if (userBookList) userBookList.innerHTML = '';
//     if (librarianBookList) librarianBookList.innerHTML = '';

//     const borrowedBooksList = document.getElementById('borrowedBooksList');
//     if (borrowedBooksList) borrowedBooksList.innerHTML = '';

//     books.forEach(book => {
//         const bookCard = document.createElement('div');
//         bookCard.className = `book-card ${book.isAvailability ? '' : 'not-available'}`;
//         bookCard.innerHTML = `
//             <img src="${book.cover_image}" alt="${book.title} cover"
//                 onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'">
//             <div class="book-info">
//                 <strong>${book.title}</strong>
//                 <p>by ${book.author}</p>
//                 <p>Genre: ${book.genre}</p>
//                 <span class="badge ${book.isAvailability? 'bg-success' : 'bg-danger'}">
//                     ${book.isAvailability ? 'Available' : 'Borrowed'}
//                 </span>
//             </div>
//             <div class="book-actions">
//                 ${currentUser?.role === 'user' ? `
//                     <button class="btn btn-sm ${book.isAvailability ? 'btn-primary' : 'btn-secondary'}"
//                         onclick="handleBookAction(${book.id}, '${book.isAvailability ? 'borrow' : 'return'}')"
//                         ${book.isAvailability ? '' : 'data-bs-toggle="tooltip" title="Return this book"'} >
//                         ${book.isAvailability ? 'Borrow' : 'Return'}
//                     </button>
//                 ` : ''}
//                 ${currentUser?.role === 'librarian' ? `
//                     <button class="btn btn-sm btn-danger"
//                         onclick="handleBookAction(${book.id}, 'delete')"
//                         data-bs-toggle="tooltip" title="Delete this book">
//                         Delete
//                     </button>
//                 ` : ''}
//             </div>
//         `;

//         if (currentUser?.role === 'user' && userBookList) {
//             if (book.isAvailability) {
//                 userBookList.appendChild(bookCard);
//             }
//             if (borrowedBooksList && book.borrowedBy === currentUser.username) {
//                 const borrowedCard = bookCard.cloneNode(true);
//                 borrowedBooksList.appendChild(borrowedCard);
//             }
//         } else if (currentUser?.role === 'librarian' && librarianBookList) {
//             librarianBookList.appendChild(bookCard);
//         }
//     });
//     async function updateUI() {
//         await loadLibraryData();
//         displayBooks();
//     }
//     // Search functionality (remains largely the same)
//     document.getElementById('searchButton')?.addEventListener('click', () => {
//         const searchTerm = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
//         const filteredBooks = books.filter(book =>
//             searchTerm === '' ||
//             book.title?.toLowerCase().includes(searchTerm) ||
//             book.author?.toLowerCase().includes(searchTerm) ||
//             book.genre?.toLowerCase().includes(searchTerm)
//         );
//         displaySearchResults(filteredBooks);
//     });

//     document.getElementById('clearSearch')?.addEventListener('click', () => {
//         document.getElementById('searchInput').value = '';
//         displaySearchResults(books);
//     });

//     function displaySearchResults(filteredBooks) {
//         const userBookList = document.getElementById('userBookList');
//         const borrowedBooksList = document.getElementById('borrowedBooksList');
//         if (!userBookList || !borrowedBooksList) return;

//         userBookList.innerHTML = '';
//         borrowedBooksList.innerHTML = '';

//         if (filteredBooks.length === 0) {
//             userBookList.innerHTML = '<p>No books found.</p>';
//             return;
//         }

//         filteredBooks.forEach(book => {
//             const bookCard = document.createElement('div');
//             bookCard.className = `book-card ${book.availability ? '' : 'not-available'}`;
//             bookCard.innerHTML = `
//                 <img src="${book.cover_image}" alt="${book.title} cover"
//                     onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'">
//                 <div class="book-info">
//                     <strong>${book.title}</strong>
//                     <p>by ${book.author}</p>
//                     <p>Genre: ${book.genre}</p>
//                     <span class="badge ${book.availability ? 'bg-success' : 'bg-danger'}">
//                         ${book.availability ? 'Available' : 'Borrowed'}
//                     </span>
//                 </div>
//                 <div class="book-actions">
//                     ${currentUser?.role === 'user' ? `
//                         <button class="btn btn-sm ${book.availability ? 'btn-primary' : 'btn-secondary'}"
//                             onclick="handleBookAction(${book.id}, '${book.availability ? 'borrow' : 'return'}')"
//                             ${book.availability ? '' : 'data-bs-toggle="tooltip" title=""'} >
//                             ${book.availability ? 'Borrow' : 'Return'}
//                         </button>
//                     ` : ''}
//                 </div>
//             `;

//             if (currentUser?.role === 'user' && userBookList) {
//                 if (book.availability) {
//                     userBookList.appendChild(bookCard);
//                 }
//                 if (book.borrowedBy === currentUser.username) {
//                     const borrowedCard = bookCard.cloneNode(true);
//                     borrowedBooksList.appendChild(borrowedCard);
//                 }
//             }
//         });
//         document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
//     }

//     document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

//     const myBorrowedBooks = document.getElementById('myBorrowedBooks');
//     if (myBorrowedBooks) {
//         myBorrowedBooks.style.display = borrowedBooksList?.children.length === 0 ? 'none' : 'block';
//     }
// }

// // Handle book actions (borrow, return, delete) - remains the same
// function handleBookAction(bookId, action) {
//     const book = books.find(b => b.id === bookId);
//     if (!book) return;

//     if (action === 'borrow' && book.availability) {
//         book.availability = false;
//         book.borrowedBy = currentUser.username;
//         saveBooks();
//         displayBooks();
//         showAlert(`You have successfully borrowed "${book.title}".`, 'success');

//     } else if (action === 'return' && !book.availability && book.borrowedBy === currentUser.username) {
//         book.availability = true;
//         delete book.borrowedBy;
//         saveBooks();
//         displayBooks();
//         showAlert(`You have successfully returned "${book.title}".`, 'warning');

//     } else if (action === 'delete' && currentUser?.role === 'librarian') {
//         if (confirm('Are you sure you want to delete this book?')) {
//             books = books.filter(b => b.id !== bookId);
//             saveBooks();
//             displayBooks();
//             showAlert(`"${book.title}" has been deleted from the library.`, 'danger');
//         }
//     }
// }

// // Show/hide sections based on login state
// async function updateUI() {
//     const heroSection = document.getElementById('heroSection');
//     const dashboardSection = document.getElementById('dashboardSection');
//     const userDashboard = document.getElementById('userDashboard');
//     const librarianDashboard = document.getElementById('librarianDashboard');
//     const welcomeMessage = document.getElementById('welcomeMessage');

//      await loadLibraryData(); // Load users as well

//     if (currentUser) {
//         if (heroSection) heroSection.style.display = 'none';
//         if (dashboardSection) dashboardSection.style.display = 'block';
//         if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
//         if (userDashboard) {
//             userDashboard.style.display = currentUser.role === 'user' ? 'block' : 'none';
//         }
//         if (librarianDashboard) {
//             librarianDashboard.style.display = currentUser.role === 'librarian' ? 'block' : 'none';
//         }
//         displayBooks();
//     } else {
//         if (heroSection) heroSection.style.display = 'flex';
//         if (dashboardSection) dashboardSection.style.display = 'none';
//         if (userDashboard) userDashboard.style.display = 'none';
//         if (librarianDashboard) librarianDashboard.style.display = 'none';
//     }
// }

// // Handle login
// document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const role = document.getElementById('loginRole').value;
//     const username = document.getElementById('loginUsername').value.trim();
//     const password = document.getElementById('loginPassword').value;
//     const loginError = document.getElementById('loginError');

//     const libraryData = await loadLibraryData();
//     const users = JSON.parse(localStorage.getItem('users')) || []; // Directly get users from localStorage
//     const user = users.find(u => u.username === username && u.password === password && u.role === role);

//     if (user) {
//         currentUser = user;
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         if (loginError) loginError.style.display = 'none';
//         const loginModal = document.getElementById('loginModal');
//         if (loginModal) bootstrap.Modal.getInstance(loginModal)?.hide();
//         updateUI();
//     } else {
//         if (loginError) {
//             loginError.textContent = 'Invalid username or password for the selected role.';
//             loginError.style.display = 'block';
//         }
//     }
// });

// // Handle registration
// document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('registerUsername').value.trim();
//     const password = document.getElementById('registerPassword').value;
//     const registerError = document.getElementById('registerError');

//     if (!username || !password) {
//         if (registerError) {
//             registerError.textContent = 'Please enter a username and password.';
//             registerError.style.display = 'block';
//         }
//         return;
//     }

//     const users = JSON.parse(localStorage.getItem('users')) || [];

//     if (users.some(user => user.username === username)) {
//         if (registerError) {
//             registerError.textContent = 'Username already exists. Please choose another one.';
//             registerError.style.display = 'block';
//         }
//         return;
//     }

//     const newUser = { username: username, password: password, role: 'user' };
//     users.push(newUser); // Add the new user to the local array FIRST
//     localStorage.setItem('users', JSON.stringify(users)); // THEN save the updated array to localStorage

//     if (registerError) registerError.style.display = 'none';
//     const registerModal = document.getElementById('registerModal');
//     if (registerModal) bootstrap.Modal.getInstance(registerModal)?.hide();
//     showAlert('Registration successful! You can now log in.', 'success');

//     // Optionally, automatically switch back to the login modal
//     const loginModal = document.getElementById('loginModal');
//     if (loginModal) {
//         const bsLoginModal = bootstrap.Modal.getOrCreateInstance(loginModal);
//         bsLoginModal.show();
//     }
// });


// // Handle add book form - remains the same
// document.getElementById('addBookForm')?.addEventListener('submit', (e) => {
//     e.preventDefault();
//     if (currentUser?.role !== 'librarian') return;

//     const title = document.getElementById('bookTitle').value.trim();
//     const author = document.getElementById('bookAuthor').value.trim();
//     const genre = document.getElementById('bookGenre').value.trim();
//     const coverImage = document.getElementById('bookCover').value.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';

//     if (title && author && genre) {
//         const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
//         books.push({ id: newId, title, author, genre, availability: true, cover_image });
//         saveBooks();
//         displayBooks();
//         showAlert(`"${title}" has been added to the library.`, 'success');
//         const addBookForm = document.getElementById('addBookForm');
//         if (addBookForm) addBookForm.reset();
//     }
// });

// // Handle logout - remains the same
// document.getElementById('logoutButton')?.addEventListener('click', () => {
//     currentUser = null;
//     localStorage.removeItem('currentUser');
//     updateUI();
//     const loginForm = document.getElementById('loginForm');
//     const loginError = document.getElementById('loginError');
//     if (loginForm) loginForm.reset();
//     if (loginError) loginError.style.display = 'none';
// });

// // Initial UI update
// updateUI();


// State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let books = JSON.parse(localStorage.getItem('books')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Load data from JSON
async function loadLibraryData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to fetch data.json');
        // const data = await response.json();
// console.log(data, 88);
if(books.length === 0) {
    console.log('no books');
    books = await response.json()
    console.log(books,88);
    
    
}



        // Initialize books if not in localStorage
        if (books) {
            books.forEach(book => ({
                // console.log(book,77),
                
                id: book.id,
                title: book.title,
                author: book.author,
                genre: book.genre,
                isAvailability: book.isAvailability === 'Available',
                coverImage: book.coverImage,
                borrowedBy: null
            }));
            localStorage.setItem('books', JSON.stringify(books));
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        // Initialize users if not in localStorage
        if (!localStorage.getItem('users')) {
            users = [
                { username: 'admin', password: 'admin123', role: 'librarian' },
                { username: 'user', password: 'user123', role: 'user' }
            ];
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            users = JSON.parse(localStorage.getItem('users'));
        }
    } catch (error) {
        console.error('Error loading library data:', error);
        books = [];
        users = [];
        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Save data to localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Show alert
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return console.error('Alert container not found');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) bootstrap.Alert.getOrCreateInstance(alert).close();
    }, 3000);
}

// Render book card
function createBookCard(book) {
    return `
        <div class="book-card ${book.isAvailability ? '' : 'not-available'}">
            <img src="${book.coverImage}" alt="${book.title} cover"
                onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'">
            <div class="book-info">
                <strong>${book.title}</strong>
                <p>by ${book.author}</p>
                <p>Genre: ${book.genre}</p>
                <span class="badge ${book.isAvailability ? 'bg-success' : 'bg-danger'}">
                    ${book.isAvailability ? 'Available' : 'Borrowed'}
                </span>
            </div>
            <div class="book-actions">
                ${currentUser?.role === 'user' ? `
                    <button class="btn btn-sm ${book.isAvailability ? 'btn-primary' : 'btn-secondary'}"
                        onclick="handleBookAction(${book.id}, '${book.isAvailability ? 'borrow' : 'return'}')"
                        ${book.isAvailability ? '' : 'data-bs-toggle="tooltip" title="Return this book"'}>
                        ${book.isAvailability ? 'Borrow' : 'Return'}
                    </button>
                ` : ''}
                ${currentUser?.role === 'librarian' ? `
                    <button class="btn btn-sm btn-danger"
                        onclick="handleBookAction(${book.id}, 'delete')"
                        data-bs-toggle="tooltip" title="Delete this book">
                        Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}
// async function updateUI() {
//        await loadLibraryData();
//         displayBooks();
//         loadLibraryData()
//         }
// Display books
function displayBooks(searchTerm = '') {
    const userBookList = document.getElementById('userBookList');
    const librarianBookList = document.getElementById('librarianBookList');
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    const myBorrowedBooks = document.getElementById('myBorrowedBooks');

    if (userBookList) userBookList.innerHTML = '';
    if (librarianBookList) librarianBookList.innerHTML = '';
    if (borrowedBooksList) borrowedBooksList.innerHTML = '';

    const filteredBooks = searchTerm
        ? books.filter(book =>
              book.title.toLowerCase().includes(searchTerm) ||
              book.author.toLowerCase().includes(searchTerm) ||
              book.genre.toLowerCase().includes(searchTerm))
        : books;

    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        if (currentUser?.role === 'user' && userBookList) {
            if (book.isAvailability) userBookList.innerHTML += bookCard;
            if (borrowedBooksList && book.borrowedBy === currentUser.username) {
                borrowedBooksList.innerHTML += bookCard;
            }
        } else if (currentUser?.role === 'librarian' && librarianBookList) {
            librarianBookList.innerHTML += bookCard;
        }
    });

    if (myBorrowedBooks && borrowedBooksList) {
        myBorrowedBooks.style.display = borrowedBooksList.children.length ? 'block' : 'none';
    }

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
}

// Handle book actions
function handleBookAction(bookId, action) {
    const book = books.find(b => b.id === bookId);
    if (!book) return showAlert('Book not found', 'danger');

    if (action === 'borrow' && book.isAvailability) {
        book.isAvailability = false;
        book.borrowedBy = currentUser.username;
        showAlert(`You borrowed "${book.title}"`, 'success');
    } else if (action === 'return' && !book.isAvailability && book.borrowedBy === currentUser.username) {
        book.isAvailability = true;
        book.borrowedBy = null;
        showAlert(`You returned "${book.title}"`, 'warning');
    } else if (action === 'delete' && currentUser?.role === 'librarian') {
        if (confirm(`Delete "${book.title}"?`)) {
            books = books.filter(b => b.id !== bookId);
            showAlert(`"${book.title}" deleted`, 'danger');
        } else {
            return;
        }
    } else {
        return showAlert('Action not allowed', 'danger');
    }

    saveBooks();
    displayBooks();
}

// Update UI based on login state
async function updateUI() {
    await loadLibraryData();
    const heroSection = document.getElementById('heroSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const userDashboard = document.getElementById('userDashboard');
    const librarianDashboard = document.getElementById('librarianDashboard');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (currentUser) {
        heroSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
        userDashboard.style.display = currentUser.role === 'user' ? 'block' : 'none';
        librarianDashboard.style.display = currentUser.role === 'librarian' ? 'block' : 'none';
        displayBooks();
    } else {
        heroSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
        userDashboard.style.display = 'none';
        librarianDashboard.style.display = 'none';
    }
}

// Event listeners
document.getElementById('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    const loginError = document.getElementById('loginError');

    await loadLibraryData();
    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginError.style.display = 'none';
        bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
        updateUI();
    } else {
        loginError.textContent = 'Invalid credentials or role';
        loginError.style.display = 'block';
    }
});

document.getElementById('registerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const registerError = document.getElementById('registerError');

    if (!username || !password) {
        registerError.textContent = 'Username and password required';
        registerError.style.display = 'block';
        return;
    }

    if (users.some(u => u.username === username)) {
        registerError.textContent = 'Username already exists';
        registerError.style.display = 'block';
        return;
    }

    users.push({ username, password, role: 'user' });
    saveUsers();
    registerError.style.display = 'none';
    bootstrap.Modal.getInstance(document.getElementById('registerModal'))?.hide();
    showAlert('Registration successful! Please log in.', 'success');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal')).show();
});

document.getElementById('addBookForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (currentUser?.role !== 'librarian') return;

    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const genre = document.getElementById('bookGenre').value.trim();
    const coverImage = document.getElementById('bookCover').value.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';

    if (title && author && genre) {
        const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
        books.push({ id: newId, title, author, genre, isAvailability: true, coverImage, borrowedBy: null });
        saveBooks();
        displayBooks();
        showAlert(`"${title}" added`, 'success');
        document.getElementById('addBookForm').reset();
    }
});

document.getElementById('logoutButton')?.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
    updateUI();
});

document.getElementById('searchButton')?.addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    displayBooks(searchTerm);
});

document.getElementById('clearSearch')?.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    displayBooks();
});

// Initialize
updateUI();