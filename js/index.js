const books = []

const RENDER_EVENT = "render-books"
const SAVED_EVENT = "saved-books"
const STORAGE_KEY = "BOOKSHELF"

const generateUniqueId = () => +new Date()

const bookDataObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

const isStorageExist = () => {
    if (typeof(Storage) === undefined) {
        alert("The Browser is not yet supported Local Storage")
        return false
    }
    return true
}

const findBook = bookId => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }
    return null
}

const findBookIndex = bookId => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}

const completeRead = bookId => {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isComplete = true
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const undoReadBookFromComplete = bookId => {
    const bookTarget = findBook(bookId)
    if (bookTarget == null) return

    bookTarget.isComplete = false
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const deleteAction = bookId => {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget === -1) return

    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const saveBookToLocalstorage = () => {
    if (isStorageExist()) {
        const parsedData = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsedData)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const loadDataFromStorage = () => {
    const dataStore = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(dataStore)

    if (data !== null) {
        for (const book of data) {
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

const createBook = bookObject => {
    const { id, title, author, year, isComplete } = bookObject

    const bookTitle = document.createElement("h1")
    bookTitle.innerText = title

    const authorName = document.createElement("h2")
    authorName.innerText = author

    const yearPublised = document.createElement("p")
    yearPublised.innerText = year

    const dataContainer = document.createElement("div")
    dataContainer.append(bookTitle, authorName, yearPublised)

    const container = document.createElement("div")
    container.classList.add("w-fit", "p-4", "rounded-lg", "border", "border-gray-300")

    container.append(dataContainer)
    container.setAttribute("id", `book-${id}`)

    if (isComplete) {
        const undoReadAction = document.createElement("button")
        undoReadAction.innerText = "Undo Read"
        undoReadAction.classList.add("py-2", "px-4", "bg-red-600", "text-white", "font-semibold", "rounded-lg")
        undoReadAction.addEventListener("click", () => {
            undoReadBookFromComplete(id)
        })

        const deleteButtonAction = document.createElement("button")
        deleteButtonAction.classList.add("py-2", "px-4", "bg-blue-600", "text-white", "font-semibold", "rounded-lg")
        deleteButtonAction.innerText = "Delete Book"
        deleteButtonAction.addEventListener("click", () => {
            deleteAction(id)
        })

        container.append(undoReadAction, deleteButtonAction)
    } else {
        const completeButton = document.createElement("button")
        completeButton.innerText = "Complete Read"
        completeButton.classList.add("py-2", "px-4", "bg-blue-600", "text-white", "font-semibold", "rounded-lg")
        completeButton.addEventListener("click", () => {
            completeRead(id)
        })

        const deleteButtonAction = document.createElement("button")
        deleteButtonAction.classList.add("py-2", "px-4", "bg-blue-600", "text-white", "font-semibold", "rounded-lg")
        deleteButtonAction.innerText = "Delete Book"
        deleteButtonAction.addEventListener("click", () => {
            deleteAction(id)
        })

        container.append(completeButton, deleteButtonAction)
    }

    return container
}

const bookTitle = document.getElementById("title")
const authorName = document.getElementById("author")
const yearPublised = document.getElementById("year")
const isCompletedCheck = document.getElementById("completed")

const addBook = () => {
    const { value: title } = bookTitle
    const { value: author } = authorName
    const { value: year } = yearPublised
    const isComplete = isCompletedCheck.checked

    const uniqueId = generateUniqueId()

    const bookObject = bookDataObject(uniqueId, title, author, Number(year), isComplete)
    books.push(bookObject)

    console.log("Book Object : ", bookObject)
    console.log("Books : ", books)

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const resetForm = () => {
    bookTitle.value = ""
    authorName.value = ""
    yearPublised.value = ""
    isCompletedCheck.checked = null
}

document.addEventListener("DOMContentLoaded", () => {
    const formBook = document.getElementById("form-book")
    formBook.addEventListener("submit", (event) => {
        event.preventDefault()
        addBook()
        Swal.fire({
            icon: "success",
            title: "Successfully Add Book",
            text: "Huurray, you successfully add book to bookshelf",
            confirmButtonText: "Okay",
        })
        resetForm()
    })
})

document.addEventListener(SAVED_EVENT, () => {
    console.log("")
    alert("Book successfully saved")
})

document.addEventListener(RENDER_EVENT, () => {
    const unreadBook = document.getElementById("books")
    const listCompleted = document.getElementById("complete-read")

    unreadBook.innerHTML = ""
    listCompleted.innerHTML = ""

    for (const book of books) {
        const bookElement = createBook(book)
        if (book.isComplete) {
            listCompleted.append(bookElement)
        } else {
            unreadBook.append(bookElement)
        }
    }
})