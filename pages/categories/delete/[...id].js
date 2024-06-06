import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import toast from "react-hot-toast";

const DeleteCategory = () => {
  const { auth } = useGlobalContext();
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (id) {
      getSingleProduct();
    }
  }, [id]);

  const goBack = () => {
    router.push("/categories");
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    try {
      let res = await fetch(`/api/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("category deleted");
        goBack();
      } else {
        toast.error("something went wrong !!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getSingleProduct = async () => {
    try {
      let res = await fetch(`/api/categories?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      setCategory(dataFromResponse?.category);
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
        <div className="flex flex-col gap-4 items-center bg-orange-100 p-5 rounded-lg">
          <h2>Do you want to delete category : {category}</h2>

          <div className="flex gap-5">
            <button
              onClick={handleDelete}
              className="bg-orange-200 hover:bg-orange-50 p-3 rounded-md"
            >
              Yes
            </button>
            <button
              onClick={goBack}
              className="bg-orange-200 hover:bg-orange-50 p-3 rounded-md"
            >
              No
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DeleteCategory;
