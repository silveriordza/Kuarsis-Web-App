/** @format */

let asyncHandler = require("express-async-handler");
let {
  SuperSuvey,
  Survey,
  Question,
  MultiSurvey,
  SuperSurveyCollected,
  SurveyResponse,
} = require("../models/surveysModel.js");
let { LogThis } = require("../utils/Logger.js");

// @desc    Update a product
// @route   PUT /api/surveys/:id
// @access  Private/Admin
const surveyProcessing = asyncHandler(async (req, res) => {
  // const {
  //   name,
  //   price,
  //   description,
  //   image,
  //   brand,
  //   isShippable,
  //   isDownloadable,
  //   isImageProtected,
  //   isBookable,
  //   category,
  //   countInStock,
  //   isCreated,
  // } = req.body
  const fieldName = "1";
  const Surveys = await MultiSurvey.find({ fieldName: fieldName }).exec();

  LogThis(`surveyController, surveyProcessing`);

  if (Surveys) {
    //   product.name = name
    //   product.price = price
    //   product.description = description
    //   product.image = image
    //   product.brand = brand
    //   product.isShippable = isShippable
    //   product.isDownloadable = isDownloadable
    //   product.isImageProtected = isImageProtected
    //   product.isBookable = isBookable
    //   product.category = category
    //   product.countInStock = countInStock
    //   product.isCreated = isCreated
    //   LogThis(`productController, updateProduct, product=${product}`)
    //   const updatedProduct = await product.save()
    //   LogThis(`productController, updateProduct, updatedProduct=${updatedProduct}`)
    //res.json(updatedProduct)
    res.status(200);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  surveyProcessing,
};
