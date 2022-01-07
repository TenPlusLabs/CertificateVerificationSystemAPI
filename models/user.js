const {Schema, model} = require("mongoose");
const validator = require("validator");
const {hash, compare} = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const capitalize = (name) => {
  const newName = name.toLowerCase().split(" ");
  let finalName = "";

  newName.forEach((name) => {
    finalName += " " + name[0].toUpperCase() + name.slice(1);
  });

  return finalName.trim();
};

const userSchema = new Schema(
    {
      firstName: {
        type: String,
        required: [true, "Please provide your first name"],
        trim: true,
        set: capitalize,
      },
      lastName: {
        type: String,
        required: [true, "Please provide your last name"],
        trim: true,
        set: capitalize,
      },
      otherName: {
        type: String,
        trim: true,
        set: capitalize,
      },
      matricNumber: {
        type: String,
        required: function () {
            if (this.role === 'admin') {
              return false;
            }
            return true;
        },
        unique: true,
        trim: true,
        uppercase: true,
      },
      gender: {
        type: String,
        lowercase: true,
        enum: ["male", "female"],
      },
      email: {
        type: String,
        required: [true, "Please provide a valid email address"],
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw createError(400, "Email is invalid");
          }
        },
      },
      password: {
        type: String,
        required: [true, "Please provide a secured password"],
        minLength: 6,
        validate(value) {
          if (
              validator.contains(value, "password", {
                ignoreCase: true,
              })
          ) {
            throw createError(400, 'Password cannot contain the word "password"');
          }
        },
      },
      role: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['admin', 'student'],
      },
      tokens: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ]
    },
    {
      timestamps: true,
      toJSON: {virtuals: true},
      toObject: {virtuals: true},
    }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await hash(user.password, 10);
  }

  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email});

  if (!user || !(await compare(password, user.password))) {
    throw createError(400, "Invalid email or password"); // TODO: Throw an http-error instance
  }

  return user;
};

userSchema.methods.genAuthToken = async function () {
  const user = this;

  const token = jwt.sign({_id: user._id.toString()}, "whatever", {expiresIn: 84600});

  user.tokens = user.tokens.concat({token});
  await user.save();

  return token;
};
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.tokens;

  return user;
};

const User = model("User", userSchema);
module.exports = User;
