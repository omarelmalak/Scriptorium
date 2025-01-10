// GENAI Citation: Used to define Blog class initialization, variable updates, pagination logic, button logic.

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "../components/BlogCard";
import MainLayout from "../layout/MainLayout";
import { searchBlogs, sortBlogs } from "../../api/blogs/fetchBlogCalls";

interface Blog {
  id: number;
  authorId: number;
  author: {
    firstName: string;
    lastName: string;
  };
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  hidden: boolean;
  tags: { id: number; name: string }[];
  codes: { id: number; title: string }[];
}

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>("createdDate");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<string>("global");

  const router = useRouter();
  let token = null;
  useEffect(() => {
    if (typeof window !== "undefined") {
      token = localStorage.getItem("accessToken");
      console.log("token changed");
    }
  }, [])
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);

    try {
      if (sortType === "createdDate") {
        const searchData = await searchBlogs(currentPage, 9, scope, searchCategories, searchQuery);
        if (searchData.error) throw new Error(searchData.error);
        setBlogs(searchData.blogs);
        setTotalPages(searchData.totalPages || 1);
      } else {
        const sortedData = await sortBlogs(sortType, scope, currentPage, 9);
        if (sortedData.error) throw new Error(sortedData.error);
        setBlogs(sortedData.blogs);
        setTotalPages(sortedData.totalPages || 1);
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred while fetching blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, sortType, scope]);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setError(null);
      setCurrentPage(1);

      const searchData = await searchBlogs(
        currentPage,
        9,
        scope,
        searchCategories.length === 0 && searchQuery !== ""
          ? ["title", "content", "tags"]
          : searchCategories,
        searchQuery
      );

      if (searchData.error) {
        setError("Failed to search blogs. Please try again.");
        return;
      }

      if (!searchData.blogs || searchData.blogs.length === 0) {
        setError("No blogs found matching your search.");
        setBlogs([]);
        return;
      }

      setBlogs(searchData.blogs);
      setTotalPages(searchData.totalPages || 1);
    } catch (error) {
      console.error("Error during search:", error);
      setError("An unexpected error occurred during the search.");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSearchCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handlePagination = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
    if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <MainLayout>
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-black">Sort Blogs</h2>
            <div className="flex gap-4">
              {["createdDate", "value", "controversial"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSortType(type)}
                  className={`px-4 py-2 rounded-md shadow ${sortType === type
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                    }`}
                  disabled={loading}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-black">Filter Blogs</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex gap-4">
                {["title", "content", "tags"].map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-md shadow ${searchCategories.includes(category)
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                      }`}
                    disabled={loading}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-auto text-black"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                disabled={loading}
              >
                Search
              </button>
            </div>
            <div className="flex gap-4">
              {["local", "global"].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScope(sc)}
                  className={`px-4 py-2 rounded-md shadow ${scope === sc
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {sc === "local" ? "My Blogs" : "All Blogs"}
                </button>
              ))}
            </div>
          </div>
          {token && (
            <button
              onClick={() => router.push("/blogs/create")}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none"
            >
              + Create Blog
            </button>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <BlogCard blogs={blogs} />
          )}
          <div className="flex justify-between items-center">
            <button
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 1 || loading}
              className={`px-4 py-2 rounded-md shadow ${currentPage === 1 || loading
                ? "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePagination("next")}
              disabled={currentPage === totalPages || loading}
              className={`px-4 py-2 rounded-md shadow ${currentPage === totalPages || loading
                ? "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogsPage;
