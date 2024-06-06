import { useGlobalContext } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import Login from "../login";
import { connectDB } from "@/lib/db";
import userInfoModel from "@/model/userInfoModel";
import Link from "next/link";
import Layout from "@/components/Layout";

const Profile = ({ userData }) => {
  const { auth } = useGlobalContext();
  // console.log(userData);
  const profileData = userData[0];

  if (!auth?.user || !auth?.role || !auth?.token) {
    return <Login />;
  }

  return (
    <>
      <Layout>
        <div>
          <div className="flex sm:flex-row flex-col gap-6 justify-evenly bg-orange-50 rounded-md p-10">
            <div className=" md:w-[300px] sm:[250px] w-[150px]">
              <img
                src={profileData?.image}
                alt="profile picture"
                className=" rounded-md p-2 object-cover"
              />
            </div>

            <div>
              <p className="font-mono">
                <span className="font-bold">Name</span> : {profileData?.name}
              </p>
              <p className="font-mono">
                <span className="font-bold">Email</span> : {profileData?.email}
              </p>
              <p className="font-mono">
                <span className="font-bold">Address : </span>
                {profileData?.address}
              </p>
              <p className="font-mono">
                {profileData?.city} - {profileData?.postalCode}
              </p>
              <p className="font-mono">
                {profileData?.state},{profileData?.country}
              </p>
              <Link href={`/profile/update/${profileData?._id}`}>
                <button className="bg-orange-200 p-2 w-[100%] my-7  rounded-md hover:bg-orange-100">
                  Update
                </button>
              </Link>{" "}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;

export async function getServerSideProps(context) {
  const { id } = context.query;

  await connectDB();

  try {
    const userData = await userInfoModel.find({
      _id: id,
    });

    return {
      props: {
        userData: JSON.parse(JSON.stringify(userData)),
      },
    };
  } catch (err) {
    console.log(err);
    return { props: { userData: null } };
  }
}
