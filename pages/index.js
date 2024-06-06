import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import Link from "next/link";
import React from "react";
import Login from "./login";
// import toast, { Toaster } from "react-hot-toast";

const Index = () => {
  const { auth } = useGlobalContext();

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }

  
  return (
    <>
      <Layout>
        <div className="flex justify-center flex-col gap-2 items-center h-screen">
          <h1 className="text-orange-500 sm:text-4xl text-2xl">
            Welcome to Admin Panel
          </h1>
          <p> Manage your Shop here</p>

          <Link
            href="/dashboard"
            className={`flex items-center gap-2 mt-2 links hover:bg-orange-50 bg-orange-100 p-2 rounded-lg   `}
          >
            Go to dashboard
          </Link>
        </div>
      </Layout>
    </>
  );
};

export default Index;
