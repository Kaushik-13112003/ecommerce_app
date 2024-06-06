import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import Login from "./login";
import toast from "react-hot-toast";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [status, setStatus] = useState([
    "Pending",
    "Processing",
    "Shipped",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ]);
  const { auth } = useGlobalContext();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      let res = await fetch("/api/order", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);
      setAllOrders(dataFromResponse);
    } catch (err) {
      console.log(err);
    }
  };

  // handleStatusChange
  const handleStatusChange = (id, currentStatus) => {
    let updateStatusPromise = new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(`/api/order`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ id, status: currentStatus }),
        });

        if (res.ok) {
          resolve();
        } else {
          reject();
        }

        toast.promise(updateStatusPromise, {
          loading: "updating status...",
          success: "status updated",
          error: "something went wrong !!",
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }
  return (
    <>
      <Layout>
        <p className="text-center text-2xl mt-3">Manage Orders</p>

        <div className="text-center p-3">
          {allOrders?.length === 0 && (
            <>
              <p>No orders yet !!</p>
            </>
          )}
        </div>

        <div>
          {allOrders?.map((ele, idx) => {
            return (
              <div
                key={idx}
                className="bg-orange-100 rounded-md p-4 flex sm:flex-row flex-col gap-5 justify-around  m-6 items-center"
              >
                <div className=" flex flex-col gap-6">
                  <div>
                    <p className="font-mono font-bold">Order ID</p>
                    <p>{ele?._id}</p>
                  </div>

                  <div>
                    <p className="font-mono font-bold">Order Date</p>
                    <p>{new Date(ele?.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <h1 className="font-mono font-bold">Recipient</h1>
                    <p>{ele?.name}</p>
                    <p>{ele?.email}</p>
                    <p>
                      {ele?.address},{ele?.city} - {ele?.postalCode}
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-md p-5">
                  {" "}
                  {ele?.line_items?.map((line_ele, line_idx) => {
                    return (
                      <>
                        <div key={line_idx} className="mb-4">
                          <h1 className="font-mono font-bold ">Product</h1>
                          <p>
                            {line_ele?.price_data?.product_data?.name} x{" "}
                            <span className="text-orange-600">
                              {" "}
                              {line_ele?.quantity}
                            </span>
                          </p>
                          <p className="my-3">
                            {" "}
                            <p className="font-mono font-bold">
                              {" "}
                              {(line_ele?.price_data?.unit_amount / 100) *
                                line_ele?.quantity}{" "}
                              ₹
                            </p>
                          </p>
                          {line_idx !== ele?.line_items?.length - 1 && (
                            <div className="h-[1px] bg-orange-200 mb-3 mt-2"></div>
                          )}{" "}
                        </div>
                      </>
                    );
                  })}
                </div>

                <div className="cursor-pointer ">
                  <select
                    className="bg-orange-200 rounded-lg p-2 cursor-pointer "
                    defaultValue={ele?.status}
                    onChange={(e) =>
                      handleStatusChange(ele?._id, e.target.value)
                    }
                  >
                    {status?.map((status, status_id) => {
                      return (
                        <option key={status_id} value={status}>
                          {status}
                        </option>
                      );
                    })}
                  </select>{" "}
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    </>
  );
};

export default Orders;
