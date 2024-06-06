// import Layout from "@/components/Layout";
// import { useGlobalContext } from "@/context/userContext";
// // import { useSession } from "next-auth/react";
// // import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Login from "./login";

// const dashboard = () => {
//   // const { data: session } = useSession();
//   // console.log(session);

//   const [allOrders, setAllOrders] = useState([]);

//   const getOrders = async () => {
//     try {
//       let res = await fetch("/api/order", {
//         method: "GET",

//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       let dataFromResponse = await res.json();
//       // console.log(dataFromResponse);
//       setAllOrders(dataFromResponse);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     getOrders();
//   }, []);

//   // calculateTodaysRevenue

//   const calculateTotalRevenue = (orders) => {
//     return orders?.reduce((acc, order) => {
//       return (
//         acc +
//         order?.line_items.reduce((sum, item) => {
//           return (sum += item?.quantity * item?.price_data?.unit_amount);
//         }, 0)
//       );
//     }, 0);
//   };

//   const filterOrders = (orders, startDate, endDate) => {
//     return orders.filter((order) => {
//       let orderDate = new Date(order.createdAt);

//       return orderDate >= startDate && orderDate <= endDate;
//     });
//   };

//   //let find date ranges
//   let today = new Date();
//   // console.log(today);

//   let startOfToday = new Date(today.setHours(0, 0, 0, 0));
//   let endOfToday = new Date(today.setHours(23, 59, 59, 999));
//   // console.log(startOfToday);
//   // console.log(endOfToday);

//   let startOfLastWeek = new Date(today);
//   startOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
//   startOfLastWeek.setHours(0, 0, 0, 0);

//   let endOfLastWeek = new Date(today);
//   endOfLastWeek.setDate(startOfLastWeek.getDate() + 5);
//   endOfLastWeek.setHours(23, 59, 59, 999);

//   console.log(startOfLastWeek);
//   console.log(endOfLastWeek);

//   let startOfLastMonth = new Date(today.getFullYear(), today.getMonth());
//   // console.log(startOfLastMonth);

//   let endOfLastMonth = new Date(today.getFullYear(), today.getMonth() + 1);
//   // console.log(endOfLastMonth);

//   let todaysOrders = filterOrders(allOrders, startOfToday, endOfToday);
//   let todaysRevenue = calculateTotalRevenue(todaysOrders);

//   let lastWeekOrders = filterOrders(allOrders, startOfLastWeek, endOfLastWeek);
//   let lastWeekRevenue = calculateTotalRevenue(lastWeekOrders);

//   let lastMonthOrders = filterOrders(
//     allOrders,
//     startOfLastMonth,
//     endOfLastMonth
//   );
//   let lastMonthRevenue = calculateTotalRevenue(lastMonthOrders);

//   const { auth } = useGlobalContext();

//   if (!auth?.user || !auth?.role || !auth?.token) {
//     return <Login />;
//   }

//   return (
//     <>
//       <Layout>
//         {/* <header className="flex items-center justify-between bg-orange-100 p-3 rounded-lg">
//           <div>{session?.user?.name}</div>

//           <div>
//             <Image
//               src={session?.user?.image}
//               width={50}
//               height={50}
//               className="rounded-md"
//             ></Image>
//           </div>
//         </header> */}

//         {/* orders */}

//         <div>
//           <div className="text-center p-3">
//             {allOrders?.length === 0 && (
//               <>
//                 <p>No orders yet !!</p>
//               </>
//             )}
//           </div>

//           <div className="flex flex-col gap-5 bg-orange-200 p-5 rounded-md">
//             {allOrders?.length > 0 && (
//               <>
//                 <p className="text-center text-2xl mt-3"> Orders & Revenue</p>

//                 <div className="flex justify-center sm:flex-row flex-col flex-wrap gap-5 items-center bg-orange-300 p-5 rounded-md ">
//                   <div className="flex flex-col gap-3 w-[200px]  items-center bg-orange-100 rounded-md p-3">
//                     <p>Total Orders</p>
//                     <p>{allOrders?.length}</p>
//                   </div>

//                   <div className="flex flex-col gap-3 w-[200px]  items-center bg-orange-100 rounded-md p-3">
//                     <p>Today's Orders</p>
//                     <p>{todaysOrders?.length}</p>
//                   </div>

//                   <div className="flex flex-col gap-3 w-[200px]  items-center bg-orange-100 rounded-md p-3">
//                     <p>Last Week Orders</p>
//                     <p>{lastWeekOrders?.length}</p>
//                   </div>

//                   <div className="flex flex-col gap-3 w-[200px]  items-center bg-orange-100 rounded-md p-3">
//                     <p>Last Month Orders</p>
//                     <p>{lastMonthOrders?.length}</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-center sm:flex-row flex-col   gap-5 items-center bg-orange-300 p-5 rounded-md ">
//                   <div className="flex flex-col w-[200px] gap-3 items-center bg-orange-100 rounded-md p-3">
//                     {" "}
//                     <p>Total Revenue</p>
//                     <p>₹{calculateTotalRevenue(allOrders) / 100}</p>
//                   </div>

//                   <div className="flex flex-col w-[200px] gap-3 items-center bg-orange-100 rounded-md p-3">
//                     {" "}
//                     <p>Today's Revenue</p>
//                     <p>₹{todaysRevenue / 100}</p>
//                   </div>

//                   <div className="flex flex-col gap-3 w-[200px]  items-center bg-orange-100 rounded-md p-3">
//                     {" "}
//                     <p>Last Week Revenue</p>
//                     <p>₹{lastWeekRevenue / 100}</p>
//                   </div>

//                   <div className="flex flex-col gap-3 w-[200px]  items-center bg-orange-100 rounded-md p-3">
//                     {" "}
//                     <p>Last Month Revenue</p>
//                     <p>₹{lastMonthRevenue / 100}</p>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </Layout>
//     </>
//   );
// };

// export default dashboard;

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

    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysSinceLastMonday = ((dayOfWeek + 6) % 7) + 1;

    let startOfLastWeek = new Date(today); // Create a new Date object with today's date
    startOfLastWeek.setDate(
      today.getDate() - today.getDay() - (today.getDay() === 0 ? 7 : 6)
    ); // Subtracting the day of the week from the current date and then subtracting 6 days (or 7 if today is Sunday) to get to the start of last week
    startOfLastWeek.setHours(0, 0, 0, 0); // Set hours to 0, minutes to 0, seconds to 0, and milliseconds to 0 to get the start of the day

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

    // console.log(startOfLastWeek);
    // console.log(endOfLastWeek);

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
              <p className="text-center text-2xl mt-3">Orders & Revenue</p>

              <div className="flex justify-center sm:flex-row flex-col flex-wrap gap-5 items-center bg-orange-300 p-5 rounded-md">
                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Total Orders</p>
                  <p>{allOrders?.length}</p>
                </div>

                <div className="flex flex-col gap-3 w-[200px] items-center bg-orange-100 rounded-md p-3">
                  <p>Today's Orders</p>
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
                  <p>Today's Revenue</p>
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
