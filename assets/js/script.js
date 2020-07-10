var zipAPIKey = "DKAL53OVWYNIRCSEKZZM";
var searchButton = document.querySelector("#search-button");
var clearButton = document.querySelector("#clear-button");
var dishInput = document.querySelector("#user-food-input").value;
var dishNameInputForm = document.querySelector("#search-button");

// for alert modal
var modalAlertCard = document.querySelector("#modal-display");

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
searchButton.addEventListener("click", function (){
  var userCuisineName = document.querySelector("#user-food-input").value
  var userZipInput = document.querySelector("#user-zipcode-input").value
  if(userCuisineName && userZipInput) {
    fetch(`https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${userZipInput}?key=${zipAPIKey}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
          userAlert("It seems like your search has no match. Try again!");
        }
      })
      .then(function(response) {
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
// clearButton.addEventListener("click", function() {
//   localStorage.clear();
// });
