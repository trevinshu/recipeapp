import { async } from 'regenerator-runtime/runtime';

const categoryBtn = document.querySelectorAll('#categoryBtn');
const recipeContainer = document.getElementById('recipeContainer');

categoryBtn.forEach((categoryItem) => categoryItem.addEventListener('click', categoryClick));

function categoryClick(e) {
  const categoryName = e.target.innerText.toLowerCase();
  getRecipesByCategory(categoryName);
  e.preventDefault();
}

async function getRecipesByCategory(categoryName) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
  const data = await response.json();
  const meals = data.meals.slice(0, 10);
  let html = '';

  if (meals) {
    meals.forEach((meal) => {
      html += `
      <div class="recipeItem">
        <img src="${meal.strMealThumb}" alt="" />
        <div class="recipeContent">
          <h2>${meal.strMeal}</h2>
          <button id="viewRecipeBtn" href="#" data-id="${meal.idMeal}">View Recipe</button>
        </div>
      </div>
      `;
    });
  }
  recipeContainer.innerHTML = html;
}
