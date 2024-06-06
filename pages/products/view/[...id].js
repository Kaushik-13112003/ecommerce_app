import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const ViewProduct = () => {
  const { auth } = useGlobalContext();

  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const [category, setCategory] = useState("");
  const [goToProduct, setGoToProduct] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isActive, setisActive] = useState("");

  const router = useRouter();
  const { id } = router.query;
  // console.log(id);

  useEffect(() => {
    if (id) {
      getSingleProduct();
    }
  }, [id]);

  const getSingleProduct = useCallback(async () => {
    try {
      let res = await fetch(`/api/products?id=${id}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      //   console.log(dataFromResponse);
      setName(dataFromResponse?.name);
      setPrice(dataFromResponse?.price);
      setDes(dataFromResponse?.des);
      setImages(dataFromResponse?.images);
      setCategory(dataFromResponse?.category);
      setProperties(dataFromResponse?.properties);
      setisActive(dataFromResponse?.images[0]);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  if (goToProduct) {
    router.push("/products");
  }

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }

  return (
    <>
      <Layout>
        <div className="bg-orange-50 m-8 flex-wrap rounded-md p-5 flex justify-evenly sm:flex-row flex-col my-6 ">
          <div className="flex flex-col items-center gap-3 ">
            <div className="shadow p-3 sm:w-[300px] w-[100%]">
              <img
                src={isActive}
                alt={name}
                className="object-cover w-[100%]"
              />
            </div>

            <div>
              {images?.length > 1 && (
                <>
                  <div className="flex gap-4 flex-wrap  items-center">
                    {images?.map((image, idx) => {
                      return (
                        <div
                          className="shadow rounded-md p-2  w-[70px]"
                          key={idx}
                        >
                          <img
                            src={image}
                            alt=""
                            onClick={() => setisActive(image)}
                            className="w-[100%] hover:animate-pulse  cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 my-7">
            <p className="sm:text-4xl text-3xl font-mono font-bold">{name}</p>
            <p>{des}</p>
            <p>₹{price}</p>

            <Link href={`/products/edit/${id}`}>
              <button className="bg-orange-200 p-2 w-[100%]  rounded-md hover:bg-orange-100">
                Edit
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ViewProduct;
