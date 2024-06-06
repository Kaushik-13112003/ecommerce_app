import React, { useEffect, useState } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
// import { FaHamburger } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { useGlobalContext } from "@/context/userContext";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  // const { data: session } = useSession();
  const router = useRouter();
  const { auth } = useGlobalContext();

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    if (typeof window != undefined) {
      if (!auth?.user || !auth?.role || !auth?.token) {
        // router.push("/login");
        window.location.replace("/login");
        // return <Login />;
      }
    }
  }, []);

  return (
    <>
      <>
        <div className="p-2 ">
          {!show ? (
            <MdClose
              size={30}
              onClick={() => handleShow()}
              className="cursor-pointer hover:text-orange-500"
            />
          ) : (
            <GiHamburgerMenu
              size={30}
              onClick={() => handleShow()}
              className="cursor-pointer hover:text-orange-500"
            />
          )}
        </div>
        <main className=" flex md:flex-row  gap-4">
          <Navbar show={show} setShow={setShow} />

          <div className=" flex-grow p-3 bg-orange-200 h-[100vh] overflow-auto">
            <div>{children}</div>
          </div>
        </main>
      </>
    </>
  );
};

export default Layout;
