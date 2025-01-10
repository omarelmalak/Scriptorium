// GENAI Citation: Used to define template list page, Template class initialization, error checks, and button logic.

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TemplateCard from "../components/TemplateCard";
import MainLayout from "../layout/MainLayout";
import { getAllCodes } from "../../api/codeTemplate/fetchTemplateCalls";

interface Template {
  id: number;
  authorId: number;
  author: {
    firstName: string;
    lastName: string;
  };
  title: string;
  explanation: string;
  content: string;
  language: string;
  input: string;
  createdAt: Date;
  updatedAt: Date;
  tags: { id: number; name: string }[];
}

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<string>("global");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    }
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllCodes(currentPage, 9, scope, searchCategories, searchQuery);
      console.log(scope);
      if (data.error) throw new Error(data.error);

      setTemplates(data.results || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError((err as Error).message || "An error occurred while fetching templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, scope]);

  const handleSearch = async () => {
    try {
      setError(null);
      setCurrentPage(1);

      const data = await getAllCodes(
        1,
        9,
        scope,
        searchCategories.length === 0 && searchQuery !== ""
          ? ["title", "explanation", "tags"]
          : searchCategories,
        searchQuery
      );

      console.log(data);

      if (data.error) {
        setError("Failed to search templates. Please try again.");
        return;
      }

      if (!data.results || data.results.length === 0) {
        setError("No templates found matching your search.");
        setTemplates([]);
        return;
      }

      setTemplates(data.results);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error during search:", error);
      setError("An unexpected error occurred during the search.");
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
          <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-black">Filter Templates</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex gap-4">
                {["title", "explanation", "tags"].map((category) => (
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
                placeholder="Search templates..."
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
                  {sc === "local" ? "My Templates" : "All Templates"}
                </button>
              ))}
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => router.push("/templates/create")}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none"
            >
              + Create Template
            </button>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <TemplateCard templates={templates.map((template) => ({
              ...template,
              createdAt: new Date(template.createdAt).toISOString(),
              updatedAt: new Date(template.updatedAt).toISOString(),
            }))} />
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

export default TemplatesPage;
