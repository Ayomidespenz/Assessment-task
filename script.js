
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
              <img src="${book.coverImage}" alt="${book.title}">
              <div class="book-info">
                  <strong>${book.title}</strong>
                  <p>by ${book.author}</p>
                  <p>Genre: ${book.genre}</p>
                  <p>Due Date: ${book.dueDate || "N/A"}</p> <!-- Display the due date -->
                  <span class="badge ${book.isAvailability ? 'bg-success' : 'bg-danger'}">
                      ${book.isAvailability ? 'Available' : 'Borrowed'}
                  </span>
              </div>
              <div class="book-actions">
                  ${currentUser?.role === 'user' ? `
                      <button class="btn btn-sm ${book.isAvailability ? 'btn-primary' : 'btn-secondary'}"
                          onclick="handleBookAction(${book.id}, '${book.isAvailability ? 'borrow' : 'return'}')"
                          ${!book.isAvailability && book.borrowedBy !== currentUser.username ? 'disabled' : ''}>
                          ${book.isAvailability ? 'Borrow' : 'Return'}
                      </button>
                  ` : ''}
                  ${currentUser?.role === 'librarian' ? `
                      <button class="btn btn-sm btn-danger"
                          onclick="handleBookAction(${book.id}, 'delete')">
                          Delete
                      </button>
                  ` : ''}
              </div>
          </div>
      `;
  }

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
// function handleBookAction(bookId, action) {


function handleBookAction(bookId, action) {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      console.error("Book not found:", bookId);
      return showAlert("Book not found", "danger");
    }
  
    if (action === "borrow" && book.isAvailability) {
      book.isAvailability = false;
      book.borrowedBy = currentUser.username;
  
      // Calculate the due date (10 days from today)
      const currentDate = new Date();
      const dueDate = new Date(currentDate);
      dueDate.setDate(currentDate.getDate() + 10); // Add 10 days
      book.dueDate = dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  
      showAlert(`You borrowed "${book.title}". Due date: ${book.dueDate}`, "success");
    } else if (
      action === "return" &&
      !book.isAvailability &&
      book.borrowedBy === currentUser.username
    ) {
      book.isAvailability = true;
      book.borrowedBy = null;
      book.dueDate = null; // Clear the due date
      showAlert(`You returned "${book.title}"`, "warning");
    } else if (action === "delete" && currentUser?.role === "librarian") {
      if (confirm(`Delete "${book.title}"?`)) {
        books = books.filter((b) => b.id !== bookId);
        showAlert(`"${book.title}" deleted`, "danger");
      } else {
        return;
      }
    } else {
      return showAlert("Action not allowed", "danger");
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



document.getElementById("addBookForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentUser?.role !== "librarian") return;
  
    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const genre = document.getElementById("bookGenre").value.trim();
    const coverImage = document.getElementById("bookCover").value.trim() || "";
    const dueDate = document.getElementById("dueDate").value; // Get the due date
  
    if (title && author && genre && dueDate) {
      const newId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
      books.push({
        id: newId,
        title,
        author,
        genre,
        isAvailability: true,
        coverImage,
        borrowedBy: null,
        dueDate, // Add the due date to the book object
      });
      saveBooks();
      displayBooks();
      showAlert(`"${title}" added with a due date of ${dueDate}`, "success");
      document.getElementById("addBookForm").reset();
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

function logBorrow(book, user) {
    borrowHistory.push({
      username: user.username,
      title: book.title,
      date: new Date().toLocaleString(),
      dueDate: book.dueDate, // Log the due date
    });
    saveHistory();
  }
  function displayHistory() {
    const userHistory = document.getElementById("userHistory");
    const librarianHistory = document.getElementById("librarianHistory");
  
    if (userHistory) userHistory.innerHTML = "";
    if (librarianHistory) librarianHistory.innerHTML = "";
  
    const userRecords = borrowHistory.filter(
      (h) => h.username === currentUser.username
    );
    const allRecords = borrowHistory;
  
    (currentUser.role === "user" ? userRecords : allRecords).forEach((record) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${record.username} borrowed "${record.title}" on ${record.date} (Due: ${record.dueDate || "N/A"})`;
      if (currentUser.role === "user") userHistory.appendChild(li);
      else librarianHistory.appendChild(li);
    });
  }
// Initialize
updateUI();