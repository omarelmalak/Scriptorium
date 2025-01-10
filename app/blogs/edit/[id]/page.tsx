// GENAI Citation: Used to define Blog class initialization, button logic, variable updates, useEffect, and styling.

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "../../../layout/MainLayout";
import { getBlogById, updateBlog } from "../../../../api/blogs/fetchBlogCalls";

interface Blog {
  id: number;
  authorId: number;
  title: string;
  description: string;
  tags: { id: number; name: string }[];
}

const EditBlog: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const blogId = parseInt(id, 10);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {

        console.log("IDDD", blogId);
        const blogData = await getBlogById(blogId);
        console.log(blogData);
        setBlog(blogData.blog);
        setTitle(blogData.blog.title);
        setDescription(blogData.blog.description);
        setTags(blogData.blog.tags.map((tag: { id: number; name: string }) => tag.name).join(", "));
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(blogId)) {
      fetchBlog();
    } else {
      alert("Invalid blog ID.");
      setLoading(false);
    }
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBlog = {
      title,
      description,
      tags: tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
      codeIds: [],
    };
    console.log("THE UPDATED: ", updatedBlog);
    try {
      await updateBlog(blogId, updatedBlog);
      alert("Blog updated successfully!");
      router.push(`/blogs/${blogId}`);
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update the blog.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Loading...</p>
      </MainLayout>
    );
  }

  if (!blog) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Blog not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Edit Blog</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              rows={4}
              required
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-gray-700 font-medium">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Blog
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditBlog;

