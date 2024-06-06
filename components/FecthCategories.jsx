import React, { useEffect, useState } from "react";

const FecthCategories = () => {
  const [allCategories, setAllCategories] = useState([]);

  const getAllProducts = async () => {
    try {
      let res = await fetch("/api/categories", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();

      if (res.ok) {
        setAllCategories(dataFromResponse);
      } else {
        setAllCategories([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);
  return { allCategories };
};

export default FecthCategories;
