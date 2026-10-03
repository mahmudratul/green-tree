//form clear er jonno
const plantForm = document.getElementById("plant-form");

plantForm.addEventListener("submit", function (event) {
  event.preventDefault();   // stop the page from reloading
  alert("Thank you for planting a tree with us! 🌱");
  plantForm.reset();        // clear the fields
});