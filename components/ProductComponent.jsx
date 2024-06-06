import React, { useEffect, useState } from "react";

const ProductComponent = () => {
  const [allProducts, setAllProducts] = useState([]);
  const getProducts = async () => {
    try {
      let res = await fetch("/api/products", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);
      setAllProducts(dataFromResponse);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return allProducts;
};

export default ProductComponent;
