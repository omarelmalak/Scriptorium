// GENAI Citation: Used to define profile layout and CSS components.

"use client";

import React from "react";
import MainLayout from "../layout/MainLayout";
import { UserProvider, useUser } from "../../api/user/userContext";

const ViewProfileInterior: React.FC = () => {
  const { user } = useUser();

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h1>

          <div className="flex justify-center mb-6">
            <img
              src={user?.profilePicture}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>


          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Username</h2>
              <p className="text-lg text-gray-800">{user?.username}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
              <p className="text-lg text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Email Address</h2>
              <p className="text-lg text-gray-800">{user?.email}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Phone Number</h2>
              <p className="text-lg text-gray-800">{user?.phoneNumber}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Role</h2>
              <p className="text-lg text-gray-800">{user?.role}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Member Since</h2>
              <p className="text-lg text-gray-800">
                {user?.createdAt}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Last Updated</h2>
              <p className="text-lg text-gray-800">
                {user?.updatedAt}
              </p>
            </div>
          </div>


          <div className="mt-6 flex justify-center">
            <a
              href="/editProfile"
              className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const ViewProfile: React.FC = () => {
  return (
    <UserProvider>
      <ViewProfileInterior />
    </UserProvider>
  );
};



export default ViewProfile;
