import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { MdOutlineUpload } from "react-icons/md";
import { ReactSortable } from "react-sortablejs";
import Login from "../login";

const NeProduct = () => {
  const { auth } = useGlobalContext();

  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [goToProduct, setGoToProduct] = useState(false);
  const [allCategories, setallCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, [category]);

  //create
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setGoToProduct(false);

      if (!name || !price || !des || images == "" || !category) {
        toast.error("complete the fields !!");
        return;
      }
      properties: properties.map((p) => ({
        name: p?.name,
        values: p?.values.split(","),
      }));

      const createProductCategory = new Promise(async (resolve, reject) => {
        const res = await fetch("/api/products", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            des,
            price,
            images,
            category,
            properties: properties || [],
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
        loading: "creating product...",
        success: "product created",
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

        console.log(res);
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

  // handleSort
  const handleSort = (images) => {
    setImages(images);
  };

  if (goToProduct) {
    // window.location.href = '/products'
    router.push("/products");
  }

  //get categories
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
        <div className="bg-orange-50 p-6 rounded-lg m-6">
          <h1 className="text-center text-2xl mb-3 text-orange-300">
            Creating product...
          </h1>
          <form
            action=""
            className="flex flex-col  gap-4"
            // onSubmit={handleSubmit}
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

            <div className="flex flex-col gap-3 p-2  mb-3">
              <label htmlFor="category name">Select Category </label>
              <select
                className="bg-orange-200 rounded-lg p-2 cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">
                  {" "}
                  {allCategories?.length === 0 ? (
                    <p>No categories found</p>
                  ) : (
                    "Choose one"
                  )}
                </option>

                {allCategories?.map((ele, idx) => {
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

              <div>
                {images?.length > 0 && (
                  <>
                    <ReactSortable
                      className="flex  my-5 gap-3 flex-wrap"
                      list={images}
                      setList={handleSort}
                    >
                      {images?.map((ele, idx) => {
                        return (
                          <div key={idx} className="sm:h-[150px] sm:w-[150px] ">
                            <img
                              src={ele}
                              className=" cursor-pointer rounded-lg w-[100%] h-[100%]"
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

            <div className="flex items-center my-5 justify-center text-center">
              <button
                onClick={handleSubmit}
                className=" w-[100px]   bg-orange-200 hover:bg-orange-100 p-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default NeProduct;
