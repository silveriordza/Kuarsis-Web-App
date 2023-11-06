/** @format */

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import {
  PRODUCT_UPDATE_RESET,
  PRODUCT_DETAILS_SUCCESS,
} from "../constants/productConstants";
import { BACKEND_ENDPOINT } from "../constants/enviromentConstants";
import { convert } from "../libs/imagesLib";
import { LogThis } from "../libs/Logger";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [isShippable, setisShippable] = useState(false);
  const [isDownloadable, setisDownloadable] = useState(false);
  const [isImageProtected, setisImageProtected] = useState(false);
  const [isBookable, setisBookable] = useState(false);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  LogThis(`ProductEditScreen, product=${JSON.stringify(product)}`);

  const productUpdate = useSelector((state) => state.productUpdate);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
    product: updatedProduct,
  } = productUpdate;
  LogThis(
    `ProductEditScreen, updatedProduct=${JSON.stringify(updatedProduct)}`
  );
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch({
        type: PRODUCT_DETAILS_SUCCESS,
        payload: updatedProduct,
      });
      history.push("/admin/productlistadmin");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        if (product.isCreated) {
          setName(product.name);
          setPrice(product.price);
          setImage(product.image);
          setBrand(product.brand);
          LogThis("ProductEditScreen, useEffect, product =", product);
          setisShippable(product.isShippable);
          setisDownloadable(product.isDownloadable);
          setisImageProtected(product.isImageProtected);
          setisBookable(product.isBookable);
          setCategory(product.category);
          setCountInStock(product.countInStock);
          setDescription(product.description);
        }
      }
    }
  }, [dispatch, history, productId, product, updatedProduct, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    setUploading(true);
    try {
      console.log("before UPLOAD post");

      const { data } = await axios.get(
        BACKEND_ENDPOINT + `/upload/getPutObjectURLs`
      );
      const { preSignedPublicURL, preSignedPrivateURL, fileS3Name } = data;

      //----------START FILE SIZE REDUCTION AND WATERMARKING
      let newFile = null;

      convert({
        file: file,
        width: 600,
        height: 400,
        type: "jpeg",
        watermarkText: "Kuarsis Pixan Copyright",
      })
        .then((watermarkedImage) => {
          axios
            .put(preSignedPublicURL, watermarkedImage, {
              headers: {
                "Content-Type": "image/jpeg",
              },
            })
            .then(function ({ data }) {
              console.log("Public Upload Progress: Upload Completed", data);
            });
        })
        .catch((error) => {
          throw error;
        });

      await axios.put(preSignedPublicURL, newFile, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      console.log("Public Upload Progress: Upload Completed");
      await axios.put(preSignedPrivateURL, file, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      console.log("Private Upload Progress: Upload Completed");

      console.log("LOG after upload file path: ", fileS3Name);
      setImage(fileS3Name);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        isShippable,
        isDownloadable,
        isImageProtected,
        isBookable,
        category,
        description,
        countInStock,
        isCreated: true,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productlistadmin" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                className=""
                onChange={uploadFileHandler}
              ></Form.Control>
              {/* <Form.File
                id='image-file'
                label='Choose File'
                // custom
                // onChange={uploadFileHandler}
              ></Form.File> */}
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <br />
            <Form.Group controlId="isShippable">
              {LogThis(
                `ProductEditScreen, CheckboxControl, isShippable=${isShippable}`
              )}
              <Form.Check
                type="checkbox"
                label="Product is shippable"
                checked={isShippable}
                onChange={(e) => {
                  LogThis(
                    `ProductEditScreen, CheckboxControl, e.target.checked=${e.target.checked}`
                  );
                  setisShippable(e.target.checked);
                }}
              ></Form.Check>
            </Form.Group>
            <Form.Group controlId="isDownloadable">
              {LogThis(
                `ProductEditScreen, CheckboxControl, isDownloadable=${isDownloadable}`
              )}
              <Form.Check
                type="checkbox"
                label="Product is downloadable"
                checked={isDownloadable}
                onChange={(e) => {
                  LogThis(
                    `ProductEditScreen, CheckboxControl, e.target.checked=${e.target.checked}`
                  );
                  setisDownloadable(e.target.checked);
                }}
              ></Form.Check>
            </Form.Group>
            <Form.Group controlId="isImageProtected">
              {LogThis(
                `ProductEditScreen, CheckboxControl, isImageProtected=${isImageProtected}`
              )}
              <Form.Check
                type="checkbox"
                label="Product is image protected"
                checked={isImageProtected}
                onChange={(e) => {
                  LogThis(
                    `ProductEditScreen, CheckboxControl, e.target.checked=${e.target.checked}`
                  );
                  setisImageProtected(e.target.checked);
                }}
              ></Form.Check>
            </Form.Group>
            <Form.Group controlId="isBookable">
              {LogThis(
                `ProductEditScreen, CheckboxControl, isBookable=${isBookable}`
              )}
              <Form.Check
                type="checkbox"
                label="Product is bookable"
                checked={isBookable}
                onChange={(e) => {
                  LogThis(
                    `ProductEditScreen, CheckboxControl, e.target.checked=${e.target.checked}`
                  );
                  setisBookable(e.target.checked);
                }}
              ></Form.Check>
            </Form.Group>
            <br />
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
