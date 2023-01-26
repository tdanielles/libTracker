import { db , auth } from "./firebase.js";
import { collection, doc, getDocs, addDoc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';

// auth stuff
const logInBtn = document.getElementById("logInBtn");
const logOutBtn = document.getElementById("logOutBtn");
const greeting = document.getElementById("greeting");

async function signIn() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        updateBooksGrid();
    } catch (e) {
        console.log("Sign in pop up error");
    }
    
}

function signOutUser() {
    signOut(auth);
    updateBooksGrid();
}

function initFirebaseAuth() {
    onAuthStateChanged(auth, authStateObserver);
}

function isUserSignedIn() {
    return !!auth.currentUser;
}

function authStateObserver(user) {
    if (user) {
        logInBtn.classList.remove("active");
        greeting.classList.add("active");
        logOutBtn.classList.add("active");
        greeting.textContent = "Hi, " + auth.currentUser.displayName.split(' ')[0] + "!";
        addBookBtn.textContent = "+ Add book";
    } else {
        logInBtn.classList.add("active");
        greeting.classList.remove("active");
        logOutBtn.classList.remove("active");
        addBookBtn.textContent = "Sign in to get started!";
    }
}

logInBtn.addEventListener("click", signIn);
logOutBtn.addEventListener("click", signOutUser);

// firestore stuff
let library = [];

async function getBooks() {
    let books = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        querySnapshot.forEach((doc) => {
            if (doc.get("ownerId") == auth.currentUser.uid) {
                let bookObj = {};
                bookObj[doc.id] = doc.data();
                books.push(bookObj);
            }
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
            ownerId: auth.currentUser.uid,
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
    
    if (auth.currentUser) {
        addBook(values[0], values[1], values[2], values[3]);
        updateBooksGrid();
    } else {
        alert("You must be signed in to add and save books!");
    }
    
    closeFormContainer();
}

async function removeBook(e) {
    const card = e.target.parentElement.parentElement;
    let id = card.id;

    if (auth.currentUser) {
        await deleteBook(id);
        updateBooksGrid();
    } else {
        alert("You must be signed in to delete books!");
    }
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

    if (auth.currentUser) {
        await updateRead(id);
        updateBooksGrid();
    } else {
        alert("You must be signed in to make changes!");
    }
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

// user interface stuff
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
    if (isUserSignedIn()) {
        addBookForm.reset();
        formContainer.classList.add('active');
        overlay.classList.add('active');
    }
    
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
    initFirebaseAuth(); //
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