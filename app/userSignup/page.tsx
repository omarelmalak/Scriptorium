// GENAI Citation: Used to define userSignup page and form data updates and button handler implementation.

"use client";

import React, { useState } from "react";
import { registerUser } from "../../api/user/fetchUserCalls";
import { useRouter } from "next/navigation";

const SignUpForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const { password, confirmPassword, ...userData } = formData;


        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await registerUser({ ...userData, password });
            console.log("User data submitted:", formData);

            setSuccess(true);
            setFormData({
                username: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
            });


            router.push("/userLogin");
        } catch (err) {
            setError("An error occurred during sign-up. Please try again.");
            console.log(err);
        }
    };



    return (
        <div className="font-sans">
            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <div className="relative w-full sm:max-w-md">
                    <div className="card bg-blue-500 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
                    <div className="card bg-indigo-500 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>

                    <div className="relative w-full rounded-3xl bg-white shadow-lg px-8 py-6">
                        <h2 className="text-center text-2xl font-bold text-gray-800">
                            Create an Account
                        </h2>

                        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
                        {success && (
                            <p className="mt-4 text-green-600 text-center">
                                Account created successfully!
                            </p>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
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
                                    value={formData.firstName}
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
                                    value={formData.lastName}
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
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>

                            {/* Phone Number */}
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
                                    value={formData.phoneNumber}
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
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
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
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-700">
                                Already have an account?{" "}
                                <a
                                    href="/userLogin"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
