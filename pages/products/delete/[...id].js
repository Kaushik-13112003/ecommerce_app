import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeleteProduct = () => {
  const router = useRouter();
  const { auth } = useGlobalContext();

  const { id } = router.query;
  const [name, setName] = useState("");

  useEffect(() => {
    if (id) {
      getSingleProduct();
    }
  }, [id]);

  const goBack = useCallback(() => {
    router.push("/products");
  }, [router]);

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    try {
      let res = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("product deleted");
        goBack();
      } else {
        toast.error("something went wrong !!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get product
  const getSingleProduct = useCallback(async () => {
    try {
      let res = await fetch(`/api/products?id=${id}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      setName(dataFromResponse?.name);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }
  return (
    <>
      <Layout>
        <div className="flex flex-col gap-4 items-center bg-orange-100 p-5 rounded-lg">
          <h2>Do you want to delete product : {name}</h2>

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

export default DeleteProduct;
