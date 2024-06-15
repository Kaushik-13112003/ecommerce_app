"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoPizzaOutline } from "react-icons/io5";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/userContext";

const Login = () => {
  const { setAuth } = useGlobalContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [goHome, setGoHome] = useState(false);

  const handleChange = async (event) => {
    event.preventDefault();

    if (email === "" || password === "" || role === "") {
      toast.error("complete the fields");
      return;
    }

    try {
      setGoHome(false);
      let loginPromise = new Promise(async (resolve, reject) => {
        const res = await fetch(`/api/login`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
            role,
          }),
        });

        let dataFromResponse = await res.json();

        if (res.ok) {
          resolve();
          setGoHome(true);
          setAuth({
            token: dataFromResponse?.token,
            user: dataFromResponse?.loginData,
            role: dataFromResponse?.role,
          });
          localStorage.setItem("ecom-auth", JSON.stringify(dataFromResponse));
        } else {
          reject();
          setGoHome(false);
          setError(dataFromResponse?.msg);
        }
      });

      toast.promise(loginPromise, {
        loading: "signing in & verifying...",
        success: "login successfully !!",
        error: error || "wrong credentials",
      });
    } catch (err) {
      console.log(err);
      setGoHome(false);
    }
  };

  if (goHome) {
    router.push("/");
  }

  return (
    <>
      <div className=" bg-orange-50 p-3">
        <h1 className="text-primary text-2xl text-center p-5">Login</h1>

        <div className="flex    items-center justify-center p-7">
          <form
            className="md:w-[50%] bg-orange-100 rounded-md p-5 sm:w-[70%] w-[90%] flex gap-6 flex-col"
            onSubmit={handleChange}
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
            <div className="flex flex-col gap-3 p-2  mb-5">
              <label htmlFor=" password">Password</label>
              <input
                type="password"
                name="password"
                placeholder=" xyz"
                className="bg-orange-200 rounded-lg p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="bg-orange-200 p-2 mb-5 w-[100%]  rounded-md hover:bg-orange-50">
              Login
            </button>
          </form>
        </div>

        <p className="text-center p-5">
          Forgot Password ?{" "}
          <Link
            href={"/forgot-password"}
            className="hover:underline hover: animate-pulse text-primary"
          >
            Reset Now
          </Link>
        </p>
        <p className="text-center p-5">
          Do not have an account ?{" "}
          <Link
            href={"/register"}
            className="hover:underline hover: animate-pulse text-primary"
          >
            Register
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
