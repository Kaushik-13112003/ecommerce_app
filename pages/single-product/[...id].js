import { CartContext } from "@/context/cartContext";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import productModel from "@/model/productModel";
import reviewModel from "@/model/reviewModel";

const SingleProduct = ({ singleProduct, initialReviews, defaultAvgValue }) => {
  const { addToCart } = useContext(CartContext);

  const [isActive, setisActive] = useState(singleProduct?.images[0]);
  const [avgReviews, setAvgReviews] = useState(defaultAvgValue);

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [allReviews, setAllReviews] = useState(initialReviews);
  const [error, setError] = useState(false);

  const [show, setShow] = useState(false);

  //handles how more reviews
  const handleShowMoreReviews = () => {
    setShow((prev) => !prev);
  };

  const handleAddReview = async (event) => {
    event.preventDefault();
    setError(false);

    if (message === "" || rating <= 0) {
      toast.error("complete review fields");
      return;
    }

    try {
      let res = await fetch("/api/reviews", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          rating,
          message,
          productId: singleProduct?._id,
        }),
      });

      let dataFromResponse = await res.json();
      if (res.ok) {
        // console.log(dataFromResponse);
        setAllReviews((prev) => [...prev, dataFromResponse]);
        let newAvgReviews =
          [...allReviews, dataFromResponse].reduce(
            (acc, ele) => acc + ele.rating,
            0
          ) / [...allReviews, dataFromResponse].length;
        setAvgReviews(newAvgReviews);

        // Reset rating and message
        setRating(0);
        setMessage("");
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-blue-50 m-8 flex-wrap rounded-md p-5 flex justify-evenly sm:flex-row flex-col my-6 ">
        <div className="flex flex-col items-center gap-3 ">
          <div className="shadow p-3 sm:w-[300px] w-[100%]">
            <img
              src={isActive}
              alt={singleProduct?.name}
              className="object-cover w-[100%]"
            />
          </div>

          <div>
            {singleProduct?.images?.length > 1 && (
              <>
                <div className="flex gap-4 flex-wrap  items-center">
                  {singleProduct?.images?.map((image, idx) => {
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
          <p className="sm:text-4xl text-3xl font-mono font-bold">
            {singleProduct?.name}
          </p>
          <p>{singleProduct?.des}</p>
          <p>₹{singleProduct?.price}</p>
          <ReactStars
            value={avgReviews}
            size={30}
            edit={false}
            activeColor="#ffd700"
          />{" "}
          <Link href={`/single-product-buy/${singleProduct?._id}`}>
            <button className="bg-blue-200 p-2 w-[100%]  rounded-md hover:bg-blue-100">
              Buy now
            </button>
          </Link>
          <button
            onClick={() => addToCart(singleProduct)}
            className="bg-blue-200 p-2 w rounded-md hover:bg-blue-100  w-[100%]"
          >
            Add to cart
          </button>{" "}
        </div>
      </div>
      <div className="bg-blue-50 m-8 rounded-md p-5  my-6 ">
        <h2 className="text-2xl font-bold mb-4">Add Review</h2>

        <div>
          <ReactStars
            size={30}
            activeColor="#ffd700"
            count={5}
            value={rating}
            onChange={setRating}
          ></ReactStars>
        </div>

        <textarea
          className="w-full mt-2 p-2 border rounded-md mb-4"
          placeholder="Write your review..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleAddReview}
          className="  bg-orange-200 hover:bg-blue-100 p-2 rounded-lg"
        >
          Add Review
        </button>
      </div>{" "}
      <div className="bg-blue-100 m-8 rounded-md p-5  my-6 ">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">All Reviews</h2>{" "}
          {show ? (
            <button
              className="hover:bg-blue-200 rounded-2xl p-2"
              onClick={() => handleShowMoreReviews()}
            >
              <IoIosArrowDown />
            </button>
          ) : (
            <button
              className="hover:bg-blue-200 rounded-2xl p-2"
              onClick={() => handleShowMoreReviews()}
            >
              <IoIosArrowUp />
            </button>
          )}
        </div>
        {allReviews?.length === 0 && <p>Be the first to add review !!</p>}
        {show &&
          allReviews?.map((ele, idx) => {
            return (
              <>
                <div
                  key={idx}
                  className="bg-blue-50 mt-5 scroll-smooth rounded-md p-5"
                >
                  <ReactStars
                    value={ele?.rating}
                    count={ele?.rating}
                    edit={false}
                  ></ReactStars>
                  <p>{ele?.message}</p>
                </div>
              </>
            );
          })}
      </div>{" "}
    </>
  );
};

export default SingleProduct;

export async function getServerSideProps(context) {
  const { id } = context.query;

  await connectDB();

  try {
    const singleProduct = await productModel.findById(id).lean();
    const reviews = await reviewModel
      .find({ productId: id })
      .sort({ createdAt: -1 })
      .lean();

    let defaultAvgValue =
      reviews?.reduce((acc, ele) => {
        return (acc += ele?.rating);
      }, 0) / reviews?.length;

    return {
      props: {
        singleProduct: JSON.parse(JSON.stringify(singleProduct)),
        initialReviews: JSON.parse(JSON.stringify(reviews)),
        defaultAvgValue: defaultAvgValue,
      },
    };
  } catch (err) {
    console.log(err);
    return { props: { singleProduct: null, initialReviews: [] } };
  }
}
