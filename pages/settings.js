import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import Login from "./login";
import toast from "react-hot-toast";

const Settings = () => {
  const { auth } = useGlobalContext();
  const [allProducts, setAllProducts] = useState([]);
  const [featureProduct, setFeatureProduct] = useState("");
  const [currentFeatureProduct, setCurrentFeatureProduct] = useState("");

  useEffect(() => {
    getProducts();
    getFeaturedProduct();
  }, [currentFeatureProduct]);

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

  console.log(allProducts);

  // handleFeatureProduct
  const handleFeatureProduct = (id) => {
    let changeFeatureProductPromise = new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(`/api/feature`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ id }),
        });
        let dataFromResponse = await res.json();
        if (res.ok) {
          resolve();
          setCurrentFeatureProduct(dataFromResponse?.name);
        } else {
          reject();
        }

        toast.promise(changeFeatureProductPromise, {
          loading: "updating feature product...",
          success: "feature product updated",
          error: "something went wrong !!",
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  const getFeaturedProduct = async () => {
    try {
      let res = await fetch("/api/feature", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);
      setCurrentFeatureProduct(dataFromResponse?.name);
    } catch (err) {
      console.log(err);
    }
  };

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }
  return (
    <>
      <Layout>
        {allProducts?.length <= 0 && (
          <p className="text-center">no products found</p>
        )}{" "}
        {allProducts && allProducts?.length > 0 && (
          <>
            <div className="flex flex-col gap-3 bg-orange-100 rounded-md p-5 cursor-pointer">
              <p className="text-center text-2xl mt-3"> Feature Product</p>
              <select
                className="bg-orange-200 mb-5 rounded-lg p-2 cursor-pointer"
                value={featureProduct}
                onChange={(e) => handleFeatureProduct(e.target.value)}
              >
                <option value="">Select one</option>
                {allProducts?.map((ele, idx) => {
                  return (
                    <option value={ele?._id} key={idx}>
                      {ele?.name}
                    </option>
                  );
                })}
              </select>
              <div className="p-2">
                <p>Current Feature product</p>
                <h1 className="text-2xl font-bold font-mono">
                  {currentFeatureProduct
                    ? currentFeatureProduct
                    : "no feature product found"}
                </h1>
              </div>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Settings;
