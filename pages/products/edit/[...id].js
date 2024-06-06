import Layout from "@/components/Layout";
import fecthCategories from "@/components/FecthCategories";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { MdOutlineUpload } from "react-icons/md";
import { ReactSortable } from "react-sortablejs";

const EditProduct = () => {
  const { auth } = useGlobalContext();

  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const [category, setCategory] = useState("");
  const [goToProduct, setGoToProduct] = useState(false);
  const [properties, setProperties] = useState([]);

  const router = useRouter();
  const { id } = router.query;
  // console.log(id);

  useEffect(() => {
    if (id) {
      getSingleProduct();
    }
  }, [id]);

  useEffect(() => {
    if (goToProduct) {
      router.push("/products");
    }
  }, [goToProduct]);

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
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  // console.log(category);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id) {
      return;
    }
    const updatedProperties = properties.map((p) => ({
      name: p?.name,
      values: p?.values.split(","),
    }));

    try {
      setGoToProduct(false);

      if (!name || !price || !des || !images?.length || !category) {
        toast.error("complete the fields !!");
        return;
      }

      const createProductCategory = new Promise(async (resolve, reject) => {
        const res = await fetch(`/api/products`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            des,
            price,
            id,
            images,
            category,
            properties: updatedProperties || [],
          }),
        });
        if (res.ok) {
          resolve();
          setGoToProduct(true);
        } else {
          reject();
        }
      });

      toast.promise(createProductCategory, {
        loading: "updating product...",
        success: "product updated",
        error: "something went wrong !!",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // handleImageUpload
  const handleImageUpload = async (event) => {
    let files = event.target?.files;
    // console.log(files);

    if (files?.length > 0) {
      let data = new FormData();

      for (let file of files) {
        data.append("file", file);
      }

      let imageUploadPromise = new Promise(async (resolve, reject) => {
        let res = await fetch("/api/upload", {
          method: "POST",

          body: data,
        });

        // console.log(res);
        let dataFromResponse = await res.json();

        if (res.ok) {
          resolve();
          setImages((prev) => {
            return [...prev, ...dataFromResponse?.links];
          });
          console.log(dataFromResponse?.links);
        } else {
          reject();
        }
      });

      toast.promise(imageUploadPromise, {
        loading: "uploading image...",
        success: "image uploaded",
        error: "something went wrong",
      });
    }

    // let dataFromResponse = await res.json();
  };

  const handleDragImage = (images) => {
    // console.log(arguments);
    setImages(images);
  };

  let allCategories = fecthCategories();
  // console.log(allCategories);

  //add properties
  const addProperties = (event) => {
    event.preventDefault();

    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };

  // handleAddProperties
  const handleAddedPropertiesNames = async (
    index,
    property,
    proprtyCurrentName
  ) => {
    setProperties((prev) => {
      let properties = [...prev];
      properties[index].name = proprtyCurrentName;
      return properties;
    });
  };

  //for values
  const handleAddedPropertiesValues = async (
    index,
    property,
    proprtyCurrentValue
  ) => {
    setProperties((prev) => {
      let properties = [...prev];
      properties[index].values = proprtyCurrentValue;
      return properties;
    });
  };

  // removeProperties
  const removeProperties = (idx) => {
    let filterPropeties = properties.filter((ele, id) => {
      return id !== idx;
    });
    setProperties(filterPropeties);
  };

  // handleRemoveImage
  const handleRemoveImage = (id) => {
    let filterImages = images?.filter((ele, idx) => {
      return idx !== id;
    });
    setImages(filterImages);
  };

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }

  return (
    <>
      <Layout>
        {" "}
        <div className="bg-orange-50 p-6 rounded-lg m-6">
          <form
            action=""
            className="flex flex-col  gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor="product name">Product Name</label>
              <input
                type="text"
                placeholder="product name"
                className="bg-orange-200 rounded-lg p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 p-2 mb-3">
              <label htmlFor="category name">Select Category </label>
              <select
                className="bg-orange-200 rounded-lg p-2 cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {allCategories?.allCategories?.map((ele, idx) => {
                  return (
                    <option
                      value={ele?._id}
                      key={idx}
                      className="cursor-pointer"
                    >
                      {ele?.category}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="p-2">
              <div>
                <label className="flex gap-2 justify-center bg-orange-200 hover:bg-orange-100 rounded-lg p-4 items-center w-34 h-34 cursor-pointer">
                  Upload Photo <MdOutlineUpload size={30} />
                  <input
                    type="file"
                    hidden
                    onChange={handleImageUpload}
                    multiple
                  />
                </label>
              </div>

              <div className="flex  my-5 gap-3 flex-wrap">
                {images?.length > 0 && (
                  <>
                    <ReactSortable
                      className="flex  my-5 gap-3 flex-wrap"
                      list={images}
                      setList={handleDragImage}
                    >
                      {images?.map((ele, idx) => {
                        return (
                          <div
                            key={idx}
                            className="sm:h-[150px] sm:w-[150px] relative "
                          >
                            <img
                              src={ele}
                              className="rounded-lg w-[100%] h-[100%] cursor-pointer"
                            ></img>
                            <button
                              className="absolute right-0 bottom-0"
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                            >
                              {" "}
                              <FaTrash className=" text-red-600 hover:text-red-400" />
                            </button>
                          </div>
                        );
                      })}
                    </ReactSortable>
                  </>
                )}
              </div>
              {images?.length === 0 && (
                <div className="text-orange-400 mt-2 mb-3">
                  photos not avaliable
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor="product description">Product description</label>

              <textarea
                className="bg-orange-200 rounded-lg p-2 h-[100px]"
                placeholder="product description"
                value={des}
                onChange={(e) => setDes(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor="product price">Product price(₹)</label>

              <input
                type="number"
                placeholder="price"
                className="bg-orange-200 rounded-lg p-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="flex p-2 my-5">
              <button
                onClick={addProperties}
                className="flex items-center gap-2  bg-orange-200 hover:bg-orange-100 p-2 rounded-lg  
            "
              >
                Add product properties
              </button>
            </div>

            {properties?.length > 0 && (
              <>
                {properties?.map((ele, idx) => {
                  return (
                    <>
                      <div className="flex bg-orange-100 rounded-lg p-3 sm:items-center flex-wrap sm:flex-row flex-col gap-2">
                        <div
                          className="flex sm:flex-row flex-col gap-4 "
                          key={idx}
                        >
                          <div className="flex flex-col gap-3 p-2 ">
                            <label htmlFor="property name">Property name</label>

                            <input
                              type="text"
                              placeholder="ex:color"
                              className="bg-orange-200 rounded-lg p-2"
                              value={ele?.name}
                              onChange={(e) =>
                                handleAddedPropertiesNames(
                                  idx,
                                  ele,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-3 p-2 ">
                            <label htmlFor="property value">
                              Property value
                            </label>

                            <input
                              type="text"
                              placeholder="ex:red"
                              className="bg-orange-200 rounded-lg p-2"
                              value={ele?.values}
                              onChange={(e) =>
                                handleAddedPropertiesValues(
                                  idx,
                                  ele,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 p-2 ">
                          <label htmlFor=""></label>
                          <button
                            type="button"
                            onClick={() => removeProperties(idx)}
                            className=" bg-orange-500 hover:bg-orange-400 p-2 rounded-lg"
                          >
                            Remove
                          </button>{" "}
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}

            <div className="flex items-center justify-center text-center">
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

export default EditProduct;
