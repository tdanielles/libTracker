import { db } from "./firebase.js";
import { collection, doc, getDocs, addDoc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

let library = [];

async function getBooks() {
    let books = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        querySnapshot.forEach((doc) => {
            let bookObj = {};
            bookObj[doc.id] = doc.data();
            books.push(bookObj);
        })
    } catch (e) {
        console.log('Error with fetching books', e);
    }

    library = books;
}

async function getBookById(id) {
    const docRef = doc(db, 'books', id);
    try {
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (e) {
        console.log('Could not find document', e);
    }
}

async function addBook(title, author, pages, haveRead) {
    try {
        await addDoc(collection(db, 'books'), {
            title: title,
            author: author,
            pages: pages,
            haveRead: haveRead
        });
    } catch (e) {
        console.log('Error adding book to Firebase: ', e);
    }
}

async function addBookToLibrary(e) {
    e.preventDefault();
    const values = getBookFromInput();
    addBook(values[0], values[1], values[2], values[3]);

    updateBooksGrid();
    closeFormContainer();
}

async function removeBook(e) {
    const card = e.target.parentElement.parentElement;
    let id = card.id;

    await deleteBook(id);

    updateBooksGrid();
}

async function deleteBook(id) {
    const docRef = doc(db, 'books', id);
    try {
        await deleteDoc(docRef);
    } catch (e) {
        console.log('Failed to delete doc', e);
    }
}

async function toggleRead(e) {
    const card = e.target.parentElement.parentElement;
    let id = card.id;

    await updateRead(id);

    updateBooksGrid();
}

async function updateRead(id) {
    let bookObj = await getBookById(id);
    const docRef = doc(db, 'books', id);
    
    let newStatus = !bookObj.haveRead;

    updateDoc(docRef, {
        haveRead: newStatus
    });
}

/* function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
} */

const addBookBtn = document.getElementById('addBookBtn');

const formContainer = document.getElementById('formContainer');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

const overlay = document.getElementById('overlay');
const addBookForm = document.getElementById('addBookForm');
const booksGrid = document.getElementById('booksGrid');

const books_total_count = document.getElementById('books_count');
const read_count = document.getElementById('read_b_count');
const unread_count = document.getElementById('not_read_b_count');

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
    let values = [];
    values[0] = document.getElementById('title').value;
    values[1] = document.getElementById('author').value;
    values[2] = document.getElementById('pages').value;
    values[3] = document.getElementById('haveRead').checked;
    return values;
}

function clearBooksGrid() {
    booksGrid.innerHTML = '';
}

async function updateBooksGrid() {
    clearBooksGrid();
    await getBooks();

    let numberRead = 0;
    for(let i=0; i<library.length; i++) {
        let book = {};
        let id;

        for (const [bookId, bookObj] of Object.entries(library[i])) {
            id = bookId;
            book = bookObj;
        }

        const bookCard = document.createElement('div');
        bookCard.id = id;

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
        title.style.fontSize = '30px';
        title.style.fontWeight = 'bolder';

        author.textContent = book.author;
        author.style.fontWeight = 'lighter';

        pages.textContent = `${book.pages} pages`
        pages.style.fontWeight = 'lighter';

        removeBtn.textContent = 'Remove';

        if (book.haveRead) {
            readBtn.textContent = 'Read';
            readBtn.classList.add('btn-light-green');
            numberRead++;
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
    books_total_count.textContent = library.length;

    read_count.textContent = numberRead;
    unread_count.textContent = library.length - numberRead;
}

window.onload = updateBooksGrid();
addBookBtn.addEventListener('click', openFormContainer);
overlay.addEventListener('click', closeFormContainer);
addBookForm.addEventListener('submit', addBookToLibrary);