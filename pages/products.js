import Layout from "@/components/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useGlobalContext } from "@/context/userContext";
import Login from "./login";
import { CgEye } from "react-icons/cg";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const { auth } = useGlobalContext();
  useEffect(() => {
    getProducts();
  }, []);

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

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }
  return (
    <>
      <Layout className="">
        <div className="flex items-center justify-center my-5">
          <Link href={"/products/new"}>
            <button
              className="flex items-center gap-2  bg-orange-100 hover:bg-orange-50 p-2 rounded-lg  
            "
            >
              Create New Product
            </button>
          </Link>
        </div>

        {/* display all Products */}

        <div className="flex h-auto bg-orange-100 p-4 rounded-lg flex-col gap-3 m-10">
          {allProducts?.length === 0 && <p>no products found</p>}
          {allProducts?.length !== 0 && (
            <p className="text-center text-2xl mt-3">All products</p>
          )}

          {allProducts?.map((ele, idx) => {
            return (
              <>
                <div key={idx} className="flex justify-between p-4 ">
                  <div>{ele?.name}</div>
                  <div className="flex gap-4">
                    <Link href={`/products/view/${ele?._id}`}>
                      <CgEye size={25} className="hover:text-orange-400 mr-1" />
                    </Link>
                    <Link href={`/products/edit/${ele?._id}`}>
                      <FaRegEdit size={25} className="hover:text-orange-400" />
                    </Link>

                    <Link href={`/products/delete/${ele?._id}`}>
                      <MdDelete size={25} className="hover:text-red-400" />
                    </Link>
                  </div>
                </div>
                {idx !== allProducts?.length - 1 && (
                  <div className="h-[1px] bg-orange-200 mb-3"></div>
                )}{" "}
              </>
            );
          })}
        </div>
      </Layout>
    </>
  );
};

export default Products;
