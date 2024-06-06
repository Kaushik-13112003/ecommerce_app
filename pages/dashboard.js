import Layout from "@/components/Layout";
import { useGlobalContext } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import Login from "./login";

const Dashboard = () => {
  const { auth } = useGlobalContext();
  const [allOrders, setAllOrders] = useState([]);

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
      setAllOrders(dataFromResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotalRevenue = (orders) => {
    return orders?.reduce((acc, order) => {
      return (
        acc +
        order?.line_items.reduce((sum, item) => {
          return sum + item?.quantity * item?.price_data?.unit_amount;
        }, 0)
      );
    }, 0);
  };

  const filterOrders = (orders, startDate, endDate) => {
    return orders.filter((order) => {
      let orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const getDateRanges = () => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - today.getDay() - 6);
    startOfLastWeek.setHours(0, 0, 0, 0);

    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    return {
      startOfToday,
      endOfToday,
      startOfLastWeek,
      endOfLastWeek,
      startOfLastMonth,
      endOfLastMonth,
    };
  };

  const {
    startOfToday,
    endOfToday,
    startOfLastWeek,
    endOfLastWeek,
    startOfLastMonth,
    endOfLastMonth,
  } = getDateRanges();

  const todaysOrders = filterOrders(allOrders, startOfToday, endOfToday);
  const todaysRevenue = calculateTotalRevenue(todaysOrders);

  const lastWeekOrders = filterOrders(
    allOrders,
    startOfLastWeek,
    endOfLastWeek
  );
  const lastWeekRevenue = calculateTotalRevenue(lastWeekOrders);

  const lastMonthOrders = filterOrders(
    allOrders,
    startOfLastMonth,
    endOfLastMonth
  );
  const lastMonthRevenue = calculateTotalRevenue(lastMonthOrders);

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }

  return (
    <Layout>
      <div>
        <div className="text-center p-3">
          {allOrders?.length === 0 && <p>No orders yet !!</p>}
        </div>

        <div className="flex flex-col gap-5 bg-orange-200 p-5 rounded-md">
          {allOrders?.length > 0 && (
            <>
              <p className="text-center text-2xl mt-3">Orders &amp; Revenue</p>

              <div className="flex justify-center sm:flex-row flex-col flex-wrap gap-5 items-center bg-orange-300 p-5 rounded-md">
                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Total Orders</p>
                  <p>{allOrders?.length}</p>
                </div>

                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Today&apos;s Orders</p>
                  <p>{todaysOrders?.length}</p>
                </div>

                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Last Week Orders</p>
                  <p>{lastWeekOrders?.length}</p>
                </div>

                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Last Month Orders</p>
                  <p>{lastMonthOrders?.length}</p>
                </div>
              </div>

              <div className="flex justify-center sm:flex-row flex-col gap-5 items-center bg-orange-300 p-5 rounded-md">
                <div className="flex flex-col w-[200px] gap-3 items-center bg-orange-100 rounded-md p-3">
                  <p>Total Revenue</p>
                  <p>₹{calculateTotalRevenue(allOrders) / 100}</p>
                </div>

                <div className="flex flex-col w-[200px] gap-3 items-center bg-orange-100 rounded-md p-3">
                  <p>Today&apos;s Revenue</p>
                  <p>₹{todaysRevenue / 100}</p>
                </div>

                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Last Week Revenue</p>
                  <p>₹{lastWeekRevenue / 100}</p>
                </div>

                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Last Month Revenue</p>
                  <p>₹{lastMonthRevenue / 100}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
