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

    Swal.fire({
        title: "Are you sure ?",
        text: "Are you sure want to move to complete read ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            bookTarget.isComplete = true
            document.dispatchEvent(new Event(RENDER_EVENT))
            saveBookToLocalstorage()
            Swal.fire({
                title: "Successfully Moved",
                text: "Your book has been moved to completed",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload()
                }
            })
        }
    })
}

const undoReadBookFromComplete = bookId => {
    const bookTarget = findBook(bookId)
    if (bookTarget == null) return

    Swal.fire({
        title: "Are you sure ?",
        text: "Are you sure want to move to unread ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, move it!"
    }).then((result) => {
        if (result.isConfirmed) {
            bookTarget.isComplete = false
            document.dispatchEvent(new Event(RENDER_EVENT))
            saveBookToLocalstorage()
            Swal.fire({
                title: "Successfully Moved",
                text: "Your book has been moved to unread",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload()
                }
            })
        }
    })
}

const deleteAction = bookId => {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget === -1) return

    Swal.fire({
        title: "Are you sure want to delete ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            books.splice(bookTarget, 1)
            document.dispatchEvent(new Event(RENDER_EVENT))
            saveBookToLocalstorage()
            Swal.fire({
                title: "Successfully Deleted",
                text: "Your book has been deleted",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload()
                }
            })
        }
    })
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
    bookTitle.classList.add("font-bold", "text-md", "text-gray-700", "title-book")
    bookTitle.innerText = title

    const authorName = document.createElement("h2")
    authorName.classList.add("font-semibold", "text-sm", "text-gray-500")
    authorName.innerText = `Author : ${author}`

    const yearPublised = document.createElement("p")
    yearPublised.classList.add("font-semibold", "text-sm", "text-gray-500")
    yearPublised.innerText = `Year published: ${year}`

    const container = document.createElement("div")
    container.classList.add("w-full", "book_item", "p-2", "rounded-lg", "border", "border-gray-300", "flex", "justify-between", "items-start", "gap-4", "border-gray-300", "flex-col", "md:flex-row", "md:gap-2")

    container.append(bookTitle, authorName, yearPublised)

    container.setAttribute("id", `book-${id}`)

    if (isComplete) {
        const buttonWrapper = document.createElement("div")
        buttonWrapper.classList.add("flex", "items-center", "gap-2", "min-w-[250px]", "md:justify-end", "justify-start")

        const undoReadAction = document.createElement("button")
        undoReadAction.innerText = "Undo Read"
        undoReadAction.classList.add("py-2", "px-3", "text-sm", "bg-red-600", "text-white", "font-semibold", "rounded-md")
        undoReadAction.addEventListener("click", () => {
            undoReadBookFromComplete(id)
        })

        const deleteButtonAction = document.createElement("button")
        deleteButtonAction.classList.add("py-2", "px-3", "text-sm", "bg-red-600", "text-white", "font-semibold", "rounded-md")
        deleteButtonAction.innerText = "Delete"
        deleteButtonAction.addEventListener("click", () => {
            deleteAction(id)
        })

        buttonWrapper.append(undoReadAction, deleteButtonAction)

        container.append(buttonWrapper)
    } else {
        const buttonWrapper = document.createElement("div")
        buttonWrapper.classList.add("flex", "items-center", "gap-2", "min-w-[250px]", "md:justify-end", "justify-start")

        const completeButton = document.createElement("button")
        completeButton.innerText = "Complete Read"
        completeButton.classList.add("py-2", "px-3", "text-sm", "bg-green-600", "text-white", "font-semibold", "rounded-md")
        completeButton.addEventListener("click", () => {
            completeRead(id)
        })

        const deleteButtonAction = document.createElement("button")
        deleteButtonAction.classList.add("py-2", "px-4", "text-sm", "bg-red-600", "text-white", "font-semibold", "rounded-md")
        deleteButtonAction.innerText = "Delete"
        deleteButtonAction.addEventListener("click", () => {
            deleteAction(id)
        })

        buttonWrapper.append(completeButton, deleteButtonAction)
        container.append(buttonWrapper)
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
    saveBookToLocalstorage()
}

const resetForm = () => {
    bookTitle.value = ""
    authorName.value = ""
    yearPublised.value = ""
    isCompletedCheck.checked = null
}

const searchPanel = document.getElementById("search")
const openSearch = document.getElementById("openSearch")
const unreadCount = document.getElementById("unread-count")
const readCount = document.getElementById("read-count")

openSearch.addEventListener("click", () => {
    searchPanel.classList.toggle("hidden")
})

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
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload()
            }
        })
        resetForm()
    })
    if (isStorageExist()) {
        loadDataFromStorage()
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.querySelectorAll(".book_item > h1")
    const formSearch = document.getElementById("form-search")

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault()
        const queryTitle = document.getElementById("query").value.toLowerCase()
        for (book of bookList) {
            if (book.innerText.toLowerCase().includes(queryTitle)) {
                book.parentElement.style.display = "flex"
            } else {
                book.parentElement.style.display = "none"
            }
        }
        setTimeout(() => {
            document.getElementById("query").value = null
        }, 50)
    })
})

document.addEventListener(SAVED_EVENT, () => {
    console.log("Book successfully saved")
})

document.addEventListener(RENDER_EVENT, () => {
    const unreadBook = document.getElementById("books")
    const listCompleted = document.getElementById("complete-read")

    unreadBook.innerHTML = ""
    listCompleted.innerHTML = ""

    const unreadlist = books.filter(({ isComplete }) => !isComplete).length
    const readlist = books.filter(({ isComplete }) => isComplete).length

    unreadCount.innerText = `Count : ${unreadlist} books`
    readCount.innerText = `Count : ${readlist} books`

    if (unreadlist === 0) {
        unreadBook.innerText = "Book is empty"
    }

    if (readlist === 0) {
        listCompleted.innerText = "Book is empty"
    }

    for (const book of books) {
        const bookElement = createBook(book)
        if (book.isComplete) {
            listCompleted.append(bookElement)
        } else {
            unreadBook.append(bookElement)
        }
    }
})