//form clear er jonno
const plantForm = document.getElementById("plant-form");

plantForm.addEventListener("submit", function (event) {
    event.preventDefault();   // stop the page from reloading
    alert("Thank you for planting a tree with us! 🌱");
    plantForm.reset();        // clear the fields
});

const categoryContainer = document.getElementById("category-container");
const treeContainer = document.getElementById("tree-container");

const showSpinner = () => {
    treeContainer.innerHTML = `
    <div class="col-span-full flex justify-center py-20">
      <span class="loading loading-spinner loading-lg text-green-700"></span>
    </div>
  `;
};
// 1st e ami catagorry load korbo. 
const loadCategories = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    displayCategories(data.categories);
};

// category display korbo
const displayCategories = (categories) => {
    categoryContainer.innerHTML = "";

    // "All Trees" button first
    const allBtn = document.createElement("button");
    allBtn.className = "btn btn-sm justify-start btn-ghost";
    allBtn.textContent = "All Trees";
    allBtn.addEventListener("click", loadAllTrees);
    categoryContainer.append(allBtn);

    // One button per category from the API
    categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm justify-start btn-ghost";
        btn.textContent = cat.category_name;
        btn.addEventListener("click", () => loadTreesByCategory(cat.id));
        categoryContainer.append(btn);
    });
};


const loadTrees = async (url) => {
    showSpinner();
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayTrees(data.plants);
    } catch (error) {
        treeContainer.innerHTML = `
      <p class="col-span-full text-center text-red-500 py-10">
        Could not load trees. Please try again.
      </p>
    `;
    }
};

const loadAllTrees = () => {
    loadTrees("https://openapi.programming-hero.com/api/plants");
};

const loadTreesByCategory = (id) => {
    loadTrees(`https://openapi.programming-hero.com/api/category/${id}`);
};

const displayTrees = (plants) => {
  treeContainer.innerHTML = "";

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className = "card bg-white shadow-sm";
    card.innerHTML = `
      <div class="p-3">
        <img src="${plant.image}" alt="${plant.name}"
             class="h-40 w-full object-cover rounded-lg" />

        <h3 data-id="${plant.id}"
            class="tree-name mt-3 text-sm font-semibold cursor-pointer hover:text-green-700">
          ${plant.name}
        </h3>

        <p class="mt-1 text-xs text-slate-500 line-clamp-2">${plant.description}</p>

        <div class="flex justify-between items-center mt-3">
          <span class="badge badge-sm bg-green-100 text-green-700 border-none">${plant.category}</span>
          <span class="text-sm font-semibold">৳${plant.price}</span>
        </div>

        <button data-id="${plant.id}"
                class="add-btn btn btn-sm w-full mt-3 rounded-full bg-green-700 hover:bg-green-800 text-white border-none">
          Add to Cart
        </button>
      </div>
    `;
    treeContainer.append(card);
  });
};

const setActiveCategory = (activeBtn) => {
  categoryContainer.querySelectorAll("button").forEach((btn) => {
    btn.classList.remove("bg-green-700", "text-white", "border-none");
    btn.classList.add("btn-ghost");
  });
  activeBtn.classList.remove("btn-ghost");
  activeBtn.classList.add("bg-green-700", "text-white", "border-none");
};
loadCategories();
loadAllTrees();