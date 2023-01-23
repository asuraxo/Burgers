var burgerList = [
    {
        // id          : 1,
        title       : 'Cheese Burger',
        includes    : 'Regular Bun, Beef Patty, Pasteurized Process American Cheese, Ketchup, Pickle Slices, Onions, Mustard',
        description : 'Very delicious Cheese Burger',
        category    : 'Classic Meals',
        price       : 5.99,
        cookingTime : 5,
        servings    : 1,
        imageUrl    : 'CheeseBurger.png',
        topMeal     : false
    },

    {
        // id          : 2,
        title       : 'Bacon & Cheese Burger',
        includes    : 'Premium Bun, Beef Patty, Pasteurized Process American Cheese, Applewood Smoked Bacon, Ketchup, Pickle Slices, Onions, Mustard',
        description : 'Our Famous Bacon & Cheese Burger',
        category    : 'Classic Meals',
        price       : 6.99,
        cookingTime : 6,
        servings    : 1,
        imageUrl    : 'Bacon&CheeseBurger.png',
        topMeal     : true
    },

    {
        // id          : 3,
        title       : 'Double Burger',
        includes    : 'Premium Bun, Double Beef Patty, Pasteurized Process American Cheese, Mayonnaise, Ketchup, Pickle Slices, Onions, Mustard',
        description : 'Burgers that you cannot finish on your own',
        category    : 'Family Meals',
        price       : 7.99,
        cookingTime : 8,
        servings    : 2,
        imageUrl    : 'DoubleBurger.png',
        topMeal     : false
    },

    {
        // id          : 4,
        title       : 'Chicken Burger',
        includes    : 'Premium Bun, Spicy Chicken Breast, Jalapeno Cream Cheese, Shredded Pepper Jack Cheese, Applewood Smoked Bacon, Ketchup, Pickle Slices, Onions, Mustard',
        description : 'Our most crispy choice',
        category    : 'Red Meat Free Meals',
        price       : 6.99,
        cookingTime : 6,
        servings    : 1,
        imageUrl    : 'ChickenBurger.png',
        topMeal     : true
    },

    {
        // id          : 5,
        title       : 'Fish Burger',
        includes    : 'Premium Bun, Fish Filet Patty, Pasteurized Process American Cheese, Applewood Smoked Bacon, Tartar Sauce, Pickle Slices, Onions',
        description : 'Our seafood choice',
        category    : 'Red Meat Free Meals',
        price       : 6.99,
        cookingTime : 7,
        servings    : 1,
        imageUrl    : 'FishBurger.png',
        topMeal     : false
    },

    {
        // id          : 6,
        title       : 'Plant Based Burger',
        includes    : 'Premium Bun, Plant-Based Light Life Beef Pattery, Pasteurized Process American Cheese, Applewood Smoked Bacon, Tartar Sauce, Pickle Slices, Onions',
        description : 'Vegetarian\'s Choice',
        category    : 'Red Meat Free Meals',
        price       : 6.99,
        cookingTime : 5,
        servings    : 1,
        imageUrl    : 'PlantBasedBurger.png',
        topMeal     : true
    },
    {
        // id          : 7,
        title       : 'Premium Angus Burger',
        includes    : 'Premium Bun, Premium Angus Patty, Pasteurized Process American Cheese, Mayonnaise, Ketchup, Pickle Slices, Onions, Mustard',
        description : 'The most premium choice',
        category    : 'Classic Meals',
        price       : 8.99,
        cookingTime : 10,
        servings    : 2,
        imageUrl    : 'AngusBurger.png',
        topMeal     : true
    },
    {
        // id          : 8,
        title       : 'Shrimp Burger',
        includes    : 'Premium Bun, Crsipy Shrimp Filet Patty, Pasteurized Process American Cheese, Applewood Smoked Bacon, Tartar Sauce, Pickle Slices, Onions',
        description : 'Our fresh and crispy choice',
        category    : 'Classic Meals',
        price       : 5.99,
        cookingTime : 6,
        servings    : 1,
        imageUrl    : 'ShrimpBurger.png',
        topMeal     : false
    }
];

module.exports.getAllMeals = function() {
    return burgerList;
};

module.exports.getTopMealkits = function() {
    let topMealList = [];
    burgerList.forEach((element) => {
        if(element.topMeal) {
            topMealList.push(element);
        }
    });
    return topMealList;
};

module.exports.getMealsByCategory = function() {
    var mealsByCategory = [];
    var addCategory = true;
    //add new categories
    for(let i=0; i<burgerList.length; i++) {
        for(let j=0; j<mealsByCategory.length; j++) {
            if(burgerList[i].category===mealsByCategory[j].categoryName){
                addCategory=false;
            };
        }
        if(addCategory) {
            mealsByCategory.push(
                {
                    categoryName:burgerList[i].category, 
                    mealKits:[]
                }
            );
            mealsByCategory[mealsByCategory.length-1].categoryName = burgerList[i].category;            
        }
        addCategory = true;
    }
    //push into category
    for(let i=0; i<burgerList.length; i++) {
        for(let j=0; j<mealsByCategory.length; j++) {
            if(burgerList[i].category===mealsByCategory[j].categoryName){
                mealsByCategory[j].mealKits.push(burgerList[i]);
            }
        }
    }
    return mealsByCategory;
};
