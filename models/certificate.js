const { Schema, model } = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const crypto = require('crypto');

const certificateSchema = new Schema(
  {
    course: {
      type: String,
      uppercase: true,
      required: [true, "Please the course name"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      uppercase: true,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    grade: {
      type: String,
      uppercase: true,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

certificateSchema.pre("validate", function (next) {
  const certificate = this;

  certificate.slug = slugify(certificate.course, {
    strict: true,
    lower: true,
  });

  certificate.code = crypto.randomBytes(6).toString('hex');

  next();
});

const Certificate = model("Certificate", certificateSchema);
module.exports = Certificate;
