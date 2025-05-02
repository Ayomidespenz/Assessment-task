
// State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let books = JSON.parse(localStorage.getItem('books')) || null;
let users = JSON.parse(localStorage.getItem('users')) || null;

// Load data from JSON
async function loadLibraryData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) 
          throw new Error('Failed to fetch data.json');
        // const data = await response.json();

// if(books.length === 0) {
//     console.log('no books');
//     books = await response.json()
//     console.log(books,88);  
// }



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
    if (!alertContainer)
       return console.error('Alert container not found');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) bootstrap.Alert.getOrCreateInstance(alert).close();
    }, 5000);
}

// Render book card


function createBookCard(book) {
    return `
          <div class="book-card ${book.isAvailability ? '' : 'not-available'}">
              <img src="${book.coverImage}" alt="${book.title}">
              <div class="book-info">
                  <strong>${book.title}</strong>
                  <p>By: ${book.author}</p>
                  <p>Genre: ${book.genre}</p>
                  <p>Due Date: ${book.dueDate || []}</p> 
                  <span class="badge ${book.isAvailability ? 'bg-success' : 'bg-danger '}">
                      ${book.isAvailability ? 'Available' : 'Borrowed'}
                  </span>
              </div>
              <div class="book-actions">
                  ${currentUser?.role === 'user' ? `
                      <button class="btn btn-sm ${book.isAvailability ? 'btn-primary' : 'btn-secondary m-3'}"
                          onclick="handleBookAction(${book.id}, '${book.isAvailability ? 'borrow' : 'return'}')"
                          ${!book.isAvailability && book.borrowedBy !== currentUser.username ? 'disabled' : ''}>
                          ${book.isAvailability ? 'Borrow' : 'Return'}
                      </button>
                  ` : ''}
                  ${currentUser?.role === 'librarian' ? `
                      <button class="btn btn-sm btn-danger m-5 "
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


// function handleBookAction(bookId, action) 


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
        dueDate.setDate(currentDate.getDate() + 10); 
        const formattedDate = dueDate.toLocaleDateString('en-CA'); 
        book.dueDate = formattedDate;

        showAlert(`You borrowed "${book.title}". Due date: ${book.dueDate}`, "success");
    } else if (
        action === "return" &&
        !book.isAvailability &&
        book.borrowedBy === currentUser.username
    ) {
        book.isAvailability = true;
        book.borrowedBy = null;
        book.dueDate = null;
        showAlert(`You returned "${book.title}"`, "warning");
    } else if (action === "delete" && currentUser?.role === "librarian") {
        // Prevent deletion if the book is borrowed
        if (!book.isAvailability) {
            showAlert(`Cannot delete "${book.title}" because it is currently borrowed by ${book.borrowedBy}.`, "danger");
            return;
        }

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
  const heroSection = document.getElementById("heroSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const userDashboard = document.getElementById("userDashboard");
  const librarianDashboard = document.getElementById("librarianDashboard");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const aboutUsSection = document.getElementById("aboutUs");

  if (currentUser) {
      // User is logged in
      heroSection.style.display = "none";
      dashboardSection.style.display = "block";
      welcomeMessage.textContent = `Welcome to our library, Happy to have you here ${currentUser.username}!`;
      userDashboard.style.display = currentUser.role === "user" ? "block" : "none";
      librarianDashboard.style.display = currentUser.role === "librarian" ? "block" : "none";

      displayBooks();

      // Display borrowed books for librarian
      if (currentUser.role === "librarian") {
          displayBorrowedBooksForLibrarian();
      }

      // Hide the About Us section
      if (aboutUsSection) aboutUsSection.style.display = "none";
  } else {
      // User is logged out
      heroSection.style.display = "flex";
      dashboardSection.style.display = "none";
      userDashboard.style.display = "none";
      librarianDashboard.style.display = "none";

      // Clear the welcome message
      if (welcomeMessage) welcomeMessage.textContent = "";

      // Show the About Us section
      if (aboutUsSection) aboutUsSection.style.display = "block";
  }
}

// Event listeners


document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const role = document.getElementById("loginRole").value;
    const loginError = document.getElementById("loginError");
  
    // Validation for username and password
    if (!username || username.length < 3) {
      loginError.textContent = "Username must be at least 3 characters long";
      loginError.style.display = "block";
      return;
    }
    if (!password || password.length < 5) {
      loginError.textContent = "Password must be at least 6 characters long";
      loginError.style.display = "block";
      return;
    }
  
    await loadLibraryData();
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );
  
    if (user) {
      currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      loginError.style.display = "none";
      bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
      document.getElementById("loginForm").reset(); 
      updateUI();
    } else {
      loginError.textContent = "Invalid credentials or role";
      loginError.style.display = "block";
    }
  });


  document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const registerError = document.getElementById("registerError");
  
    // Validation for username and password
    const usernameRegex = /^[a-zA-Z0-9_]+$/; 
    if (!username || username.length < 3 || !usernameRegex.test(username)) {
      registerError.textContent =
        "Username must be at least 3 characters long and contain only letters, numbers, or underscores";
      registerError.style.display = "block";
      return;
    }
    if (!password || password.length < 5) {
      registerError.textContent = "Password must be at least 5 characters long";
      registerError.style.display = "block";
      return;
    }
  
    if (users.some((u) => u.username === username)) {
      registerError.textContent = "Username already exists";
      registerError.style.display = "block";
      return;
    }
  
    users.push({ username, password, role: "user" });
    saveUsers();
    registerError.style.display = "none";
    bootstrap.Modal.getInstance(document.getElementById("registerModal"))?.hide();
    document.getElementById("registerForm").reset(); 
    showAlert("Registration successful! Please log in.", "success");
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("loginModal")
    ).show();
  });



document.getElementById("addBookForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ensure the current user is a librarian
  if (currentUser?.role !== "librarian") {
      showAlert("Only librarians can add books.", "danger");
      return;
  }

  // Get form input values
  const title = document.getElementById("bookTitle")?.value.trim();
  const author = document.getElementById("bookAuthor")?.value.trim();
  const genre = document.getElementById("bookGenre")?.value.trim();
  const coverImage = document.getElementById("bookCover")?.value.trim() || "";
  const dueDate = document.getElementById("dueDate")?.value;

  // Validate input fields
  if (!title || !author || !genre ) {
      showAlert("All fields except cover image are required.", "danger");
      return;
  }

  // Generate a new book ID
  const newId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  // Add the new book to the books array
  books.push({
      id: newId,
      title,
      author,
      genre,
      isAvailability: true,
      coverImage,
      borrowedBy: null,
      dueDate,
  });

  // Save the updated books array to localStorage
  saveBooks();

  
  displayBooks();

  // Show success message
  showAlert(`"${title}" has been added successfully!`, "success");

  // Reset the form
  document.getElementById("addBookForm").reset();
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
      dueDate: book.dueDate, 
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
      li.textContent = `${record.username} borrowed "${record.title}" on ${record.date} (Due: ${record.dueDate || []})`;
      if (currentUser.role === "user") userHistory.appendChild(li);
      else librarianHistory.appendChild(li);
    });
  }



  function displayBorrowedBooksForLibrarian() {
    const borrowedBooksListForLibrarian = document.getElementById("borrowedBooksListForLibrarian");

    if (borrowedBooksListForLibrarian) borrowedBooksListForLibrarian.innerHTML = "";

    // Filter books that are currently borrowed
    const borrowedBooks = books.filter(book => !book.isAvailability);

    // Render each borrowed book
    borrowedBooks.forEach(book => {
        const isOverdue = book.dueDate && new Date() > new Date(book.dueDate);
        const bookCard = `
            <div class="book-card d-flex ${isOverdue ? 'overdue' : ''}">
                <img src="${book.coverImage}" alt="${book.title}">
                <div class="book-info">
                    <strong>${book.title}</strong>
                    <p>By: ${book.author}</p>
                    <p>Genre: ${book.genre}</p>
                    <p>Borrowed By: ${book.borrowedBy || "Unknown"}</p>
                    <p>Due Date: ${book.dueDate || "N/A"}</p>
                    ${isOverdue ? '<p class="text-danger">Overdue</p>' : ''}
                </div>
            </div>
        `;
        borrowedBooksListForLibrarian.innerHTML += bookCard;
    });
}
  function checkOverdueBooks() {
    const overdueBooks = books.filter(book => {
        if (!book.isAvailability && book.dueDate) {
            const currentDate = new Date();
            const dueDate = new Date(book.dueDate);
            return currentDate > dueDate; // Check if the current date is past the due date
        }
        return false;
    });

    if (overdueBooks.length > 0) {
        overdueBooks.forEach(book => {
            console.warn(`Overdue Book: "${book.title}" borrowed by ${book.borrowedBy}`);
        });
        showAlert(`There are ${overdueBooks.length} overdue books.`, "warning");
    } else {
        console.log("No overdue books.");
    }
}
function retrieveOverdueBooks() {
  const currentDate = new Date();
  books.forEach(book => {
      if (!book.isAvailability && book.dueDate) {
          const dueDate = new Date(book.dueDate);
          if (currentDate > dueDate) {
              book.isAvailability = true;
              book.borrowedBy = null;
              book.dueDate = null;
              console.log(`Book "${book.title}" has been marked as retrieved.`);
          }
      }
  });

  saveBooks();
  displayBooks();
  showAlert("Overdue books have been retrieved.", "info");
}

setInterval(() => {
  checkOverdueBooks();
}, 24 * 60 * 60 * 1000); 

function calculateFine(book) {
  const currentDate = new Date();
  const dueDate = new Date(book.dueDate);
  const overdueDays = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24)); 
  const finePerDay = 5; 
  return overdueDays > 0 ? overdueDays * finePerDay : 0;
}
   
// Initialize
updateUI();