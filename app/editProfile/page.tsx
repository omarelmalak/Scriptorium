// GENAI Citation: Used to initialize UserProfile class, button logic, CSS styling.

"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { UserProvider, useUser } from "../../api/user/userContext";
import { editUser } from "../../api/user/userEdit";

interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
}

const EditProfileInterior: React.FC = () => {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePicture || "/default-avatar.png");

  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    password: user?.password || "",
    profilePicture: user?.profilePicture || "/default-avatar.png",
  });

  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        profilePicture: user.profilePicture || "/default-avatar.png",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profile.password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const updatedProfile = { ...profile };

      if (profileImage) {
        await editUser(updatedProfile, profileImage);
      } else {
        await editUser(updatedProfile, undefined);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={previewImage || "/default-avatar.png"}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <p
                id="username"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-black"
              >
                {profile.username}
              </p>
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={profile.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={profile.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={profile.phoneNumber}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

const EditProfile: React.FC = () => {
  return (
    <UserProvider>
      <EditProfileInterior />
    </UserProvider>
  );
}

export default EditProfile;
