import Link from "next/link";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="bg-orange-200 h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <p>Token expired !!</p>
        <Link
          href={"/forgot-password"}
          className="hover:underline hover: animate-pulse text-primary"
        >
          {" "}
          Try Again{" "}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
