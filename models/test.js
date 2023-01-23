var mealsByCategory = [];

var addCategory = true;

//add new categories
for(let i=0; i<burgerList.length; i++) {

    // console.log('i: ' + i);

    for(let j=0; j<mealsByCategory.length; j++) {

        // console.log('j: ' + j);

        if(burgerList[i].category===mealsByCategory[j].categoryName){
            addCategory=false;
        };
    }

    console.log('addCategory: ' + addCategory);

    if(addCategory) {
        mealsByCategory.push(
            {
                categoryName:burgerList[i].category, 
                mealKits:[]
            }
        );
        mealsByCategory[mealsByCategory.length-1].categoryName = burgerList[i].category;
        
        // console.log('mealsByCategory.length: ' + mealsByCategory.length);
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