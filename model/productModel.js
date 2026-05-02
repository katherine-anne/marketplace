const mongoose = require("mongoose");
const slugify = require("slugify");

//Blueprint for the product documents in the MongoDB database. It defines the structure and validation rules for the product data.
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A product must have a title"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
      min: [0, "Price must be above 0"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    category: {
      type: String,
      required: [true, "A product must have a category"],
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
      trim: true,
      maxlength: [
        50,
        "A product description must have less or equal than 50 characters",
      ],
      minlength: [
        10,
        "A product description must have more or equal than 10 characters",
      ],
    },
    author: {
      type: String,
      required: [true, "A product must have an author"],
    },
    seller: {
      type: String,
      required: [true, "A product must have a seller"],
    },
    postedDate: {
      type: Date,
      required: [true, "A product must have a posted date"],
    },
    productSlug: {
      type: String,
      unique: true,
    },
    premiumProducts: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("daysPosted").get(function () {
  return Math.floor((Date.now() - this.postedDate) / (1000 * 60 * 60 * 24));
});

productSchema.pre("save", function () {
  this.productSlug = slugify(this.title).toUpperCase();
});

productSchema.post("save", function (doc) {
  console.log(doc);
});

productSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { premiumProducts: { $eq: false } } });
});

productSchema.pre(/^find/, function () {
  this.find({ premiumProducts: { $eq: false } });
  this.start = Date.now();
});
productSchema.post(/^find/, function (docs) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;