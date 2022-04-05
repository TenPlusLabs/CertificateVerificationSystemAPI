const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please the course name"],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Course = model("Course", courseSchema);
module.exports = Course;
