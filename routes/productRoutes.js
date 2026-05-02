const express = require("express");
const productController = require("./../controllers/productController");
const router = express.Router();
const authController = require("../controllers/authController");  

router
.route("/top-3-cheap")
.get(productController.aliasTopProducts, productController.getAllProducts);

router.route('/product-category').get(productController.getProductCategory);

//router.param("id", productController.checkID); //Middleware to check if the ID parameter is valid before processing the request further

//Defining routes for the products resource, including GET, POST, PATCH, and DELETE operations
router
  .route("/")
  .get(authController.protect, productController.getAllProducts)
  .post(productController.createProduct);

//Defining routes for specific product operations based on the product ID, including GET, PATCH, and DELETE operations
router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(authController.protect, authController.restrictTo("admin"), productController.deleteProduct);

module.exports = router;
