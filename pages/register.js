import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
// import { toast } from "react-toastify";
import { IoPizzaOutline } from "react-icons/io5";
import { signIn } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const Register = () => {
  // const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);

  const handleChange = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !email ||
      !city ||
      !password ||
      !state ||
      !country ||
      !address ||
      !postalCode ||
      images?.length === 0 ||
      !role
    ) {
      toast.error("complete the fields");
      return;
    }

    let registerPromise = new Promise(async (resolve, reject) => {
      try {
        setRegistered(false);
        const res = await fetch(`/api/register`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            role,
            image: images != [] ? images : "",
            city,
            postalCode,
            address,
            state,
            country,
          }),
        });

        const dataFromResponse = await res.json();

        if (res.ok) {
          resolve();
          setRegistered(true);
          window.location.href = "/login";
          // toast.success(dataFromResponse?.msg);
        } else {
          reject();
          setRegistered(false);
          setError(dataFromResponse?.msg);
        }
        // setPassword("");

        toast.promise(registerPromise, {
          loading: `registering...`,
          success: "user registered",
          error: error || "something went wrong",
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  // handleImageUpload

  const handleImageUpload = (event) => {
    let files = event.target.files;
    console.log(files);

    if (files?.length <= 0) {
      toast.error("upload profile picture");
      return;
    }

    if (files) {
      let data = new FormData();

      if (files.length === 1) {
        data.set("file", files[0]);

        try {
          let uploadImagePromise = new Promise(async (resolve, reject) => {
            let res = await fetch("/api/upload", {
              method: "POST",

              body: data,
            });

            let dataFromResponse = await res.json();
            if (res.ok) {
              resolve();
              console.log(dataFromResponse);
              setImages(dataFromResponse?.links[0]);
            } else {
              reject();
            }
          });

          toast.promise(uploadImagePromise, {
            loading: "uploading image...",
            success: "image uploaded !!",
            error: "somethong went wrong",
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  // console.log(role);
  return (
    <>
      <div className=" bg-orange-50 p-3">
        <h1 className="text-primary text-2xl text-center p-5">Register</h1>

        {/* {!isRegistered && error && (
          <>
            <p className="text-center text-red-400 ">{"complete field"}</p>
          </>
        )} */}

        <div className="flex  items-center justify-center p-7">
          <form
            action=""
            className="bg-orange-100 rounded-md p-5 md:w-[50%] sm:w-[70%] w-[90%] flex gap-10 flex-col"
            onSubmit={handleChange}
          >
            <label className=" cursor-pointer rounded-md  relative -bottom-6 flex gap-2 bg-orange-200 hover:bg-orange-50 p-3 items-center justify-center">
              Upload Photo <CgProfile size={30} />
              <input
                type="file"
                hidden
                onChange={handleImageUpload}
                className="border p-3 rounded-md focus:bg-orange-100"
              />
            </label>
            {images?.length > 0 && (
              <>
                <div className="flex items-center justify-center">
                  <div className=" relative md:h-[170px]  sm:w-[130px] w-[100px]">
                    <img
                      src={images}
                      className=" cursor-pointer rounded-lg w-[100%] h-[100%]"
                    ></img>
                    <button
                      className="absolute right-0 bottom-0"
                      type="button"
                      onClick={() => setImages([])}
                    >
                      {" "}
                      <FaTrash className=" text-red-600 hover:text-red-400" />
                    </button>
                  </div>{" "}
                </div>
              </>
            )}
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" name">Name</label>
              <input
                type="text"
                name="name"
                placeholder=" john"
                className="bg-orange-200 rounded-lg p-2"
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
                className="bg-orange-200 rounded-lg p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" password">Password</label>
              <input
                type="text"
                name="password"
                placeholder="xyz"
                className="bg-orange-200 rounded-lg p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 p-2 cursor-pointer">
              <label htmlFor=" select role">Select role</label>

              <select
                className="bg-orange-200 rounded-lg p-2 cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select </option>

                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" address">Address</label>
              <input
                type="text"
                name="address"
                placeholder=" b-32,ramnagar"
                className="bg-orange-200 rounded-lg p-2"
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
                  className="bg-orange-200 rounded-lg p-2 w-[100%]"
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
                  className="bg-orange-200 rounded-lg p-2 w-[100%]"
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
                  className="bg-orange-200 rounded-lg p-2 w-[100%]"
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
                  className="bg-orange-200 rounded-lg p-2 w-[100%]"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            <button className="bg-orange-200 p-2 w-[100%] mb-5  rounded-md hover:bg-orange-50">
              Register
            </button>{" "}
          </form>
        </div>

        <p className="text-center p-5">
          Already have an account ?{" "}
          <Link
            href={"/login"}
            className="hover:underline hover: animate-pulse text-primary"
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
