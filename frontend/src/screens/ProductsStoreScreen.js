/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import { LogThisLegacy } from "../libs/Logger";

const ProductsStoreScreen = ({ match }) => {
  let logSettings = {
    sourceFilename: "ProductStoreScreen",
    sourceFunction: "",
  };
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();
  const [categoryList, setcategoryList] = useState([]);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
    // eslint-disable-next-line
  }, [dispatch, keyword, pageNumber]);

  useEffect(() => {
    let productsOfCategory = [];
    let localCategoryList = [];
    logSettings.sourceFunction = "useEffect to calculate categories";
    LogThisLegacy(
      logSettings,
      `!loading=${JSON.stringify(!loading)}, products=${JSON.stringify(
        products
      )}, productsOfCategory = ${JSON.stringify(
        productsOfCategory
      )}, categoryList=${JSON.stringify(categoryList)}`
    );
    if (!loading && products) {
      products.forEach((product) => {
        if (!localCategoryList.includes(product.category)) {
          localCategoryList.push(product.category);
        }
      });
      productsOfCategory = products.filter(
        (product) => product.category === "Digital Photos Licenses"
      );
      setcategoryList(localCategoryList);
      LogThisLegacy(
        logSettings,
        `!loading=${JSON.stringify(!loading)}, products=${JSON.stringify(
          products
        )}, productsOfCategory = ${JSON.stringify(
          productsOfCategory
        )}, categoryList=${JSON.stringify(localCategoryList)}`
      );
      // eslint-disable-next-line
    }
  }, [productList, products, loading]);

  return (
    <>
      {LogThisLegacy(
        logSettings,
        `ProductStoreScreen, Rendering, Start Rendering: loading=${loading}, products=${JSON.stringify(
          products
        )}`
      )}
      <Meta />
      {LogThisLegacy(
        logSettings,
        `ProductStoreScreen, Rendering, about to check loading: loading=${loading}, products=${JSON.stringify(
          products
        )}, categoryList=${JSON.stringify(categoryList)}`
      )}
      {loading ||
      (!products ?? true) ||
      categoryList.length === 0 ||
      products.length === 0 ? (
        <>
          {LogThisLegacy(
            logSettings,
            `ProductStoreScreen, Rendering, Still loading cycle: loading=${loading}, products??true=${
              products ?? true
            }, categoryList.length==0=${
              categoryList.length === 0
            }, products.length==0=${
              products.length === 0
            }, products=${JSON.stringify(
              products
            )}, categoryList=${JSON.stringify(categoryList)}`
          )}
          <Loader />
        </>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {categoryList.map((category, index) => (
            <React.Fragment key={index}>
              {LogThisLegacy(
                logSettings,
                `ProductStoreScreen, Rendering, categoryList, cycle of categories forEach: loading=${category}`
              )}
              <h1>{category}</h1>
              <Row>
                {products
                  ?.filter((product) => product.category === category)
                  .map((product, index2) => (
                    <React.Fragment key={`${index}-${index2}`}>
                      {LogThisLegacy(
                        logSettings,
                        `ProductStoreScreen, Rendering, products map, categoryList, map: product=${product}`
                      )}
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                      </Col>
                    </React.Fragment>
                  ))}
              </Row>
            </React.Fragment>
          ))}
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default ProductsStoreScreen;
