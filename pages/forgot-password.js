"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoPizzaOutline } from "react-icons/io5";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/userContext";

const Forgot_Password = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [goHome, setGoHome] = useState(false);

  //reset password link
  const resetPasswordLink = async (event) => {
    event.preventDefault();

    try {
      let res = await fetch("/api/forgot-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, role }),
      });

      let dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(
          "password reset link sent to your email !! check your email"
        );
      } else {
        toast.error(dataFromResponse?.msg);
      }

      setEmail("");
      setRole("");
    } catch (err) {
      console.log(err);
    }
  };

  if (goHome) {
    router.push("/login");
  }

  return (
    <>
      <div className=" bg-orange-200 p-3 h-screen">
        <h1 className="text-primary text-2xl text-center p-5">
          Forgot Password
        </h1>
        <div className="flex   rounded-md  items-center flex-col justify-center p-7">
          <>
            {" "}
            <p className="text-center p-5">
              <Link
                href={"/login"}
                className="mr-2 hover:underline hover: animate-pulse text-orange-600"
              >
                Login
              </Link>
              <span> or </span>
            </p>
            <form
              className="md:w-[50%] bg-orange-50 p-5 rounded-md  sm:w-[70%] w-[90%] flex gap-6 flex-col"
              onSubmit={resetPasswordLink}
            >
              <div className="flex flex-col gap-3 p-2 cursor-pointer ">
                <label htmlFor=" select role">Select role</label>

                <select
                  className="bg-orange-200 rounded-lg p-2 cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select</option>

                  <option value="Admin">Admin</option>
                </select>
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

              <button className="bg-orange-200 p-2 w-[100%]  rounded-md hover:bg-orange-100">
                Continue
              </button>
            </form>
          </>
        </div>
      </div>
    </>
  );
};

export default Forgot_Password;
