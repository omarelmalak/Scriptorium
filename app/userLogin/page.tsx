// GENAI Citation: Used to define userLogin page, form data updates, button handler implementation, localStorage usage.

"use client";

import React, { useState } from "react";
import { loginUser } from "../../api/user/fetchUserCalls";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");


        const { username, password } = formData;

        try {
            const data = await loginUser({ username, password });
            console.log("User data submitted:", data);

            localStorage.setItem('refreshToken', data.refreshToken);
            console.log(data);
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('role', data.user.role);


            localStorage.setItem('accessToken', data.accessToken);
            setFormData({
                username: "",
                password: "",
            });
            router.push("/blogList");
        } catch (err: any) {
            if (err.message === "Password does not match in Prisma DB") {
                setError("Incorrect password. Please try again.")
            } else if (err.message === "Username does not exist in Prisma DB") {
                setError("No account exists with this username. Please try again.")
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error(err);
        }
    };


    return (
        <div className="font-sans">
            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <div className="relative w-full sm:max-w-md">
                    <div className="card bg-blue-500 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
                    <div className="card bg-indigo-500 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>

                    <div className="relative w-full rounded-3xl bg-white shadow-lg px-8 py-6">
                        <h2 className="block text-center text-2xl font-bold text-gray-800">
                            Login to Scriptorium
                        </h2>

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
                                    placeholder="Enter your username"
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
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm mt-2">{error}</div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    Login
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-700">
                                    New?{" "}
                                    <a
                                        href="/userSignup"
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Create an account
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
