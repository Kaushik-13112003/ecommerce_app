import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Login from "./login";

const Categories = () => {
  const [category, setCategory] = useState("");
  const { auth } = useGlobalContext();

  const [allCategories, setallCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, [category]);

  const getCategories = async () => {
    try {
      let res = await fetch("/api/categories", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);
      setallCategories(dataFromResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!category) {
      toast.error("add category value !!");
      return;
    }
    try {
      //   setGoToProduct(false);
      const createProductCategory = new Promise(async (resolve, reject) => {
        const res = await fetch("/api/categories", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            category,
          }),
        });

        let dataFromResponse = await res.json();
        // console.log(dataFromResponse);
        if (res.ok) {
          resolve();
          setCategory("");
        } else {
          reject();
        }
      });

      toast.promise(createProductCategory, {
        loading: "creating category...",
        success: "category created",
        error: "something went wrong !!",
      });
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
        <div className="bg-orange-50 p-6 rounded-lg m-6">
          <h1 className="text-center p-4 text-2xl">Manage Categories</h1>
          <form
            action=""
            className="flex flex-col  gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor="category name">Category Name</label>
              <input
                type="text"
                placeholder="category name"
                className="bg-orange-200 rounded-lg p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="flex items-center my-4 justify-center text-center">
              <button className=" w-[100px]   bg-orange-200 hover:bg-orange-100 p-2 rounded-lg">
                Create
              </button>
            </div>
          </form>

          {/* display all Products */}

          <div className="flex h-auto w-[100%] bg-orange-100 p-4 rounded-lg flex-col gap-3 my-7">
            {allCategories?.length === 0 && <p>no categories found</p>}
            {allCategories?.length !== 0 && (
              <p className="text-center text-2xl mt-3">All categories</p>
            )}

            {allCategories?.map((ele, idx) => {
              return (
                <>
                  <div
                    key={idx}
                    className="flex justify-between flex-wrap flex-col sm:flex-row gap-4 p-4 "
                  >
                    <div>
                      <p>
                        {ele?.parentCategory?.category && " Parent Category : "}
                        <span className="text-orange-400">
                          {ele?.parentCategory?.category}
                        </span>
                      </p>
                      <p>Category : {ele?.category}</p>
                    </div>
                    <div className="flex gap-4">
                      <Link href={`/categories/edit/${ele?._id}`}>
                        <FaRegEdit
                          size={25}
                          className="hover:text-orange-400"
                        />
                      </Link>

                      <Link href={`/categories/delete/${ele?._id}`}>
                        <MdDelete size={25} className="hover:text-red-400" />
                      </Link>
                    </div>
                  </div>

                  {idx !== allCategories?.length - 1 && (
                    <div className="h-[1px] bg-orange-200 mb-3"></div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Categories;
