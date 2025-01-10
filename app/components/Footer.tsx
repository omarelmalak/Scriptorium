// GENAI Citation: Used to create styling for footer.

"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">

          <div className="flex flex-col items-start space-y-3">
            <h2 className="text-lg font-semibold">Scriptorium</h2>
            <p className="text-sm text-gray-400">
              Share your stories and code templates with the world.
            </p>
          </div>


          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/blogList" className="text-sm hover:text-gray-400">
              Blogs
            </a>
            <a href="/templateList" className="text-sm hover:text-gray-400">
              Templates
            </a>
          </div>
        </div>


        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Scriptorium. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
