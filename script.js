class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  // getters
  get title() {
    return this._title;
  }

  get author() {
    return this._author;
  }

  get pages() {
    return this._pages;
  }

  get read() {
    return this._read;
  }

  // setters
  set title(value) {
    if (value.length < 1) {
      return;
    }
    this._title = value;
  }

  set author(value) {
    if (value.length < 1) {
      return;
    }
    this._author = value;
  }

  set pages(value) {
    if (value < 1) {
      return;
    }
    this._pages = value;
  }

  set read(value) {
    if (value === true || value === false) {
      this._read = value;
    } else {
      return;
    }
  }
};

const myLibrary = [];

const addButton = document.getElementById('add-book-button');
addButton.addEventListener('click', addBookToLibrary);

function checkReadBox(boxToCheck) {
    if (boxToCheck.checked == true) {
        return true;
      } else {
        return false;
      };
};

const displayContainer = document.getElementById('display-books-field');

// shows the list of added books in a table
function displayBooks() {
    // resets table items first to avoid duplicates
    displayContainer.textContent = ''; 
    const tr = [];

    for (let i = 0; i < myLibrary.length; i++) {
        tr[i] = document.createElement('tr');
        tr[i].className = 'book-tr';
        const td  = [];
        const objectElements = ['title', 'author', 'pages', 'read'];
        
        for (let j = 0; j < 5; j++) {
            td[j] = document.createElement('td');
            if (j < 3) { // gets text from the first three 'text' inputs
                td[j].textContent = myLibrary[i][objectElements[j]];
            } else if (j === 3) { // the fourth input is of type 'checkbox'
                const checkboxInsideTd = document.createElement('input');
                checkboxInsideTd.type = 'checkbox';
                checkboxInsideTd.className = 'read-checkbox';
                // to associate this DOM element with the actual object it uses a data-attribute that corresponds to the index of the myLibrary array *
                checkboxInsideTd.setAttribute('data-box-no', i);
                if (myLibrary[i].read === true) {
                    checkboxInsideTd.checked = true;
                  } else {
                    checkboxInsideTd.checked = false;
                  }
                  td[j].appendChild(checkboxInsideTd);
            } else { // creates an additional 'remove' button
                const removeBtn = document.createElement('button');
                removeBtn.className = 'x-button';
                removeBtn.setAttribute('data-object-no', i); // *
                removeBtn.textContent = 'X';
                td[j].appendChild(removeBtn);
            }
            // adds these TDs to the tr (of table)
            tr[i].appendChild(td[j]);
        };
        // and lastly adds these TRs to the tbody of the table
        displayContainer.appendChild(tr[i]);
    };

    // removes a given object from an array and thereby the display list
    // has to be done inside the displayBooks function since the TRs and buttons were created here
    const xButton = document.querySelectorAll('.x-button');
    xButton.forEach(xButton => xButton.addEventListener('click', deleteBook));
    
    function deleteBook(e) {
        let dataObjNo = parseInt(e.target.getAttribute('data-object-no'));
        myLibrary.splice(dataObjNo, 1);
        displayBooks(); // restarts the entire function to display the list of books from scratch (since an object was removed from the array)
    };

    // changes the read checkbox of existing object elements
    const readCheckbox = document.querySelectorAll('.read-checkbox');
    readCheckbox.forEach(box => box.addEventListener('click', toggleCheckbox));

    function toggleCheckbox(e) {
        let dataBoxNo = parseInt(e.target.getAttribute('data-box-no'));
        if (myLibrary[dataBoxNo].read == false) {
            // toggle on
            myLibrary[dataBoxNo].read = true;
        } else {
            // toggle off
            myLibrary[dataBoxNo].read = false;
        }
    };
};

function addBookToLibrary() {
  const popup = document.getElementById('popup-container-item');
  popup.classList = 'active';

  const overlay = document.getElementById('overlay');
  overlay.classList = 'active';

  const addItem = document.getElementById('popup-button-item');
  addItem.addEventListener('click', addBookClick);

  closePopupOverlay(popup, overlay);
};

function addBookClick() {
  const popup = document.getElementById('popup-container-item');
  const overlay = document.getElementById('overlay');

  const allInputs = document.querySelectorAll('.item-input');
      const book = new Book(allInputs[0].value, allInputs[1].value, allInputs[2].value, checkReadBox(allInputs[3]));
      //Object.keys() counts all the enumerable properties of the 'book' object; if some property doesn't exist (didn't meet the condition specified in the class setter) then this object is not added to the array
      if (Object.keys(book).length === 4) {
        myLibrary.push(book);
        popup.classList.remove('active');
        overlay.classList.remove('active');
        displayBooks(); // generates the dispaly again after adding a new object to the array
        allInputs.forEach(input => input.value = ''); // clears inputs
      }
}

// hides the popup window when the user clicks outside of it
function closePopupOverlay(popup, overlay) {
  overlay.addEventListener('click', closePopup);
  function closePopup() {
      popup.classList.remove('active');
      overlay.classList.remove('active');
  }
}

// custom form validation error message
const textInputs = document.querySelectorAll('.item-input-text');
textInputs.forEach(input => input.addEventListener('input', (e) => {
  const span = e.currentTarget.nextSibling.nextSibling;
  if (showError(e.currentTarget, span) !== false) {
    showError(e.currentTarget, span);
  }
}))

function showError(input, errorSpan) {
  if (input.validity.valueMissing) {
    errorSpan.textContent = `${input.id} cannot be empty`;
    errorSpan.className = 'error active';
  } else if (input.validity.rangeUnderflow) {
    errorSpan.textContent = `${input.id} value must be larger than 0`;
    errorSpan.className = 'error active';
  } else {
    errorSpan.className = 'error';
    errorSpan.textContent = '';
    return false;
  }
}