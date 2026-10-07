// API and shared data r jonno steps 

// step1: API ta age declare korbo
const API = "https://openapi.programming-hero.com/api";

// step2: currentTrees and cart declare korbo
let currentTrees = [];  // trees currently shown on the page
let cart = [];          // trees the user added to the cart 

// step 3 spinner add korbo 
const spinnerHTML =
  '<div class="col-span-full flex justify-center py-10">' +
  '<span class="loading loading-spinner loading-lg text-green-700"></span></div>';

//   calling all html elements using id 
const categoryContainer = document.getElementById("category-container");
const treeContainer = document.getElementById("tree-container");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const plantForm = document.getElementById("plant-form");
const treeModal = document.getElementById("tree-modal");
const modalContent = document.getElementById("modal-content");

// API theke Categories load korar function create korbo. 
async function loadCategories() {
  const response = await fetch(API + "/categories");
  const data = await response.json();
  showCategories(data.categories);
}

// catagory gulo show korar jonno function create korbo.

function showCategories(categories) {
    // variable er vitor rakhbo innerhtml text ta. 
    // ei function er vitor ekta parameter ache jeta categories. 
  let html =
    `<button id="cat-btn-all" onclick="selectCategory('all')"
      class="btn btn-sm justify-start btn-ghost">All Trees</button>`;
      //   for each er bodle caile for ... of use kora jaito ekhane loop er jonno 

  for (const category of categories) {
    html += `<button id="cat-btn-${category.id}" onclick="selectCategory(${category.id})"
      class="btn btn-sm justify-start btn-ghost">${category.category_name}</button>`;
  }

  categoryContainer.innerHTML = html;
}


// catagory te click korle seta active hoite hobe, so ekhan active button set korar function likhbo 
// step: 1st e ager ta reset korbo, then style korbo 
function setActiveButton(id) {
  // 1. Make every button look inactive
  for (const button of categoryContainer.children) {
    // classt list diye remove korbo age, erpor hide korar jonno ghost 
    button.classList.remove("bg-green-700", "text-white", "border-none");
    button.classList.add("btn-ghost");
  }
  // 2. Make the clicked one look active
  const activeButton = document.getElementById("cat-btn-" + id);
//   hide remove korbo then show korbo 
  activeButton.classList.remove("btn-ghost");
  activeButton.classList.add("bg-green-700", "text-white", "border-none");
} 
// eita to function create korsi. 
// ekhn oi function ke call korbo jodi user catagory te click kore. 
// so ekta function create korbo selectCategory name e.

// selectCategory function er vitor setActiveButton call korbo, 
// then spinner show korbo, then fetch korbo data.

async function selectCategory(id) {
  setActiveButton(id);
    try {
    let url = API + "/plants";
    if (id !== "all") {
      url = API + "/category/" + id;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    const data = await response.json();

    currentTrees = data.plants;
    showTrees(currentTrees);
  } catch (error) {
    console.log(error);
    treeContainer.innerHTML =
      '<p class="col-span-full text-center text-red-600">Could not load trees. Please try again.</p>';
  }
}
// show trees function create korbo, jeta currentTrees ke show korbe. tobe function ekhno call kori nai, call kora lagbe last e tokhon i load nibe just.

function showTrees(trees) {
  if (trees.length === 0) {
    treeContainer.innerHTML =
      '<p class="col-span-full text-center text-slate-500">No trees found in this category.</p>';
    return;
  }

  let html = "";
  for (const tree of trees) {
    html += `
      <div class="card bg-white shadow-sm">
        <div class="p-3">
          <img src="${tree.image}" alt="${tree.name}" class="h-40 w-full object-cover rounded-lg" />

          <h3 onclick="showDetails(${tree.id})"
            class="mt-3 text-sm font-semibold cursor-pointer hover:text-green-700">${tree.name}</h3>

          <p class="mt-1 text-xs text-slate-500 line-clamp-2">${tree.description}</p>

          <div class="flex justify-between items-center mt-3">
            <span class="badge badge-sm bg-green-100 text-green-700 border-none">${tree.category}</span>
            <span class="text-sm font-semibold">৳${tree.price}</span>
          </div>

          <button onclick="addToCart(${tree.id})"
            class="btn btn-sm w-full mt-3 rounded-full bg-green-700 hover:bg-green-800 text-white border-none">
            Add to Cart
          </button>
        </div>
      </div>`;
  }
  treeContainer.innerHTML = html;
}

// tree show kore felsi ekhn modal add korbo jate click korle details show kore 
async function showDetails(id) {
  modalContent.innerHTML = spinnerHTML;
  treeModal.showModal();

  try {
    const response = await fetch(API + "/plant/" + id);
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    const data = await response.json();
    const tree = data.plants; // for this endpoint it is ONE object, not a list

    modalContent.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="h-56 w-full object-cover rounded-lg" />
      <h3 class="mt-4 text-xl font-bold text-slate-800">${tree.name}</h3>
      <p class="mt-2 text-sm text-slate-600">${tree.description}</p>
      <div class="flex justify-between items-center mt-4">
        <span class="badge bg-green-100 text-green-700 border-none">${tree.category}</span>
        <span class="font-semibold">৳${tree.price}</span>
      </div>`;
  } catch (error) {
    console.log(error);
    modalContent.innerHTML =
      '<p class="text-red-600">Could not load tree details.</p>';
  }
}

// cart er manage korbo ekhane. 

function addToCart(id) {
  for (const tree of currentTrees) {
    if (tree.id === id) {
      cart.push({ id: tree.id, name: tree.name, price: tree.price });
      break;
    }
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  let html = "";
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    total += item.price;

    html += `
      <div class="flex justify-between items-center bg-green-50 rounded-lg p-2">
        <div>
          <p class="text-sm font-semibold">${item.name}</p>
          <p class="text-xs text-slate-500">৳${item.price} × 1</p>
        </div>
        <button onclick="removeFromCart(${i})" class="btn btn-ghost btn-xs">❌</button>
      </div>`;
  }

  if (cart.length === 0) {
    html = '<p class="text-sm text-slate-500">Your cart is empty.</p>';
  }

  cartList.innerHTML = html;
  cartTotal.innerText = "৳" + total;
}


plantForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = plantForm.querySelector('input[type="text"]').value;
  const trees = plantForm.querySelector("select").value;

  alert("Thank you, " + name + "! You pledged to plant " + trees + " tree(s).");
  plantForm.reset();
});

async function startApp() {
  await loadCategories();   // buttons must exist before we can highlight one
  selectCategory("all");
}
renderCart(); // replaces the sample cart item from the HTML
startApp();