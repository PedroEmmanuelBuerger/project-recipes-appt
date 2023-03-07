import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppRecipesContext from '../context/AppRecipesContext';

export default function Recipes() {
  const history = useHistory();

  const { recipesMeal,
    recipesDrink,
    categoriesRecipesMeal,
    categoriesRecipesDrink, filterByCategory,
    filter, setFilter } = useContext(AppRecipesContext);

  const [recipes, setRecipes] = useState([]);
  const [categoriesRecipes, setCategoriesRecipes] = useState([]);
  const [toggled, setToggled] = useState(false);

  const setCategoryFunc = async (category) => {
    const { location: { pathname } } = history;
    await filterByCategory(category, pathname);
    setToggled(!toggled);
  };

  const removeFilters = () => {
    setFilter([]);
    setToggled(!toggled);
  };

  const toggle = (category) => {
    if (!toggled) {
      return setCategoryFunc(category);
    }
    removeFilters();
  };

  const getDetails = (recipe) => {
    const id = recipe.idMeal || recipe.idDrink;
    const { location: { pathname } } = history;
    const path = pathname.includes('meals')
      ? `/meals/${id}`
      : `/drinks/${id}`;
    history.push(path);
  };

  useEffect(() => {
    const { location: { pathname } } = history;
    if (pathname.includes('meals')) {
      setRecipes(recipesMeal);
      setCategoriesRecipes(categoriesRecipesMeal);
    } else {
      setRecipes(recipesDrink);
      setCategoriesRecipes(categoriesRecipesDrink);
    }
    if (filter.length > 0) {
      setRecipes(filter);
    }
  }, [recipesMeal, recipesDrink, filter, categoriesRecipesMeal, categoriesRecipesDrink]);

  return (
    <div>
      <button
        onClick={ () => removeFilters() }
        data-testid="All-category-filter"
      >
        All
      </button>
      {categoriesRecipes?.map((category, index) => (
        <button
          key={ index }
          data-testid={ `${category.strCategory}-category-filter` }
          type="button"
          onClick={ () => toggle(category.strCategory) }
        >
          {category.strCategory}
        </button>
      ))}
      {recipes?.map((recipe, index) => (
        <div
          aria-hidden="true"
          onClick={ () => getDetails(recipe) }
          key={ index }
          data-testid={ `${index}-recipe-card` }
        >
          <h2 data-testid={ `${index}-card-name` }>
            {recipe.strMeal || recipe.strDrink}
          </h2>
          <img
            data-testid={ `${index}-card-img` }
            src={ recipe.strMealThumb || recipe.strDrinkThumb }
            alt={ recipe.strMeal || recipe.strDrink }
          />
        </div>
      ))}
    </div>
  );
}
