"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/userContext";

const ResetPassword = () => {
  const router = useRouter();
  let { id } = router.query;
  let { token } = router.query;
  // console.log(id, token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [goHome, setGoHome] = useState(false);
  const [goError, setGoError] = useState(false);

  useEffect(() => {
    if (goError) {
      router.push("/not-found");
    }
  }, [goError]);

  //   reset password
  const resetPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("password not matched");
      return;
    }

    try {
      let res = await fetch("/api/forgot-password", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ password, confirmPassword, id, token }),
      });
      let dataFromResponse = await res.json();

      if (dataFromResponse?.expire) {
        setGoError(true);
        return;
      }
      if (res.ok) {
        toast.success("password reset successfully");
        setGoHome(true);
      } else {
        toast.error(dataFromResponse?.msg);
      }
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
          Reset Password
        </h1>
        <div className="flex   rounded-md  items-center flex-col justify-center p-7">
          <>
            <form
              className="md:w-[50%] p-5 rounded-md bg-orange-50 sm:w-[70%] w-[90%] flex gap-6 flex-col"
              onSubmit={resetPassword}
            >
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
              <div className="flex flex-col gap-3 p-2 ">
                <label htmlFor="confirm password">Confirm Password</label>
                <input
                  type="text"
                  name="confirm password"
                  placeholder="xyz"
                  className="bg-orange-200 rounded-lg p-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
