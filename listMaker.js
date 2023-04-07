"use strict";

/*/////////////////////////////

    To Do:

    Refactor if possible?
    Fix CSS
    FIX NUMBER VALIDATION
    FIX POSITION ADDED AT
    Write Documentation
    Quailty of life features - create a "replace book #" button for more QOL with adding books
    Horizontal list of buttons at top with more features - reset, save, import/export, mass add, maybe more pages?
    Add tooltips?

*/////////////////////////////


////  Get Elements ////
const main = document.getElementById("main");
const addBookBefore = document.getElementById("addBookBtn1");
const addBookAfter = document.getElementById("addBookBtn2");
const bookPublisherInput = document.getElementById("publisher");
const bookSeriesInput = document.getElementById("series");
const bookContinuityInput = document.getElementById("continuity");
const bookNumberTypeInput = document.getElementById("numberType");
const bookNumberInput = document.getElementById("number");
const bookNameInput = document.getElementById("name");
const bookFormatInput = document.getElementById("format");
const bookReadInput = document.getElementById("read");
const bookNotesInput = document.getElementById("notes");
const bookImageInput = document.getElementById("imgLink");
const bookPositionInput = document.getElementById("insertNumber");

    //stars
let formStars = Array.from(document.getElementsByClassName("formStar"));
let formStarImgs = new Array(5).fill('emptyStar.png');

//// Big array that holds all the books ////
let everythingArray = [];

//// Functions ////
function reset() {
    localStorage.clear();
    document.location.reload();
}

formStars.forEach((item) => {
    item.addEventListener('click', (event) => {
        let x = event.pageX - item.offsetLeft;
        if (x < item.width / 2) { //mouse on left side
            item.setAttribute("src", "halfStar.png");
        } else { //mouse on right side
            item.setAttribute("src", "fullStar.png")
        }
        for (let j = 0; j < formStars.length; j++) {
            if (j < formStars.indexOf(item)) {
                formStars[j].setAttribute("src", "fullStar.png");
            } else if (j > formStars.indexOf(item)) {
                formStars[j].setAttribute("src", "emptyStar.png");
            };
            formStarImgs[j] = formStars[j].src;
        };
    });                     
});                                     

let book;
function createBook() {
    //// Create an object to store values from the form ////
    book = {
        publisher: bookPublisherInput.value,
        series: bookSeriesInput.value,
        continuity: bookContinuityInput.value,
        numberType: bookNumberTypeInput.value,
        number: bookNumberInput.value,
        name: bookNameInput.value,
        format: bookFormatInput.value,
        read: bookReadInput.checked,
        rating: formStarImgs,
        notes: bookNotesInput.value,
        image: bookImageInput.value,
        position: bookPositionInput.value,
    };

    //// Fix Values that are left blank ////
    debugger;
    if (book.number != Number(book.number) || book.number === "") {
        book.numberType = "No Number";
    };
    if (book.position != Number(book.position)) {
        book.position = everythingArray.length;
    };
    if (book.continuity === "") {
        book.continuity = "N/A";
    };
    book.position -= 1;

    return book;
};

function appendBefore() { //These append functions will be the main way to add new books to the list. Update over time to add new features
    book = createBook();
    //// Append the object to the main array ////
    let firstHalf = everythingArray.slice(0, book.position);
    let secondHalf = everythingArray.slice(book.position);
    everythingArray = [...firstHalf, book, ...secondHalf];

    //Refresh the page
    refreshPage();
};

function appendAfter() {
    book = createBook();
    //// Append the object to the main array ////
    let firstHalf = everythingArray.slice(0, book.position + 1);
    let secondHalf = everythingArray.slice(book.position + 1);
    everythingArray = [...firstHalf, book, ...secondHalf];

    //Refresh the page
    refreshPage();
};

function refreshPage() {
    save();
    document.location.reload();
};

function save() {
    localStorage.setItem("everythingArray", JSON.stringify(everythingArray));
};

function pageOnload() {
    if (localStorage.getItem('everythingArray') !== null) {
        everythingArray = JSON.parse(localStorage.getItem("everythingArray"));
        for (let i = 0; i < everythingArray.length; i++) {
            drawBook(everythingArray[i]);
        };
    };
    bookPositionInput.value = everythingArray.length;
};

function drawBook(book) {
    //// Reset The Book's Position ////
    book.position = everythingArray.indexOf(book);

    //// Add the book section to the document ////
    let newDiv = document.createElement("div");
    newDiv.classList.add("book");
    newDiv.classList.add("content");

    let details = document.createElement("details");
    let summary = document.createElement("summary");
    let displayString;
    if (book.numberType != "No Number") {
        displayString = `${book.series} ${book.numberType} ${book.number}`;
    } else {
        displayString = `${book.series}: ${book.name}`;
    }
    summary.innerHTML = `${Number(everythingArray.indexOf(book)) + 1}.<span class="alignRight">${displayString}</span>`;

    main.appendChild(newDiv);
    newDiv.appendChild(details);
    details.appendChild(summary);

    //// Add all the information inside the book details (might refactor right side to use dictionary later) ////
    let insideDiv = document.createElement("div");
    insideDiv.classList.add("insideDetails");

    //Book image on left side
    let leftSpan = document.createElement("span");
    leftSpan.classList.add("leftSide");
    let bookImage = document.createElement("img");
    bookImage.src = book.image;
    bookImage.onerror = function(){bookImage.src='altImg.jpg';};
    leftSpan.appendChild(bookImage);
    insideDiv.appendChild(leftSpan);

    //Book details contained on right side
    let rightSpan = document.createElement("span");
    rightSpan.classList.add("rightSide");

    let publisherLabel = document.createElement("p");
    publisherLabel.textContent = "Publisher:";
    let publisher = document.createElement("p");
    publisher.innerHTML = book.publisher != "" ? book.publisher : `<i>?</i>`;
    rightSpan.appendChild(publisherLabel);
    rightSpan.appendChild(publisher);
    rightSpan.appendChild(document.createElement("br"));

    let continuityLabel = document.createElement("p");
    continuityLabel.textContent = "Continuity:";
    let continuity = document.createElement("p");
    continuity.innerHTML = book.continuity != "" ? book.continuity : `<i>?</i>`;    
    rightSpan.appendChild(continuityLabel);
    rightSpan.appendChild(continuity);
    rightSpan.appendChild(document.createElement("br"));

    let seriesLabel = document.createElement("p");
    seriesLabel.textContent = "Series:";
    let series = document.createElement("p");
    series.innerHTML = book.series != "" ? book.series : `<i>?</i>`;
    rightSpan.appendChild(seriesLabel);
    rightSpan.appendChild(series);
    rightSpan.appendChild(document.createElement("br"));

    let numberLabel = document.createElement("p");
    numberLabel.textContent = book.numberType;
    let number = document.createElement("p");
    number.textContent = book.numberType != "No Number" ? book.number : "";
    rightSpan.appendChild(numberLabel);
    rightSpan.appendChild(number);
    rightSpan.appendChild(document.createElement("br"));

    let nameLabel = document.createElement("p");
    nameLabel.textContent = "Name:";
    let name = document.createElement("p");
    name.innerHTML = book.name != "" ? book.name : `<i>?</i>`;
    rightSpan.appendChild(nameLabel);
    rightSpan.appendChild(name);
    rightSpan.appendChild(document.createElement("br"));

    let formatLabel = document.createElement("p");
    formatLabel.textContent = "Format:";
    let format = document.createElement("p");
    format.innerHTML = book.format != "" ? book.format : `<i>?</i>`;
    rightSpan.appendChild(formatLabel);
    rightSpan.appendChild(format);
    rightSpan.appendChild(document.createElement("br"));

    // Read checkbox on right side, uses slightly different code
    let readLabel = document.createElement("p");
    readLabel.innerHTML = book.read ? `Read? <input type="checkbox" checked>` : `Read? <input type="checkbox">`;
    readLabel.addEventListener("click", saveChangesRead);
    rightSpan.appendChild(readLabel);
    rightSpan.appendChild(document.createElement("br"));  // MAKE THE CHECKBOX SAVE WHEN IT IS CHANGED AND MAKE THE NOTES SAVE WHEN THEY ARE CHANGED

    let ratingBox = document.createElement('div')
    let ratingLabel = document.createElement("p");
    ratingLabel.textContent = "Rating:";
    ratingBox.appendChild(ratingLabel);
    for (let i = 0; i < book.rating.length; i++) {
        let aStar = document.createElement("img");
        aStar.src = book.rating[i];
        aStar.classList.add("smallStar");
        ratingBox.appendChild(aStar);
    };
    rightSpan.appendChild(ratingBox);
    rightSpan.appendChild(document.createElement("br"));

    insideDiv.appendChild(rightSpan);

    //Notes area that goes on bottom
    let notesBox = document.createElement("textarea");
    notesBox.value = book.notes;
    notesBox.addEventListener("keyup", saveChangesNotes);
    insideDiv.appendChild(notesBox);

    //Up, down, delete buttons
    let buttonsContainer = document.createElement("div");
    let upDownContainer = document.createElement("span");
    let upBtn = document.createElement("button");
    let downBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

        //text
    upBtn.textContent = "Move Up";
    downBtn.textContent = "Move Down";
    deleteBtn.textContent = "Delete Book";

        //classes and ids
    buttonsContainer.classList.add("posContainer");
    upDownContainer.setAttribute("id", "upDownContainer")
    upBtn.classList.add("posButtons");
    upBtn.setAttribute("id", "up")
    downBtn.classList.add("posButtons");
    downBtn.setAttribute("id", "down")
    deleteBtn.classList.add("posButtons");
    deleteBtn.setAttribute("id", "delete")

        //click event listeners
    upBtn.addEventListener("click", moveUp);
    downBtn.addEventListener("click", moveDown);
    deleteBtn.addEventListener("click", setUpDel);

    upDownContainer.appendChild(upBtn);
    upDownContainer.appendChild(downBtn);
    buttonsContainer.appendChild(upDownContainer);
    buttonsContainer.appendChild(deleteBtn);
    insideDiv.appendChild(buttonsContainer);

    //Add the containers to the document
    details.appendChild(insideDiv);
};

function saveChangesRead(event) {
    //Get index of the book object that corresponds with the checklist in everything array
      //Uses the text of summary, since it is based on the object's index
    let cboxParentIndex = Number(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent[0]) - 1;
    everythingArray[cboxParentIndex].read = event.target.checked;
    save();
};   

function saveChangesNotes(event) {
    //Functions basically the same way as the saveChangesRead function but runs on Keypress and Blur instead of click
    let notesParentIndex = Number(event.target.parentElement.previousElementSibling.textContent[0]) - 1;
    everythingArray[notesParentIndex].notes = event.target.value; 
    save();
};

function moveUp(event) {
    let book = everythingArray[Number(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent[0]) - 1];
    console.log(book.position)
    if (book.position > 0) {
        let firstHalf = everythingArray.slice(0, book.position - 1);
        let previous = everythingArray[book.position - 1]
        let secondHalf = everythingArray.slice(book.position + 1); 
        everythingArray = [...firstHalf, book, previous, ...secondHalf];
    };
    refreshPage();
}

function moveDown(event) {
    let book = everythingArray[Number(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent[0]) - 1];
    console.log(book.position)
    if (book.position < everythingArray.length - 1) {
        let firstHalf = everythingArray.slice(0, book.position);
        let next = everythingArray[book.position + 1]
        let secondHalf = everythingArray.slice(book.position + 2); 
        everythingArray = [...firstHalf, next, book, ...secondHalf];
    };
    refreshPage();
}

function showModal() {
    modalWindow.classList.remove('hidden');
    overlay.classList.remove("hidden");
};

function closeModal() {
    modalWindow.classList.add("hidden");
    overlay.classList.add("hidden");
}; 

let bookToDelete;
function setUpDel(event) {
    let index = Number(event.target.parentElement.parentElement.previousElementSibling.textContent[0]) - 1; //
    bookToDelete = everythingArray[index];
    showModal();
};
    //Remove a book from the array by slicing it and reassigning a shallow copy of the slices
function delBook() {
    let book = bookToDelete;
    if (book != undefined) {
        let firstHalf = everythingArray.slice(0, book.position);
        let secondHalf = everythingArray.slice(book.position + 1);
        everythingArray = [...firstHalf, ...secondHalf];
    };
    refreshPage();
};

function cancelDel(){ 
    bookToDelete = undefined;
};

function exportCopy() {
    console.log(JSON.stringify(everythingArray));
    navigator.clipboard.writeText(JSON.stringify(everythingArray));
};

function importData(){ 
    let importText = prompt("Import");
    if (importText != null) {
        console.log();
        localStorage.setItem("everythingArray", importText);
        everythingArray = JSON.parse(importText);
        refreshPage();
    };
};

//// Set up Onclicks and onloads ////
addBookBefore.onclick = appendBefore;
addBookAfter.onclick = appendAfter;
window.onload = pageOnload;

//modal window buttons
leftModalBtn.onclick = delBook;
rightModalBtn.onclick = closeModal;
