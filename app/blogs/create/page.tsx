// GENAI Citation: Used to define blog creation, styling, error checks, mapping, variable updates, routing, button logic.

"use client";

import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useRouter } from "next/navigation";
import { createBlog } from "@/api/blogs/fetchBlogCalls";

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [codeIds, setCodeIds] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Title and Description are required fields.");
      setLoading(false);
      return;
    }

    try {
      const blogData = {
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        codeIds: codeIds
          .split(",")
          .map((url) => {
            const parts = url.trim().split("/");
            const id = parts[parts.length - 1];
            return parseInt(id, 10);
          })
          .filter((id) => !isNaN(id)),
      };

      console.log("Submitting Blog Data:", blogData);

      const response = await createBlog(blogData);

      if (response.error) {
        alert(response.error);
      } else {
        alert("Blog created successfully!");

        setTitle("");
        setDescription("");
        setTags("");
        setCodeIds("");

        router.push(`/blogs/${response.blog.id}`);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">Create a New Blog</h1>
          <p className="mt-2 text-gray-600">Share your knowledge and insights with the community.</p>

          {errorMessage && (
            <div className="mb-4 text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                placeholder="Enter the blog title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                rows={5}
                placeholder="Write a brief description for your blog"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                placeholder="e.g., programming, javascript"
              />
            </div>

            <div>
              <label htmlFor="codeIds" className="block text-sm font-medium text-gray-700">
                Associated Code Templates (comma-separated links)
              </label>
              <input
                type="text"
                id="codeIds"
                value={codeIds}
                onChange={(e) => setCodeIds(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                placeholder="e.g., 1, 2, 3"
              />
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateBlog;
