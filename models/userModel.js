const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

// userSchema.pre("save", function (next) {
//     let user = this;

//     // Generate a unique SALT.
//     bcrypt.genSalt(10)
//         .then(salt => {
//             // Hash the password using the generated SALT.
//             bcrypt.hash(user.password, salt)
//                 .then(hashedPwd => {
//                     // Password was hashed.
//                     // Update the user model before we save it to the database.
//                     user.password = hashedPwd;
//                     next();
//                 })
//                 .catch(err => {
//                     console.log(`Error occurred when hashing ... ${err}`);
//                 })
//         })
//         .catch(err => {
//             console.log(`Error occurred when salting ... ${err}`);
//         });
// });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  });

const userModel = mongoose.model("users", userSchema)

module.exports = userModel;