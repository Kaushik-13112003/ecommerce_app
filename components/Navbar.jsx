// import { signOut } from "next-auth/react";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";

const Navbar = ({ show }) => {
  const pathName = usePathname();
  const { auth, setAuth } = useGlobalContext();

  const handleLogout = () => {
    setAuth({
      user: "",
      role: "",
      token: "",
    });
    localStorage.removeItem("ecom-auth");
    window.location.replace("/login");
  };

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }

  return (
    <>
      {auth?.user && auth?.role && auth.token && (
        <>
          <div
            className={`flex flex-col fixed h-screen z-10 ${
              show ? "-left-full " : "w-[100vw]"
            }  gap-4 p-4 bg-orange-50 navbar `}
          >
            <div>
              <Link
                href={"/"}
                className={`flex links  hover:bg-orange-100 w-[100%] p-2 rounded-lg items-center gap-2 
            ${pathName === "/" ? "active" : ""}
            `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                  />
                </svg>
                <p>Shop Admin </p>
              </Link>
            </div>

            {/* actions */}
            <div className={`flex flex-col gap-3 `}>
              <Link
                href={"/dashboard"}
                className={`flex items-center -mt-2 gap-2 links hover:bg-orange-100 p-2 rounded-lg   ${
                  pathName === "/dashboard" ? "active" : ""
                }
            `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <p>Dashboard </p>
              </Link>

              <Link
                href={"/categories"}
                className={`flex items-center gap-2 links hover:bg-orange-100 p-2 rounded-lg  ${
                  pathName?.includes("categories") ? "active" : ""
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>

                <p>Categories </p>
              </Link>

              <Link
                href={"/products"}
                className={`flex items-center gap-2 links hover:bg-orange-100 p-2 rounded-lg  ${
                  pathName?.includes("products") ? "active" : ""
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>

                <p>Products </p>
              </Link>

              <Link
                href={"/orders"}
                className={`flex items-center gap-2 links hover:bg-orange-100 p-2 rounded-lg   ${
                  pathName === "/orders" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>

                <p>Orders </p>
              </Link>

              <Link
                href={"/settings"}
                className={`flex items-center gap-2 links hover:bg-orange-100 p-2 rounded-lg   ${
                  pathName === "/settings" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>

                <p>Settings </p>
              </Link>

              <Link
                href={`/profile/${auth?.user}`}
                className={`flex items-center gap-2 links hover:bg-orange-100 p-2 rounded-lg   ${
                  pathName === "/profile" ? "active" : ""
                }`}
              >
                <CgProfile size={25} />

                <p>Profile</p>
              </Link>

              <button
                className={`flex items-center  -my-2 gap-2 links hover:bg-orange-100 p-2 rounded-lg `}
                onClick={handleLogout}
              >
                <MdLogout className="ml-1" />
                <p>Signout </p>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
