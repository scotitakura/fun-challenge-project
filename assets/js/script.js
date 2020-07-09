var zipAPIKey = "JVSMA0VD62UG6J85ZKQY";
var searchButton = document.querySelector("#search-button");
var clearButton = document.querySelector("#clear-button");
var foodInput = document.getElementById('user-food-input')
var dishInput = document.querySelector("#user-food-input").value;
var dishNameInputForm = document.querySelector("#search-button");
// for alert modal
var modalAlertCard = document.querySelector("#modal-display");

var ZipInput = document.getElementById('user-zipcode-input')


//local storage var
var prevSearch = localStorage.length


function toastSuggestion() {
  console.log("add toast time")
  if (prevSearch > 2) {
    var firstSearch = localStorage[1]

    M.toast({
      html: `Craving ${firstSearch} again? <button onclick= "populateSearch()" class="btn-flat toast-action">Click Here</button>`,
      classes: 'rounded '
    })
    //<button onclick= "populateSearch(${firstSearch})"
    var toastAction = document.querySelector(".toast-action")
    console.log(toastAction)
    console.log(prevSearch)

  }
}

toastSuggestion()


function populateSearch() {
  console.log("func called")


  var fdInput = foodInput
  var zInput = ZipInput
  fdInput.value = localStorage.getItem("1")
  zInput.value = localStorage.getItem("zipcode")

}





// creates modal to alert issues to user
function userAlert(message) {
  var modalAlertDOM = document.createElement("div");
  modalAlertCard.appendChild(modalAlertDOM);
  modalAlertDOM.innerHTML = `
    <div id="modal2" class="modal bottom-sheet">
      <div class="modal-content">
        <h5>${message}</h5>
      </div>
        <div class="modal-footer">
          <a href="index.html" class="modal-close waves-effect waves-green btn-flat">Got it.</a>
        </div>
      </div>
    </div>`
  var elem = document.querySelector('#modal2');
  var instance = M.Modal.init(elem);
  instance.open();
};

// at onClick of Search button
searchButton.addEventListener("click", function () {
  var userCuisineName = document.querySelector("#user-food-input").value
  var userZipInput = document.querySelector("#user-zipcode-input").value
  console.log(dishInput)
  console.log(userCuisineName, userZipInput)
  if (userCuisineName && userZipInput) {
    fetch(`https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${userZipInput}?key=${zipAPIKey}`)
      .then(function (response) {
        if (response.ok) {
          localStorage.setItem("zipcode", userZipInput)

          return response.json();
        } else {
          userAlert("It seems like your search has no match. Try again!");
        }
      })
      .then(function (response) {
        zipToLat = response.Latitude.toFixed(1);
        zipToLon = response.Longitude.toFixed(1);
        window.location.href = `indexA.html?&lat=${zipToLat}&lon=${zipToLon}&cuisines=${userCuisineName}`
      })
      .catch(err => {
        userAlert("Please enter a valid zip code.");
      });
  } else {
    userAlert("Please enter what food you're craving for and what zip code you're in.");
  }
});

// clear all search history
clearButton.addEventListener("click", function () {
  localStorage.clear();
});