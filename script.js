let myLibrary = [];

function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

const addBookBtn = document.getElementById('addBookBtn');

const formContainer = document.getElementById('formContainer');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

const overlay = document.getElementById('overlay');
const addBookForm = document.getElementById('addBookForm');
const booksGrid = document.getElementById('booksGrid');

function openFormContainer() {
    addBookForm.reset();
    formContainer.classList.add('active');
    overlay.classList.add('active');
}

function closeFormContainer() {
    formContainer.classList.remove('active');
    overlay.classList.remove('active');
}

function getBookFromInput() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const haveRead = document.getElementById('haveRead').checked;
    return new Book(title, author, pages, haveRead);
}

function addBookToLibrary(e) {
    e.preventDefault();
    const newBook = getBookFromInput();

    myLibrary.push(newBook);
    updateBooksGrid();
    closeFormContainer();
}

function clearBooksGrid() {
    booksGrid.innerHTML = '';
}

function updateBooksGrid() {
    clearBooksGrid();
    for(let i=0; i<myLibrary.length; i++) {
        let book = myLibrary[i];
        
        const bookCard = document.createElement('div');
        const title = document.createElement('p');
        const author = document.createElement('p');
        const pages = document.createElement('p');
        const buttonGroup = document.createElement('div');
        const readBtn = document.createElement('button');
        const removeBtn = document.createElement('button');

        bookCard.classList.add('book-card');
        buttonGroup.classList.add('button-group');
        readBtn.classList.add('btn');
        removeBtn.classList.add('btn');
        
        readBtn.addEventListener('click', toggleRead);
        removeBtn.addEventListener('click', removeBook);

        title.textContent = `${book.title}`;
        title.style.fontSize = "30px";
        title.style.fontWeight = "bolder";

        author.textContent = book.author;
        author.style.fontWeight = "lighter";

        pages.textContent = `${book.pages} pages`
        pages.style.fontWeight = "lighter";

        removeBtn.textContent = 'Remove';

        if (book.haveRead) {
            readBtn.textContent = 'Read';
            readBtn.classList.add('btn-light-green');
        } else {
            readBtn.textContent = 'Not read';
            readBtn.classList.add('btn-light-red');
        }

        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(pages);
        buttonGroup.appendChild(readBtn);
        buttonGroup.appendChild(removeBtn);
        bookCard.appendChild(buttonGroup);
        booksGrid.appendChild(bookCard);
    }
}

function getBookFromInput() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const haveRead = document.getElementById('haveRead').checked;
    return new Book(title, author, pages, haveRead);
}

function addBookToLibrary(e) {
    e.preventDefault();
    const newBook = getBookFromInput();

    myLibrary.push(newBook);
    updateBooksGrid();
    closeFormContainer();
}

function removeBook(e) {
    const title = e.target.parentElement.parentElement.firstChild.innerHTML;
    myLibrary = myLibrary.filter(book => book.title != title);
    updateBooksGrid();
}

function toggleRead(e) {
    const title = e.target.parentElement.parentElement.firstChild.innerHTML;
    const book = myLibrary.find(book => book.title == title);
    book.haveRead = !book.haveRead;
    updateBooksGrid();
}

addBookBtn.addEventListener('click', openFormContainer);
overlay.addEventListener('click', closeFormContainer);
addBookForm.addEventListener('submit', addBookToLibrary);