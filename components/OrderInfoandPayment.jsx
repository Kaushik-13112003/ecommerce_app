import { CartContext } from "@/context/cartContext";
import axios from "axios";
import React, { useContext, useState } from "react";

const OrderInfoandPayment = ({ cartData }) => {
  // console.log(cartData);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");

  const { cart } = useContext(CartContext);

  //   handlePayment
  const handlePayment = async (event) => {
    event.preventDefault();

    try {
      let res = await axios.post("/api/checkout", {
        products: cartData[0].quantity ? { singleProduct: cartData } : cartData,
        city,
        postalCode,
        country,
        state,
        name,
        email,
        address,
      });

      if (res.data?.url) {
        window.location = res?.data?.url;
      } else {
        toast.error("something went wrong !!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-blue-50 p-6 rounded-lg m-6 h-[100%] ">
        <h1 className=" p-4 text-2xl">Order information</h1>
        <form
          // method="POST"
          // action="/api/checkout"
          className="flex flex-col  gap-4"
          // onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-3 p-2 ">
            <label htmlFor=" name">Name</label>
            <input
              type="text"
              name="name"
              placeholder=" john"
              className="bg-blue-200 rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 p-2 ">
            <label htmlFor=" email">E-Mail</label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              className="bg-blue-200 rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 p-2 ">
            <label htmlFor=" address">Address</label>
            <input
              type="text"
              name="address"
              placeholder=" b-32,ramnagar"
              className="bg-blue-200 rounded-lg p-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex justify-between  items-center">
            <div className="flex flex-col gap-3 p-2 w-[100%]">
              <label htmlFor=" city">City</label>
              <input
                type="text"
                name="city"
                placeholder=" surat"
                className="bg-blue-200 rounded-lg p-2 w-[100%]"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 p-2 w-[100%]">
              <label htmlFor=" postal code">Postal Code</label>
              <input
                type="number"
                name="postalCode"
                placeholder=" 352812"
                className="bg-blue-200 rounded-lg p-2 w-[100%]"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between  items-center">
            <div className="flex flex-col gap-3 p-2 w-[100%] ">
              <label htmlFor=" state">State</label>
              <input
                type="text"
                name="state"
                placeholder=" gujrat"
                className="bg-blue-200 rounded-lg p-2 w-[100%]"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 p-2 w-[100%]">
              <label htmlFor=" country">Country</label>
              <input
                type="text"
                name="country"
                placeholder="india"
                className="bg-blue-200 rounded-lg p-2 w-[100%]"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {/* <input
            type="text"
            hidden
            name="products"
            placeholder=" john"
            className="bg-blue-200 rounded-lg p-2"
            value={cart?.join(",")}
          /> */}

          <div className="flex items-center my-4 justify-center text-center">
            <button
              onClick={handlePayment}
              type="submit"
              className=" w-[100%]   bg-orange-200 hover:bg-blue-100 p-2 rounded-lg"
            >
              Pay now
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrderInfoandPayment;
