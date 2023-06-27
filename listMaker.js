"use strict";

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Ideas for Future Features (Add some over Summer when I have more time and knowledge)
  -----------------------------------------------------------------------------------------
    Media query css?
    Eventually learn to set up a db
        - If usernames created, place username in name of .txt download file
    Separate web page for keeping track of loans?
    Way to create a wishlist? (Also maybe a separate webpage?)
    Way to create a list of books that should be added that is faster
      than adding each book to create a "add in detail later" type feature
    Brainstorm features I want to add over the summer as I use the tool
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


///// Setup /////

const main = document.getElementById("main"); //Where books will be added

// Form elements
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
const addBookBefore = document.getElementById("addBookBtn1");
const addBookAfter = document.getElementById("addBookBtn2");
const replaceBook = document.getElementById("replaceBtn");
const bookPositionInput = document.getElementById("insertNumber");
const bookReplaceInput = document.getElementById("replaceNumber");
const bookFavoriteInput = document.getElementById("favorite");

// Menus and buttons
const menuHR = document.getElementById("hrAboveBottomMenu");
const filterMenu = document.getElementById("filterMenu");
const filterPropertySelect = document.getElementById("filterSelector");
const filterValueTextInput = document.getElementById("filterValue");
const dividerMenu = document.getElementById("dividerMenu");
const addDividerButton = document.getElementById("addDividerBtn");
const stickerMenu = document.getElementById("stickerMenu");
const addSticker = document.getElementById("addStickerBtn");
const stickerSelectDiv = document.getElementById("imgGrid");
const stickerPosition = document.getElementById("stickerNumber");

// Stars
let formStars = Array.from(document.getElementsByClassName("formStar"));
let formStarImgs = new Array(5).fill('emptyStar.png');

// Array that holds all the objects
let everythingArray = [];

// Initialize Filter
if (localStorage.getItem("currentFiltering") === null) {
    localStorage.setItem("currentFiltering", JSON.stringify(""));
};


///// FUNCTIONS /////

function reset() { //Clear and refresh
    localStorage.clear();
    document.location.reload();
}

formStars.forEach((item) => { //Set up ability to click on and change stars
    item.addEventListener('click', (event) => {
        let x = event.pageX - item.offsetLeft;
        if (x < item.width / 2) { //mouse on left side
            item.setAttribute("src", "halfStar.png");
        } else { //mouse on right side
            item.setAttribute("src", "fullStar.png");
        }
        for (let j = 0; j < formStars.length; j++) {
            if (j < formStars.indexOf(item)) {
                formStars[j].setAttribute("src", "fullStar.png");
            } else if (j > formStars.indexOf(item)) {
                formStars[j].setAttribute("src", "emptyStar.png");
            };
            formStarImgs[j] = formStars[j].getAttribute("src");
        };
        bookReadInput.checked = true;
    });                     
});            

bookReadInput.onclick = function () {
    if (!bookReadInput.checked) { //Detects if the book is marked unread
        for (let i = 0; i < formStars.length; i++) {
            formStars[i].setAttribute("src", "emptyStar.png");
            formStarImgs[i] = formStars[i].getAttribute("src");
        };
    };    //This function disables the ability to add a rating to an unread book in the form. Removing 'read' removes the rating
};

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
        favorite: bookFavoriteInput.checked,
        notes: bookNotesInput.value,
        image: bookImageInput.value,
        position: bookPositionInput.value,
    };

    //// Fix Values that are left blank ////
    if (book.number != Number(book.number) || book.number === "") {
        book.numberType = "No Number";  //Any book without a number is marked as no number
    };

    if (book.numberType === "Un-numbered") {
        book.number = ""; //Any book set to No Number will have its number removed and text fixed
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

function createDivider() {
    let divider = { //Store values from divider menu
        after: document.getElementById("insertDividerAfterNumber").value, //The first number, divi will be entered after
        before: document.getElementById("insertDividerBeforeNumber").value, //The second number, divi will be entered before
        title: document.getElementById("dividerTitleInput").value,
        color: document.getElementById("dividerColorInput").value,
    }; 

    return divider;
}

function refreshPage() {
    save();
    document.location.reload();
};

function save() { //Saves array of book and divider objects into the browser's local storage to be retrieved upon refresh
    localStorage.setItem("everythingArray", JSON.stringify(everythingArray));
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
    let firstHalf = everythingArray.slice(0, book.position + 1);
    let secondHalf = everythingArray.slice(book.position + 1);
    everythingArray = [...firstHalf, book, ...secondHalf];

    refreshPage();
};

function replace() {
    book = createBook();
    book.position = bookReplaceInput.value; 
    if (book.position < 1 || (book.position > everythingArray.length)) {
        //A book does not exist at that position
        alert("Not a valid position for replacement!");
        return;
    };
    let firstHalf = everythingArray.slice(0, book.position - 1);
    let secondHalf = everythingArray.slice(book.position);
    everythingArray = [...firstHalf, book, ...secondHalf];

    refreshPage();
};

function appendDivider() {
    let info = createDivider();
    if (everythingArray.length >= info.after) {
        let firstHalf = everythingArray.slice(0, info.after);
        let secondHalf = everythingArray.slice(info.after);
        everythingArray = [...firstHalf, info, ...secondHalf];
    //Notice that the after property is always used to find the position, never before.
     //The before property is just an extra redundancy left over from initial development
      //left in because it doesn't hurt anything and sometimes used to check if an object is a divider
    } else {
        alert("You can't put a divider there! 😭")
        return;
    };

    refreshPage();
};

// Set up display when page loads
function pageOnload() {
    if (localStorage.getItem('everythingArray') !== null) {
        //Set up filtering
        everythingArray = JSON.parse(localStorage.getItem("everythingArray"));
        let filtering = JSON.parse(localStorage.getItem('currentFiltering'));
        let [filterBy, includes] = filtering;
        //Choose what elements to draw
        for (let i = 0; i < everythingArray.length; i++) {
            if (everythingArray[i].hasOwnProperty("before")) { //Means the object stores a Divider
                drawDivider(everythingArray[i]);
            } else if (filtering === "") { //No filters
                drawBook(everythingArray[i]);
            } else { //Filtering
                includes = includes.toLowerCase();

                //Set text
                filterPropertySelect.value = filterBy;
                filterValueTextInput.value = includes;
                document.getElementById("currentFilterDisplay").textContent = `Currently Filtering By ${filterBy.slice(0, 1).toUpperCase()}${filterBy.slice(1)}: ${includes}`

                //Actual Feature
                switch (filterBy) { //Some filters are special and must perform differently     ////Add some "onselects" or whatever to make the "value unnecessary" thing
                    case "read": //If a book's read value is true
                        if (everythingArray[i].read) {
                            drawBook(everythingArray[i]);
                        };
                        break;
                    case "unread": //If a book's read value is false
                        if (!everythingArray[i].read) {
                            drawBook(everythingArray[i]);
                        };
                        break;
                    case "rating": //Rating involves input validation type shenanigans
                        let firstNum = parseInt(includes);
                        let ratingTotal = 0;
                        if (!isNaN(firstNum)) {
                            ratingTotal += firstNum;
                        } else {
                            let checkOrder = ["zero", "one", "two", "three", "four", "five"];
                            for (let i = 0; i < checkOrder.length; i++) {
                                if (includes.includes(checkOrder[i])) {
                                    ratingTotal += i;
                                }; //Find the whole number of the rating
                            };
                        };
                        if (includes.includes(".5")|| includes.includes("1/2") || includes.includes("half") || includes.includes("1/2")) {
                            ratingTotal += 0.5; //If there is a half, adds it to the rating
                        };
                        
                        let starFilterArray = []; //Creates an array of images based on filter input
                        for (let i = 0; i < Math.floor(ratingTotal); i++) {
                            starFilterArray.push("fullStar.png"); //Adds full star for each whole number
                        };
                        if (ratingTotal !== Math.floor(ratingTotal)) { //Adds half star if not whole number. 
                            starFilterArray.push("halfStar.png"); //This check works since the only decimal possible in the variable is 0.5, or half
                        };
                        for (let i = 0; i < 5 - starFilterArray.length; i++) {
                            starFilterArray.push("emptyStar.png"); //Adds empty stars until the amount of stars in the array is 5
                        }
                        //compare filtering array to the array images stored in the book object
                        if (JSON.stringify(everythingArray[i].rating) === JSON.stringify(starFilterArray)) {
                            drawBook(everythingArray[i]);
                        };
                        break;
                    case "favorite": //If favorite value is true
                        if (everythingArray[i].favorite) {
                            drawBook(everythingArray[i]);
                        };
                        break;
                    case "any": //Checks all properties for the 'includes' variable
                        let draw = false;
                        for (let property in everythingArray[i]) {
                            let currentProp = everythingArray[i][property];
                            if (currentProp.toString().toLowerCase().includes(includes)) {
                                draw = true;
                            };
                        };
                        if (draw) drawBook(everythingArray[i]);
                        break;
                    default: //These are just: "If any other specific book property includes the 'includes' variable"
                        if (everythingArray[i][filterBy].toLowerCase().includes(includes)) {
                            drawBook(everythingArray[i]);
                        };
                };
            };
        };
    };
    //Book add form position input defaults to the highest position numbered book
    bookPositionInput.value = everythingArray.length;
};

function getContrast(r, g, b){
    // Calculate the contrast ratio
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return yiq >= 64; //Return true if black text would appear better on the background, false if white is better
};

function hexToRgb(hex) {
    // Convert hex color value to RGB values
    var r = parseInt(hex.substring(1,3), 16);
    var g = parseInt(hex.substring(3,5), 16);
    var b = parseInt(hex.substring(5,7), 16);
    return {r: r, g: g, b: b}; // Return object with r, g, b properties
};

function drawDivider(divi) {
    let newDivider = document.createElement("div");
    newDivider.classList.add("divider");
    newDivider.style.backgroundColor = divi.color;

    //Get Rgb of the background color and uses it to set better contrasting text color
    let rgb = hexToRgb(divi.color);
    
    //Create elements
    newDivider.style.color = (getContrast(rgb.r, rgb.g, rgb.b)) ? "black" : "white";
    let diviNum = document.createElement("p");
    diviNum.textContent = everythingArray.indexOf(divi) + 1 +"."; 
    let diviTitle = document.createElement("h2");
    diviTitle.textContent = divi.title
    let diviDel = document.createElement("button");
    diviDel.addEventListener("click", setUpDiviDel);
    diviDel.textContent = "Delete";
    diviDel.classList.add("diviDel");
    
    //Append divider elements to document
    newDivider.appendChild(diviNum);
    newDivider.appendChild(diviTitle);
    newDivider.appendChild(diviDel);
    main.appendChild(newDivider);

};

function generateBookTitle(book) {
    let displayString;
    if (book.numberType != "No Number") { //Tries first to display something like "Batman Volume 1"
        displayString = `${book.series} ${book.numberType} ${book.number}`;
    } else if (book.name !== "" && book.series !== "") { //Then tries something like "Batman The Court of Owls" if there is no number but is a name
        displayString = `${book.series}: ${book.name}`;
    } else if (book.series !== "") { //Then something like "Flashpoint" if there is no name or number
        displayString = book.series
    } else if (book.name !== "") { //Then something like "Lord of the Flies" if the book has a name but no series
        displayString = book.name
    } else { //If no data can be found, defaults to ?s
        displayString = "???"
    };
    return displayString;
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
    let displayString = generateBookTitle(book);

    let bookNumber = Number(everythingArray.indexOf(book)) + 1; //The num that will be displayed next to books
    if (book.hasOwnProperty('sticker')) {
        //Sticker img tag is added to summary innerHTML if there is one
        summary.innerHTML = `${bookNumber}.<span class="alignRight">${displayString}&nbsp;&nbsp;&nbsp;<img class="sticker" src="${book.sticker}"></span>`;
    } else {
        summary.innerHTML = `${bookNumber}.<span class="alignRight">${displayString}</span>`;
    }

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
    bookImage.onerror = function(){bookImage.src='altImg.jpg';}; //Replaces img with an alt-img if linked img would cause error
    leftSpan.appendChild(bookImage);
    insideDiv.appendChild(leftSpan);

    //Book details contained on right side
    let rightSpan = document.createElement("span");
    rightSpan.classList.add("rightSide");

    let publisherLabel = document.createElement("p");
    publisherLabel.textContent = "Publisher: ";
    let publisher = document.createElement("p");
    publisher.innerHTML = book.publisher != "" ? book.publisher : `<i>?</i>`;
    rightSpan.appendChild(publisherLabel);
    rightSpan.appendChild(publisher);
    rightSpan.appendChild(document.createElement("br"));

    let continuityLabel = document.createElement("p");
    continuityLabel.textContent = "Continuity: ";
    let continuity = document.createElement("p");
    continuity.innerHTML = book.continuity != "" ? book.continuity : `<i>?</i>`;    
    rightSpan.appendChild(continuityLabel);
    rightSpan.appendChild(continuity);
    rightSpan.appendChild(document.createElement("br"));

    let seriesLabel = document.createElement("p");
    seriesLabel.textContent = "Series: ";
    let series = document.createElement("p");
    series.innerHTML = book.series != "" ? book.series : `<i>?</i>`;
    rightSpan.appendChild(seriesLabel);
    rightSpan.appendChild(series);
    rightSpan.appendChild(document.createElement("br"));

    let numberLabel = document.createElement("p");
    numberLabel.textContent = book.numberType + " ";
    let number = document.createElement("p");
    number.textContent = book.numberType != "No Number" ? book.number : "";
    rightSpan.appendChild(numberLabel);
    rightSpan.appendChild(number);
    rightSpan.appendChild(document.createElement("br"));

    let nameLabel = document.createElement("p");
    nameLabel.textContent = "Title: ";
    let name = document.createElement("p");
    name.innerHTML = book.name != "" ? book.name : `<i>?</i>`;
    rightSpan.appendChild(nameLabel);
    rightSpan.appendChild(name);
    rightSpan.appendChild(document.createElement("br"));

    let formatLabel = document.createElement("p");
    formatLabel.textContent = "Format: ";
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
    rightSpan.appendChild(document.createElement("br"));

    // Favorite Setup 
        //If book is marked as favorite, it will default to a 5-star rating
    if (book.hasOwnProperty("favorite")) {
        if (book.favorite) {
            newDiv.classList.add("favoriteBook");
            book.rating = ['fullStar.png', 'fullStar.png', 'fullStar.png', 'fullStar.png', 'fullStar.png'];
        };
    } else {
        newDiv.classList.remove("favoriteBook");
        book.favorite = false;
    }

    // Rating
    let ratingBox = document.createElement('div')
    let ratingLabel = document.createElement("p");
    ratingLabel.textContent = "Rating:";
    ratingBox.appendChild(ratingLabel);
    book.stars = [];
    for (let i = 0; i < book.rating.length; i++) { //Adds stars and sets up styling selectors
        let aStar = document.createElement("img");
        aStar.src = book.rating[i];
        aStar.classList.add("smallStar");
        ratingBox.appendChild(aStar);
        book.stars.push(aStar);
    };
    book.stars.forEach((item) => { //Set up ability for stars to be clicked on and have the rating change saved
        item.addEventListener('click', (event) => {
            let x = event.pageX - item.offsetLeft;
            if (x < item.width / 2) { //mouse on left side
                item.setAttribute("src", "halfStar.png");
            } else { //mouse on right side
                item.setAttribute("src", "fullStar.png")
            }
            for (let j = 0; j < book.stars.length; j++) {
                if (j < book.stars.indexOf(item)) {
                    book.stars[j].setAttribute("src", "fullStar.png");
                } else if (j > book.stars.indexOf(item)) {
                    book.stars[j].setAttribute("src", "emptyStar.png");
                };
                book.rating[j] = book.stars[j].getAttribute("src");
            };
            if (book.favorite) {
                for (let j = 0; j < book.stars.length; j++) {
                    book.stars[j].setAttribute("src", "fullStar.png");
                };
            };
            readLabel.children[0].checked = true;
            book.read = true;
            save();

        });                     
    }); 
    rightSpan.appendChild(ratingBox);
    insideDiv.appendChild(rightSpan);

    //Add Favorite and fav event listener to document
    let favoriteLabel = document.createElement("p");
    favoriteLabel.innerHTML = book.favorite ? `Favorite? <input type="checkbox" checked>` : `Favorite? <input type="checkbox">`;
    favoriteLabel.addEventListener("click", saveChangesFavorite);
    rightSpan.appendChild(favoriteLabel);
    rightSpan.appendChild(document.createElement("br"));

    //Notes area that goes on bottom
    let notesBox = document.createElement("textarea");
    notesBox.value = book.notes;
    notesBox.addEventListener("keyup", saveChangesNotes);
    insideDiv.appendChild(notesBox);

    //Up, down, populate, delete buttons
    let buttonsContainer = document.createElement("div");
    let upDownContainer = document.createElement("span");
    let popDelContainer = document.createElement("span");
    let upBtn = document.createElement("button");
    let downBtn = document.createElement("button");
    let popBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    //u, d, p, d buttons text
    upBtn.textContent = "Move Up";
    downBtn.textContent = "Move Down";
    popBtn.textContent = "Populate Form"
    deleteBtn.textContent = "Delete Book";

    //u, d, p, d button classes and ids
    buttonsContainer.classList.add("posContainer");
    upDownContainer.setAttribute("id", "upDownContainer")
    popDelContainer.setAttribute("id", "popDelContainer")
    upBtn.classList.add("posButtons");
    upBtn.setAttribute("id", "up")
    downBtn.classList.add("posButtons");
    downBtn.setAttribute("id", "down");
    popBtn.classList.add("posButtons");
    popBtn.setAttribute("id", "populate");
    deleteBtn.classList.add("posButtons");
    deleteBtn.setAttribute("id", "delete");

    //u, d, p, d button click event listeners
    upBtn.addEventListener("click", moveUp);
    downBtn.addEventListener("click", moveDown);
    popBtn.addEventListener("click", populateForm);
    deleteBtn.addEventListener("click", setUpDel);

    // Append u, d, p, d buttons
    upDownContainer.appendChild(upBtn);
    upDownContainer.appendChild(downBtn);
    popDelContainer.appendChild(popBtn);
    popDelContainer.appendChild(deleteBtn);
    buttonsContainer.appendChild(upDownContainer);
    buttonsContainer.appendChild(popDelContainer);
    insideDiv.appendChild(buttonsContainer);

    //Add the book's container to the document
    details.appendChild(insideDiv);
};

function saveChangesRead(event) {
    //Get index of the book object that corresponds with the checklist in everything array
      //Uses the text of summary, since it is based on the object's index
    let cboxParentIndex = parseInt(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent) - 1;
    let book = everythingArray[cboxParentIndex];
    book.read = event.target.checked;

    if (!book.read) {
        book.rating = ['emptyStar.png', 'emptyStar.png', 'emptyStar.png', 'emptyStar.png', 'emptyStar.png'];
        for (let i = 0; i < book.stars.length; i++) {
            book.stars[i].setAttribute('src', book.rating[i]);
        };  //This condition disables the ability to add a rating to an unread book. Removing 'read' removes the rating
    };

    save();

};   

function saveChangesFavorite(event) {
    //Get index of the book object that corresponds with the checklist in everything array
      //Uses the text of summary, since it is based on the object's index
    let cboxParentIndex = parseInt(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent) - 1;
    let book = everythingArray[cboxParentIndex];
    let parentDiv = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    book.favorite = event.target.checked;

    save();

    // Favorite books are yellow and get 5 star rating
    if (book.favorite) {
        parentDiv.classList.add("favoriteBook");
        for (let j = 0; j < book.stars.length; j++) {
            book.stars[j].setAttribute("src", "fullStar.png");
        };
    } else {
        parentDiv.classList.remove("favoriteBook");
    };
};  

function saveChangesNotes(event) {
    //Functions basically the same way as the saveChangesRead function but runs on Keypress and Blur instead of click
    let notesParentIndex = parseInt(event.target.parentElement.previousElementSibling.textContent) - 1;
    everythingArray[notesParentIndex].notes = event.target.value; 

    save();
};

function moveUp(event) {
    let book = everythingArray[parseInt(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent) - 1];
    //Uses slicing similarly to how books are added to basically decrease a book's array index by 1
    if (book.position > 0) {
        let firstHalf = everythingArray.slice(0, book.position - 1);
        let previous = everythingArray[book.position - 1]
        let secondHalf = everythingArray.slice(book.position + 1); 
        everythingArray = [...firstHalf, book, previous, ...secondHalf];
    };

    refreshPage();
};

function moveDown(event) {
    let book = everythingArray[parseInt(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent) - 1];
    //Uses slicing similarly to how books are added to basically increase a book's array index by 1
    if (book.position < everythingArray.length - 1) {
        let firstHalf = everythingArray.slice(0, book.position);
        let next = everythingArray[book.position + 1]
        let secondHalf = everythingArray.slice(book.position + 2); 
        everythingArray = [...firstHalf, next, book, ...secondHalf];
    };

    refreshPage();
};

//Modal Window Functions
const modalWindowDel = document.getElementById("modalWindow");
const modalWindowReset = document.getElementById("modalWindow2");
function showDeleteModal() {
    modalWindowDel.classList.remove('hidden');
    overlay.classList.remove("hidden");
};
function closeDeleteModal() {
    modalWindowDel.classList.add("hidden");
    overlay.classList.add("hidden");
}; 
function showResetModal() {
    modalWindowReset.classList.remove('hidden');
    overlay.classList.remove("hidden");
};
function closeResetModal() {
    modalWindowReset.classList.add("hidden");
    overlay.classList.add("hidden");
}; 

const stickerModal = document.getElementById("stickerModal");
function openStickerModal() {
    stickerModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

function closeStickerModal() {
    stickerModal.classList.add("hidden");
    overlay.classList.add("hidden");
};

let bookToDelete;
function setUpDel(event) {
    let index = parseInt(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent) - 1;  //Gets number from summary
    bookToDelete = everythingArray[index];
    showDeleteModal();
};

function setUpDiviDel(event) {
    let index = parseInt(event.target.previousSibling.previousSibling.textContent) - 1; //Gets number from left number
    bookToDelete = everythingArray[index];
    showDeleteModal();
};
      
function delBook() { //Remove a book from the array by slicing it and reassigning a shallow copy of the slices
    let book = bookToDelete;
    if (book != undefined) {
        let firstHalf = everythingArray.slice(0, everythingArray.indexOf(book));
        let secondHalf = everythingArray.slice(everythingArray.indexOf(book) + 1);
        everythingArray = [...firstHalf, ...secondHalf];
    };

    refreshPage();
};

function populateForm(event) { //Used to fill the form with the data from a book
    let index = parseInt(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent) - 1; //Uses same logic as setUpDiviDel()
    let book = everythingArray[index];

    bookPublisherInput.value = book.publisher;
    bookContinuityInput.value = book.continuity;
    bookSeriesInput.value = book.series;
    bookNumberTypeInput.value = book.numberType;
    bookNumberInput.value = book.number;
    bookNameInput.value = book.name;
    bookFormatInput.value = book.format;
    bookReadInput.checked = book.read;
    for (let i = 0; i < 5; i++) { //Iterate over 5 stars
        formStars[i].setAttribute("src", book.stars[i].getAttribute("src"));
        formStarImgs = book.rating;
    };

    bookFavoriteInput.checked = book.favorite;
    bookNotesInput.value = book.notes;
    bookImageInput.value = book.image;
    bookPositionInput.value = book.position + 1;
    bookReplaceInput.value = book.position + 1; // Sets position to more easily replace the one being copied
};

/*/ Function to export the data, encoded using rot13     
               ~Original Export/Import, Encode/Decode Functions~

// Function to encode a string using rot13
function rot13Encode(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c >= 65 && c <= 90) {  // Upper case letters
        result += String.fromCharCode((c - 65 + 13) % 26 + 65);
      } else if (c >= 97 && c <= 122) {  // Lower case letters
        result += String.fromCharCode((c - 97 + 13) % 26 + 97);
      } else {  // Symbols and spaces
        result += str.charAt(i);
      };
    };
    result = "#" + result //If old import data is used, it will not have #, so does not need to be decoded
    return result;
};
  
// Function to decode a string using rot13
function rot13Decode(str) {
      if (str.slice(0, 1) === "#") {
          str = str.slice(1);
          let result = '';
          for (let i = 0; i < str.length; i++) {
              let c = str.charCodeAt(i);
              if (c >= 65 && c <= 90) {  // Upper case letters
                  result += String.fromCharCode((c - 65 + 13) % 26 + 65);
              } else if (c >= 97 && c <= 122) {  // Lower case letters
                  result += String.fromCharCode((c - 97 + 13) % 26 + 97);
              } else {  // Symbols and spaces
          result += str.charAt(i);
          };
      };
      return result;
    };
    return str; //If there is not # at beginning, it does not have to be decoded
};

function exportCopy() {
    let encodedData = rot13Encode(JSON.stringify(everythingArray));
    navigator.clipboard.writeText(encodedData);
}
  
// Function to import the data, decoded using rot13
function importData() {
    let encodedText = prompt("Import");
    if (encodedText != null) { //Prompt returns null if user presses cancel
        let decodedData = rot13Decode(encodedText);
        localStorage.setItem("everythingArray", decodedData);
        everythingArray = JSON.parse(decodedData);
        refreshPage();
    }
};*/

// Tool Menu Functions

//Set up filter and divider menus open booleans
let filterMenuOpen = !((localStorage.getItem("currentFiltering") !== null) && JSON.parse(localStorage.getItem("currentFiltering")) !== "");
let dividerMenuOpen = false; //Filter menu is sometimes open on refresh, but divider is always closed

function toggleFilterMenu() {
    if (filterMenuOpen) { //Close menu
        menuHR.classList.add("hidden");
        filterMenu.classList.add("hidden");
        for (let i = 0; i < 2; i++) {
            filterMenu.children[i].style.display = "none"
            filterMenu.children[1].children[i].style.display = "none";
        };
    } else { //Open menu
        if (dividerMenuOpen) toggleDividerMenu(); //Closes divi menu if it is open
        menuHR.classList.remove("hidden");
        filterMenu.classList.remove("hidden");
        for (let i = 0; i < 2; i++) {
            filterMenu.children[i].style.display = "flex";
            filterMenu.children[1].children[i].style.display = "flex";
        };
        filterMenu.children[1].style.justifyContent = "center";
    };

    filterMenuOpen = !filterMenuOpen;
};

function toggleDividerMenu() {
    if (dividerMenuOpen) { //Close menu
        menuHR.classList.add("hidden");
        dividerMenu.style.display = "none";
    } else { //Open menu
        if (filterMenuOpen) toggleFilterMenu(); //Closes filter menu if it is open
        menuHR.classList.remove("hidden");
        dividerMenu.style.display = "block";
    };

    dividerMenuOpen = !dividerMenuOpen;
};

function setFilter() {
    //Filters are saved in local storage to stay on between refreshes...
    localStorage.setItem('currentFiltering', JSON.stringify([filterPropertySelect.value, filterValueTextInput.value]));
    refreshPage();
};

function clearFilter() {
    //...so to remove a filter, the local storage item must be wiped
    localStorage.setItem('currentFiltering', JSON.stringify(""));
    refreshPage();
};

function changeValueText() {
    if (["read", "unread", "favorite"].includes(filterPropertySelect.value)) { 
        filterValueTextInput.value = "N/A" //Explain no value needed
    } else if (filterPropertySelect.value === "rating") {
        filterValueTextInput.value = "# stars" //Give example of how to enter
    } else {
        filterValueTextInput.value = ""; //Clear box on change else
    };
};

//Sticker functions
let stickerToAdd; //A variable that is set by event listeners later
function selectSticker(event) {
    for (let i = 0; i < stickerSelectDiv.children.length; i++) {
        stickerSelectDiv.children[i].classList.remove("selected");
    };
    event.target.classList.add("selected");
    document.getElementById("selectedStickerText").textContent = event.target.getAttribute("title");
    stickerToAdd = event.target.getAttribute("src");
}

function setSticker() {  
    let selectedSticker = stickerToAdd;
    let wantedBookPosition = stickerPosition.value;
    if (selectedSticker == undefined) {
        alert("You didn't select a sticker! 💀")
        return;
    } else if ((wantedBookPosition < 1) || (wantedBookPosition > everythingArray.length)) {
        alert("If a book doesn't exist, can you even put a sticker on it? 🤔");
        return;
    } else if (everythingArray[wantedBookPosition - 1].hasOwnProperty("before")) { 
        alert("I don't know how to put a sticker on that yet 😢"); //Check for divider
        return;
    };
    everythingArray[wantedBookPosition - 1].sticker = selectedSticker; //Wanted book position - 1 because 0-indexing

    refreshPage();
};

function addNewLines(str) { //Add new lines to the txt file string
    const delimiter = '{"p';
    const doubleNewLine = '\n\n';
    let result = '';
    let index = 0;
    let isFirstDelimiterFound = false; // Flag to track the first delimiter
  
    while (index < str.length) {
      if (str.startsWith(delimiter, index)) {
        if (isFirstDelimiterFound) {
          result += doubleNewLine;
        } else {
          isFirstDelimiterFound = true;
        };
        result += delimiter;
        index += delimiter.length;
      };
      result += str[index];
      index++;
    };

    return result;
};

// Functions to calculate a collection level to be displayed in the txt file download
function calcXP(arr) {
    let xp = 0;
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i])
        if (arr[i].hasOwnProperty("read")) { //Object is a book
            xp += 50;
            if (arr[i].read === true) { 
                xp += 50; //Doubles points if book is read
            };
        };
    };
    return xp;
};

function calcLevel(xp) {
    if (xp <= 0) {
      return { level: 1, extraXP: 0, toNext: 100 };
    };
  
    let level = 1;
    let xpThreshold = 0;
    let xpDifference = 100;
  
    while (xp >= xpThreshold + xpDifference) {
      xpThreshold += xpDifference;
      xpDifference += 100;
      level++;
    };
  
    const extraXP = xp - xpThreshold;
    const toNext = level * 100;
  
    return { level, extraXP, toNext };
};

// Download and Upload Functions
function generateHeading() { // Creates a fun heading string to be added to a txt file
    let text = ""

    text += "\n\n" //line 1
    text += "Hooray, you found the secret stats!"
    text += "\n\n\n"
    text += "Your Collection Stats:\n" //line 4
    text += `${"~".repeat(40)} \n` //line 5

    //Calculate #s of Books, read, and unread (and favorites for later)
    let books = 0;
    let read = 0;
    let favorites = [];
    for (let i = 0; i < everythingArray.length; i++) {
        if (everythingArray[i].hasOwnProperty("read")) { //Isbook
            books++;
            if (everythingArray[i].read === true) {
                read++;
            };
            if (everythingArray[i].favorite === true) {
                favorites.push(everythingArray[i]);
            };
        };
    };
    let unread = books - read; //Unread is the books that are not read

    text += `Books: ${books}\n`; //line 6
    text += `Read: ${read}\n`; //line 7
    text += `Unread: ${unread}\n`; //line 8
    text += "\n" //line 9
    text += "Favorites:\n" //line 10

    //Generate list of favorite books
    for (let i = 0; i < favorites.length; i++) {
        text += `\t- ${generateBookTitle(favorites[i])}\n`;
    };

    //Text about level
    let infoLvl = calcLevel(calcXP(everythingArray));
    text += "\n"
    text += `You are a level ${infoLvl.level} collector! Earn Collection XP by buying and reading books.\n`;
    text += "Each book you own is worth 50 CXP, but reading it doubles its value and earns you 100 CXP per book.\n";
    text += "\n";
    text += `Next Level: ${infoLvl.level + 1} (${infoLvl.extraXP}/${infoLvl.toNext} CXP) \n`
    text += `${"~".repeat(40)} \n\n\n`

    return text;
};

function downloadTextFile() { //Downloads a string as a .txt file
    let heading = generateHeading();
    let readableArray = addNewLines(JSON.stringify(everythingArray));
    let str = heading + readableArray;
    let blob = new Blob([str], { type: 'text/plain' }); //Downloads JSON of everything array with lines added for readability and fun section at top
    let link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));

    const d = new Date(); //Get the current date
    let month = String(d.getMonth() + 1); //Months are 0 indexed (0-11), so add 1 to get correct num
    month = (month.length < 2) ? "0" + month : month; //Add 0 if month is single digit
    let day = String(d.getDate()); //Days are not 0 indexed (1-31)
    day = (day.length < 2) ? "0" + day : day; //Add 0 if day is single digit
    let year = String(d.getFullYear());

    link.setAttribute('download', `Readrover Data ${month}-${day}-${year}` + '.txt'); //concatenating the .txt is a redundancy
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function importFile() { //This section allows my import button to have the functionality of a file select input
    let fileInput = document.getElementById('fileInput');
    fileInput.click();
};
let fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function() {
    let file = fileInput.files[0];
    if (file) {
        try {
            if (file.type !== 'text/plain') {
                throw new Error('Invalid file type. Please select a text file.');
            };
            // File is a valid text file
            let reader = new FileReader();
            reader.onload = function(e) {
                let contents = e.target.result;
                debugger;
                let text = contents.toString(); // Convert the file contents to a string
                debugger;
                text = text.slice(text.indexOf('[{"')) // Remove the heading before parsing
                debugger
                text = text.replaceAll('\n', ''); // Parses out newlines
                debugger;
                localStorage.setItem("everythingArray", text);
                everythingArray = JSON.parse(text);
                refreshPage();
            };
            reader.readAsText(file);
        } catch (error) {
            // Display an alert to the user
            alert(error.message);
        };
    };
});

//// Set up Onclicks and onloads ////
addBookBefore.onclick = appendBefore;
addBookAfter.onclick = appendAfter;
replaceBook.onclick = replace;
addDividerButton.onclick = appendDivider;
window.onload = pageOnload;

// Tool button onclicks //
let buttonsArray = document.getElementById("toolButtons").children;
buttonsArray[0].onclick = downloadTextFile; //Download and import are found in other JS file
buttonsArray[1].onclick = importFile;
buttonsArray[2].onclick = save;
buttonsArray[3].onclick = showResetModal;
toggleFilterMenu(); //Filter menu starts opposite of what it needs to be, so this runs to close/open it at beginning
buttonsArray[4].onclick = toggleFilterMenu;
buttonsArray[5].onclick = toggleDividerMenu;
buttonsArray[6].onclick = openStickerModal; //Open sticker modal window

//Add event listeners to the divider position inputs //
const insDiviAftInput = document.getElementById("insertDividerAfterNumber")
const insDiviBefInput = document.getElementById("insertDividerBeforeNumber")
const increaseDiviVal = () => {insDiviBefInput.value = Number(insDiviAftInput.value) + 1;}
const decreaseDiviVal = () => {insDiviAftInput.value = insDiviBefInput.value - 1;}
insDiviAftInput.addEventListener("input", increaseDiviVal);
insDiviAftInput.addEventListener("keyup", increaseDiviVal);
insDiviBefInput.addEventListener("input", decreaseDiviVal);
insDiviBefInput.addEventListener("keyup", decreaseDiviVal);

// Filter buttons //
filterPropertySelect.onchange = changeValueText;
filterMenu.children[1].children[0].onclick = setFilter; //Left filter button (set)
filterMenu.children[1].children[1].onclick = clearFilter; //Right filter button (clear)

// Buttons and event listeners for modal windows //
document.getElementsByClassName("leftModalBtn")[0].onclick = delBook;
document.getElementsByClassName("rightModalBtn")[0].onclick = closeDeleteModal;
document.getElementsByClassName("leftModalBtn")[1].onclick = reset;
document.getElementsByClassName("rightModalBtn")[1].onclick = closeResetModal;
document.getElementsByClassName("leftModalBtn")[2].onclick = setSticker;
document.getElementsByClassName("rightModalBtn")[2].onclick = closeStickerModal;

document.addEventListener("keydown", function (e) { //Close all modals when esc key is pressed
    if (e.key === "Escape") {
        closeDeleteModal();
        closeResetModal();
        closeStickerModal();
    };
});

//Add event listeners to each img in the sticker modal
for (let i = 0; i < stickerSelectDiv.children.length; i++) {
    stickerSelectDiv.children[i].addEventListener("click", selectSticker)
};



