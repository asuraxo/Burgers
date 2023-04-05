const mongoose = require("mongoose");

const mealKitSchema = new mongoose.Schema ({
    title       : {type: String,  unique: true,  required: true },
    includes    : {type: String,                 required: true },
    description : {type: String,                 required: true },
    category    : {type: String,                 required: true },
    price       : {type: Number,                 required: true },
    cookingTime : {type: Number,                                },
    servings    : {type: Number,                                },
    imageUrl    : {type: String                                 },
    topMeal     : {type: Boolean,                               }
});

const mealkitModel = mongoose.model("meal-kits", mealKitSchema);

module.exports = mealkitModel;