import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditCategories = () => {
  const router = useRouter();
  const { auth } = useGlobalContext();

  const { id } = router.query;
  const [category, setCategory] = useState("");
  const [goToCategory, setGoToCategory] = useState(false);

  const [allCategories, setallCategories] = useState([]);

  useEffect(() => {
    if (id) {
      getSingleCategory();
      getCategories();
    }
  }, [id]);

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
      setParenetCategory(dataFromResponse?.parentCategory?.category || "");
    } catch (err) {
      console.log(err);
    }
  };

  //   console.log(id);
  //get singe category
  const getSingleCategory = async () => {
    try {
      let res = await fetch(`/api/categories?id=${id}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();

      // console.log(dataFromResponse);
      setCategory(dataFromResponse?.category);
    } catch (err) {
      console.log(err);
    }
  };

  //update
  const updateCategory = async (event) => {
    event.preventDefault();
    setGoToCategory(false);

    if (!id) {
      return;
    }

    if (!category) {
      toast.error("add category value !!");
      return;
    }

    try {
      let createUpdatePromise = new Promise(async (resolve, reject) => {
        let res = await fetch("/api/categories", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            category,
          }),
        });

        if (res.ok) {
          resolve();
          setGoToCategory(true);
        } else {
          reject();
          setGoToCategory(false);
        }
      });

      toast.promise(createUpdatePromise, {
        loading: "updating category...",
        success: "category updated",
        error: "something went wrong !!",
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (goToCategory) {
    router.push("/categories");
  }

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }
  return (
    <>
      <Layout>
        <div className="bg-orange-50 p-6 rounded-lg m-6">
          <form
            action=""
            className="flex flex-col  gap-4"
            onSubmit={updateCategory}
          >
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor="product name">Category Name</label>
              <input
                type="text"
                placeholder="product name"
                className="bg-orange-200 rounded-lg p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="flex  my-5 items-center justify-center text-center">
              <button className=" w-[100px]   bg-orange-200 hover:bg-orange-100 p-2 rounded-lg">
                Update
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default EditCategories;
