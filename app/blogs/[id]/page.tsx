// GENAI Citation: Used to define Blog class, styling, error checks, variable updates, routing, button logic.

"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useParams, useRouter } from "next/navigation";
import { getBlogById, upvoteBlog, downvoteBlog, deleteBlog } from "../../../api/blogs/fetchBlogCalls";
import CommentsSection from "@/app/components/CommentsSection";
import { useUser, UserProvider } from "../../../api/user/userContext";
import { createReport } from "../../../api/reports/fetchReportsCalls";
import { sortComments } from "@/api/page";

interface Blog {
  id: number;
  authorId: number;
  author?: {
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
  tags?: { id: number; name: string }[];
  codes: { id: number; title: string }[];
}

const ViewBlogInterior: React.FC = () => {
  const params = useParams();
  const blogId = params?.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10) : NaN;
  const { user } = useUser();
  const router = useRouter();

  const userId: number | null = user ? parseInt(user.userId) : null;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userVoted, setUserVoted] = useState<{ upvoted: boolean; downvoted: boolean }>({
    upvoted: false,
    downvoted: false,
  });
  const [comments, setComments] = useState<any[]>([]);
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [reportExplanation, setReportExplanation] = useState<string>("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { blog: blogData } = await getBlogById(blogId);
        setBlog(blogData);
        setError(null);
        if (blogData.upvoters?.some((u: { id: number }) => u.id === userId)) {
          setUserVoted({ upvoted: true, downvoted: false });
        } else if (blogData.downvoters?.some((u: { id: number }) => u.id === userId)) {
          setUserVoted({ upvoted: false, downvoted: true });
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(blogId)) {
      fetchBlog();
    } else {
      setError("Invalid blog ID.");
      setLoading(false);
    }
  }, [blogId, userId]);

  const handleUpvote = async () => {
    const data = await upvoteBlog(blogId);
    if (!data.error) {
      const { blog: updatedBlogData } = await getBlogById(blogId);
      setBlog(updatedBlogData);

      if (updatedBlogData.upvoters?.some((u: { id: number }) => u.id === userId)) {
        setUserVoted({ upvoted: true, downvoted: false });
      } else if (updatedBlogData.downvoters?.some((u: { id: number }) => u.id === userId)) {
        setUserVoted({ upvoted: false, downvoted: true });
      }
    } else {
      setError(data.error);
    }
  };

  const handleDownvote = async () => {
    const data = await downvoteBlog(blogId);
    if (!data.error) {
      const { blog: updatedBlogData } = await getBlogById(blogId);
      setBlog(updatedBlogData);

      if (updatedBlogData.upvoters?.some((u: { id: number }) => u.id === userId)) {
        setUserVoted({ upvoted: true, downvoted: false });
      } else if (updatedBlogData.downvoters?.some((u: { id: number }) => u.id === userId)) {
        setUserVoted({ upvoted: false, downvoted: true });
      }
    } else {
      setError(data.error);
    }
  };

  const handleCancelVote = async () => {
    try {
      let response;
      if (userVoted.upvoted) {
        response = await upvoteBlog(blogId);
        if (!response.error) {
          const { blog: updatedBlogData } = await getBlogById(blogId);
          setBlog(updatedBlogData);
          setUserVoted({ upvoted: false, downvoted: false });
        }
      } else if (userVoted.downvoted) {
        response = await downvoteBlog(blogId);
        if (!response.error) {
          const { blog: updatedBlogData } = await getBlogById(blogId);
          setBlog(updatedBlogData);
          setUserVoted({ upvoted: false, downvoted: false });
        }
      }
    } catch (error) {
      console.error("Error canceling vote:", error);
      setError("Failed to cancel vote.");
    }
  };

  const handleReportContent = async () => {
    if (!reportExplanation.trim()) {
      alert("Please provide an explanation for the report.");
      return;
    }

    try {
      const reportData = {
        explanation: reportExplanation,
        parentId: blogId.toString(),
        parentType: "blog",
      };

      await createReport(reportData);
      alert("Content reported successfully.");
      setIsReporting(false);
    } catch (error) {
      console.error("Error reporting content:", error);
      alert("Failed to report content. Please try again later.");
    }
  };

  const handleEdit = () => {
    router.push(`/blogs/edit/${blogId}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      try {
        await deleteBlog(blogId);
        router.push("/blogList");
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Loading...</p>
      </MainLayout>
    );
  }

  if (error || !blog) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">{error || "Blog not found."}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">{blog.title || "Untitled Blog"}</h1>
            <div className="flex gap-4">
              {user && userId === blog.authorId && (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md shadow hover:bg-yellow-700"
                  >
                    Edit Blog
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
                  >
                    Delete Blog
                  </button>
                </>
              )}
              {user && (
                <button
                  onClick={() => setIsReporting((prev) => !prev)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
                >
                  Report Blog
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 text-gray-600">
            By{" "}
            <span className="font-medium text-gray-900">
              {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "Unknown Author"}
            </span>{" "}
            -{" "}
            <time dateTime={blog.createdAt}>
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown Date"}
            </time>
          </div>
          <div className="mt-4 flex gap-2">
            {blog.tags && blog.tags.length > 0 ? (
              blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No tags available.</p>
            )}
          </div>
          <div className="mt-6">
            <p className="text-lg text-gray-700">{blog.description || "No description available."}</p>
          </div>
          <div className="mt-6 flex gap-6 text-gray-600">
            <div>
              <strong>{blog.upvotes}</strong> Upvotes
            </div>
            <div>
              <strong>{blog.downvotes}</strong> Downvotes
            </div>
            <div>
              <strong>{blog.totalVotes}</strong> Total Votes
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            {!userVoted.upvoted && (
              <button
                onClick={handleUpvote}
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none"
              >
                Upvote
              </button>
            )}
            {!userVoted.downvoted && (
              <button
                onClick={handleDownvote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none"
              >
                Downvote
              </button>
            )}
            {userVoted.upvoted || userVoted.downvoted ? (
              <button
                onClick={handleCancelVote}
                className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:outline-none"
              >
                Cancel Vote
              </button>
            ) : null}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900">Associated Code Templates</h2>
            {blog.codes && blog.codes.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {blog.codes.map((code) => (
                  <li key={code.id}>
                    <button
                      onClick={() => router.push(`/templates/${code.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {code.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No code templates associated with this blog.</p>
            )}
          </div>
          {isReporting && (
            <div className="mt-6 p-4 bg-gray-100 border rounded-md">
              <h3 className="text-lg font-bold">Report Blog</h3>
              <textarea
                placeholder="Provide an explanation for reporting this content"
                value={reportExplanation}
                onChange={(e) => setReportExplanation(e.target.value)}
                className="mt-2 w-full h-32 p-2 border rounded-md"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleReportContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setIsReporting(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <CommentsSection blogId={blogId}></CommentsSection>
        </div>
      </div>
    </MainLayout>
  );
};

const ViewBlog: React.FC = () => {
  return (
    <UserProvider>
      <ViewBlogInterior />
    </UserProvider>
  );
};

export default ViewBlog;
