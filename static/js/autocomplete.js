// Example taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete

function autocomplete(inp, getDataFn, clickCallback) {
  // inp -> DOM element
  // getDataFn -> return data
  let currentFocus;
  // execute a function when someone writes in the text field:
  inp.addEventListener("input", function(e) {
    const inputValue = this.value;
      // close any already open lists of autocompleted values
    closeAllLists();

    // Return if there is no value
    if (!inputValue) { 
      return false;
    }
    currentFocus = -1;

    // create a DIV element that will contain the items (values):
    const a = document.createElement("div");
    a.setAttribute("id", `${this.id}autocomplete-list`);
    a.setAttribute("class", "autocomplete-items");
    
    // append the DIV element as a child of the autocomplete container:
    this.parentNode.appendChild(a);

    getDataFn(inputValue).then((arr) => {
      arr.forEach(value => {
        const targetMatch = value.substr(0, inputValue.length);
        const matchSuffix = value.substr(inputValue.length);

        if (targetMatch.toUpperCase() === inputValue.toUpperCase()) {
          const b = document.createElement('div');

          b.innerHTML = `
            <strong>${targetMatch}</strong>${matchSuffix}
            <input type="hidden" value='${value}'>
          `;

          b.addEventListener("click", function(e) {
            // insert the value for the autocomplete text field:
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();

            if (clickCallback) {
              clickCallback(inp.value);
            }
          });
          a.appendChild(b);
        }
      })
    });
  });
  // execute a function presses a key on the keyboard:
  inp.addEventListener("keydown", function(e) {
      let x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        // If the arrow DOWN key is pressed, increase the currentFocus:
        currentFocus++;
        // and and make the current item more visible:
        addActive(x);
      } else if (e.keyCode == 38) { //up
        //If the arrow UP key is pressed, decrease the currentFocus
        currentFocus--;
        //and and make the current item more visible:
        addActive(x);
      } else if (e.keyCode == 13) {
        //If the ENTER key is pressed, prevent the form from being submitted,
        e.preventDefault();
        if (currentFocus > -1) {
          // and simulate a click on the "active" item:
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    // a function to classify an item as "active":
    if (!x) return false;
    // start by removing the "active" class on all items:
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    // add class "autocomplete-active":
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    // a function to remove the "active" class from all autocomplete items:
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    // close all autocomplete lists in the document except the one passed as an argument:
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  // execute a function when someone clicks in the document:
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}