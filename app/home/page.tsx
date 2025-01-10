// GENAI Citation: Used to define home page with routing and CSS styling.

"use client";

import React from "react";
import MainLayout from "../layout/MainLayout";
import Image from "next/image";

const LandingPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">

        <section className="bg-white py-20 px-6 shadow-md">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <Image
                src="/logo.jpg"
                alt="Scriptorium Logo"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to Scriptorium
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Share, collaborate, and explore code and ideas with developers worldwide.
            </p>
            <a
              href="/userSignup"
              className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg shadow hover:bg-gray-700 transition"
            >
              Get Started
            </a>
          </div>
        </section>


        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Choose Scriptorium?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Collaborative Blogging
                </h3>
                <p className="text-gray-600">
                  Publish your ideas and engage with a growing developer community.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Advanced Code Editor
                </h3>
                <p className="text-gray-600">
                  Edit and share code snippets seamlessly with built-in tools.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Community Engagement
                </h3>
                <p className="text-gray-600">
                  Connect, collaborate, and grow with fellow developers and enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </section>


        <section className="bg-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-300 mb-6">
              Start sharing your knowledge and exploring endless possibilities.
            </p>
            <a
              href="/userSignup"
              className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg shadow hover:bg-gray-200 transition"
            >
              Sign Up Now
            </a>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default LandingPage;
