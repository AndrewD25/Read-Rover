"use strict";

/*/////////////////////////////
    Note this is just brainstorming and a to-do for all time, not a to-do before May 15ish
    To Do:

    Refactor if possible?
    Continue to improve and refactor CSS (and media query?) 
    Set max width and height for the box on the left proportionate to the vw and vh? (I'm not sure what I meant by this)
    Write Documentation
    Maybe add more tools, and a label that says "tools"
    Improve Sticker Menu : Add CSS for sizing , Change Input Method , Add a bunch more options
    Work on dividers in spare time

*/////////////////////////////

///// VARIABLES /////

// Get Elements //
const main = document.getElementById("main");
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
const menuHR = document.getElementById("hrAboveBottomMenu");
const filterMenu = document.getElementById("filterMenu");
const filterPropertySelect = document.getElementById("filterSelector");
const filterValueTextInput = document.getElementById("filterValue");
const stickerMenu = document.getElementById("stickerMenu");
const addSticker = document.getElementById("addStickerBtn");
const stickerSelectDiv = document.getElementById("imgGrid");
const stickerPosition = document.getElementById("stickerNumber");

    //stars
let formStars = Array.from(document.getElementsByClassName("formStar"));
let formStarImgs = new Array(5).fill('emptyStar.png');

// Big array that holds all the books //
let everythingArray = [];

// Initialize Filter //
if (localStorage.getItem("currentFiltering") === null) {
    localStorage.setItem("currentFiltering", JSON.stringify(""));
};

///// FUNCTIONS /////
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
            formStarImgs[j] = formStars[j].getAttribute("src");
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
        favorite: bookFavoriteInput.checked,
        notes: bookNotesInput.value,
        image: bookImageInput.value,
        position: bookPositionInput.value,
    };

    //// Fix Values that are left blank ////
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

function refreshPage() {
    save();
    document.location.reload();
};

function save() {
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
        alert("Not a valid position for replacement!");
        return;
    };
    let firstHalf = everythingArray.slice(0, book.position - 1);
    let secondHalf = everythingArray.slice(book.position);
    everythingArray = [...firstHalf, book, ...secondHalf];

    refreshPage();
}

// Set up display when page loads
function pageOnload() {
    if (localStorage.getItem('everythingArray') !== null) {
        everythingArray = JSON.parse(localStorage.getItem("everythingArray"));
        let filtering = JSON.parse(localStorage.getItem('currentFiltering'));
        let [filterBy, includes] = filtering;
        for (let i = 0; i < everythingArray.length; i++) {
            if (filtering === "") {
                drawBook(everythingArray[i]);
            } else {
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
                                };
                            };
                        };
                        if (includes.includes(".5")|| includes.includes("1/2") || includes.includes("half") || includes.includes("1/2")) {
                            ratingTotal += 0.5;
                        };
                        
                        let starFilterArray = [];
                        for (let i = 0; i < Math.floor(ratingTotal); i++) {
                            starFilterArray.push("fullStar.png");
                        };
                        if (ratingTotal !== Math.floor(ratingTotal)) {
                            starFilterArray.push("halfStar.png");
                        };
                        for (let i = 0; i < 5 - starFilterArray.length; i++) {
                            starFilterArray.push("emptyStar.png");
                        }
                        if (JSON.stringify(everythingArray[i].rating) === JSON.stringify(starFilterArray)) {
                            drawBook(everythingArray[i]);
                        };
                        break;
                    case "favorite": //If favorite value is true
                        if (everythingArray[i].favorite) {
                            drawBook(everythingArray[i]);
                        };
                        break;
                    default: //These are just, "If book.property includes 'includes' variable"
                        if (everythingArray[i][filterBy].toLowerCase().includes(includes)) {
                            drawBook(everythingArray[i]);
                        };
                };
            };
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
    } else if (book.name !== "" && book.series !== "") {
        displayString = `${book.series}: ${book.name}`;
    } else if (book.series !== "") {
        displayString = book.series
    } else if (book.name !== "") {
        displayString = book.name
    } else {
        displayString = "???"
    }

    if (book.hasOwnProperty('sticker')) {
        summary.innerHTML = `${Number(everythingArray.indexOf(book)) + 1}.<span class="alignRight">${displayString}&nbsp;&nbsp;&nbsp;<img class="sticker" src="${book.sticker}"></span>`;
    } else {
        summary.innerHTML = `${Number(everythingArray.indexOf(book)) + 1}.<span class="alignRight">${displayString}</span>`;
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
    for (let i = 0; i < book.rating.length; i++) {
        let aStar = document.createElement("img");
        aStar.src = book.rating[i];
        aStar.classList.add("smallStar");
        ratingBox.appendChild(aStar);
        book.stars.push(aStar);
    };
    book.stars.forEach((item) => {
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

function saveChangesFavorite(event) {
    //Get index of the book object that corresponds with the checklist in everything array
      //Uses the text of summary, since it is based on the object's index
    let cboxParentIndex = Number(event.target.parentElement.parentElement.parentElement.previousElementSibling.textContent[0]) - 1;
    let book = everythingArray[cboxParentIndex];
    let parentDiv = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    book.favorite = event.target.checked;
    save();
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
};

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
};

    //Functions for modal windows
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

let bookToDelete;
function setUpDel(event) {
    let index = Number(event.target.parentElement.parentElement.previousElementSibling.textContent[0]) - 1; //
    bookToDelete = everythingArray[index];
    showDeleteModal();
};
        
function delBook() { //Remove a book from the array by slicing it and reassigning a shallow copy of the slices
    let book = bookToDelete;
    if (book != undefined) {
        let firstHalf = everythingArray.slice(0, book.position);
        let secondHalf = everythingArray.slice(book.position + 1);
        everythingArray = [...firstHalf, ...secondHalf];
    };
    refreshPage();
};

// Function to export the data, encoded using rot13
function exportCopy() {
    let encodedData = rot13Encode(JSON.stringify(everythingArray));
    navigator.clipboard.writeText(encodedData);
}
  
  // Function to import the data, decoded using rot13
function importData() {
    let encodedText = prompt("Import");
    if (encodedText != null) {
        let decodedData = rot13Decode(encodedText);
        localStorage.setItem("everythingArray", decodedData);
        everythingArray = JSON.parse(decodedData);
        refreshPage();
    }
};

//Tool Menu Functions
let filterMenuOpen = !((localStorage.getItem("currentFiltering") !== null) && JSON.parse(localStorage.getItem("currentFiltering")) !== "");

function toggleFilterMenu() {
    if (filterMenuOpen) {
        menuHR.classList.add("hidden");
        filterMenu.classList.add("hidden");
        for (let i = 0; i < 2; i++) {
            filterMenu.children[i].style.display = "none"
            filterMenu.children[1].children[i].style.display = "none";
        };
    } else {
        menuHR.classList.remove("hidden");
        filterMenu.classList.remove("hidden");
        for (let i = 0; i < 2; i++) {
            filterMenu.children[i].style.display = "flex";
            filterMenu.children[1].children[i].style.display = "flex";
        };
        filterMenu.children[1].style.justifyContent = "center";
    };
    filterMenuOpen = !filterMenuOpen
};

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

function setFilter() {
    localStorage.setItem('currentFiltering', JSON.stringify([filterPropertySelect.value, filterValueTextInput.value]));
    refreshPage();
};

function clearFilter() {
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

const stickerModal = document.getElementById("stickerModal");
function openStickerModal() {
    stickerModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

function closeStickerModal() {
    stickerModal.classList.add("hidden");
    overlay.classList.add("hidden");
};

    //Sticker functions
let stickerToAdd; //A variable that is set by event listeners later
function selectSticker(event) {
    for (let i = 0; i < stickerSelectDiv.children.length; i++) {
        stickerSelectDiv.children[i].classList.remove("selected");
    };
    event.target.classList.add("selected");
    selectedStickerText.textContent = event.target.getAttribute("title");
    stickerToAdd = event.target.getAttribute("src");
}

function setSticker() {  
    let selectedSticker = stickerToAdd;
    let wantedBookPosition = stickerPosition.value
    if (selectedSticker == undefined) {
        alert("You didn't select a sticker! 💀")
        return;
    } else if ((wantedBookPosition < 1) || (wantedBookPosition > everythingArray.length)) {
        alert("If a book doesn't exist, can you even put a sticker on it? 🤔");
        return;
    };
    everythingArray[wantedBookPosition - 1].sticker = selectedSticker;
    refreshPage();
};

//// Set up Onclicks and onloads ////
addBookBefore.onclick = appendBefore;
addBookAfter.onclick = appendAfter;
replaceBook.onclick = replace;
window.onload = pageOnload;

//Tool button onclicks
let buttonsArray = document.getElementById("toolButtons").children;
buttonsArray[0].onclick = exportCopy;
buttonsArray[1].onclick = importData;
buttonsArray[2].onclick = save;
buttonsArray[3].onclick = showResetModal;
toggleFilterMenu();
buttonsArray[4].onclick = toggleFilterMenu;
buttonsArray[6].onclick = openStickerModal; //Open sticker modal window

//Filter buttons
filterPropertySelect.onchange = changeValueText;
filterMenu.children[1].children[0].onclick = setFilter; //Left filter button (set)
filterMenu.children[1].children[1].onclick = clearFilter; //Right filter button (clear)

//Buttons inside modal windows
document.getElementsByClassName("leftModalBtn")[0].onclick = delBook;
document.getElementsByClassName("rightModalBtn")[0].onclick = closeDeleteModal;
document.getElementsByClassName("leftModalBtn")[1].onclick = reset;
document.getElementsByClassName("rightModalBtn")[1].onclick = closeResetModal;
document.getElementsByClassName("leftModalBtn")[2].onclick = setSticker;
document.getElementsByClassName("rightModalBtn")[2].onclick = closeStickerModal;

  //Add event listeners to each img in the sticker modal
for (let i = 0; i < stickerSelectDiv.children.length; i++) {
    stickerSelectDiv.children[i].addEventListener("click", selectSticker)
};



