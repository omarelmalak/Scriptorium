// GENAI Citation: Used to initialize Comment class, comment iteration, button logic, error checks, comment nesting.

import { useState, useEffect } from "react";
import {
  sortComments,
  createComment,
  upvoteComment,
  downvoteComment,
  updateComment,
  deleteComment,
} from "@/api/page";
import { createReport } from "@/api/reports/fetchReportsCalls";

import { useUser, UserProvider } from "@/api/user/userContext";

interface Comment {
  parentId: any;
  id: number;
  content: string;
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
  authorId: number;
}

interface CommentsSectionProps {
  blogId: number;
}

const CommentsSectionInterior: React.FC<CommentsSectionProps> = ({
  blogId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [filterType, setFilterType] = useState("value");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>(
    {}
  );
  const { user } = useUser();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editedReplyContent, setEditedReplyContent] = useState<string>("");
  const [reportingCommentId, setReportingCommentId] = useState<number | null>(
    null
  );
  const [reportExplanation, setReportExplanation] = useState<string>("");

  useEffect(() => {
    const fetchSortedComments = async () => {
      try {
        setLoading(true);
        const flatComments = await sortComments(blogId, filterType);
        const nestedComments = buildNestedComments(flatComments);
        setComments(nestedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchSortedComments();
  }, [blogId, filterType]);

  const handleEdit = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleEditSubmit = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault();

    if (!editedContent.trim()) return;

    try {
      setLoading(true);
      await updateComment(commentId, editedContent);
      const flatComments = await sortComments(blogId, filterType);
      const nestedComments = buildNestedComments(flatComments);
      setComments(nestedComments);
      setEditingCommentId(null);
      setEditedContent("");
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (
      confirm(
        "Are you sure you want to delete this comment? There is NO coming back!"
      )
    ) {
      try {
        await deleteComment(commentId);
        const flatComments = await sortComments(blogId, filterType);
        const nestedComments = buildNestedComments(flatComments);
        setComments(nestedComments);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const buildNestedComments = (comments: Comment[]): Comment[] => {
    const commentMap: { [key: number]: Comment } = {};

    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    const nestedComments: Comment[] = [];

    comments.forEach((comment) => {
      if (comment.parentId) {
        commentMap[comment.parentId].replies!.push(commentMap[comment.id]);
      } else {
        nestedComments.push(commentMap[comment.id]);
      }
    });

    return nestedComments;
  };

  const handleEditReply = (replyId: number, currentContent: string) => {
    setEditingReplyId(replyId);
    setEditedReplyContent(currentContent);
  };

  const handleEditReplySubmit = async (e: React.FormEvent, replyId: number) => {
    e.preventDefault();

    if (!editedReplyContent.trim()) return;

    try {
      setLoading(true);
      await updateComment(replyId, editedReplyContent);
      const flatComments = await sortComments(blogId, filterType);
      const nestedComments = buildNestedComments(flatComments);
      setComments(nestedComments);
      setEditingReplyId(null);
      setEditedReplyContent("");
    } catch (err) {
      console.error("Error updating reply:", err);
      setError("Failed to update reply");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await createComment(blogId, content);
      const flatComments = await sortComments(blogId, filterType);
      const nestedComments = buildNestedComments(flatComments);
      setComments(nestedComments);
      setContent("");
    } catch (err) {
      console.error("Error creating comment:", err);
      setError("Failed to create comment");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (
    commentId: number,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      if (voteType === "upvote") {
        await upvoteComment(commentId);
      } else {
        await downvoteComment(commentId);
      }

      const flatComments = await sortComments(blogId, filterType);
      const nestedComments = buildNestedComments(flatComments);
      setComments(nestedComments);
    } catch (err) {
      console.error(`Failed to ${voteType} comment:`, err);
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    const replyText = replyContent[parentId]?.trim();
    if (!replyText) return;

    try {
      setLoading(true);
      await createComment(blogId, replyText, parentId);
      const flatComments = await sortComments(blogId, filterType);
      const nestedComments = buildNestedComments(flatComments);
      setComments(nestedComments);
      setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
    } catch (err) {
      console.error("Error creating reply:", err);
      setError("Failed to create reply");
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportExplanation.trim()) {
      alert("Please provide an explanation for the report.");
      return;
    }

    try {
      await createReport({
        explanation: reportExplanation,
        parentId: reportingCommentId?.toString() || "",
        parentType: "comment",
      });

      alert("Comment reported successfully.");
      setReportingCommentId(null);
      setReportExplanation("");
    } catch (err) {
      console.error("Error reporting comment:", err);
      alert("Failed to report comment. Please try again.");
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-lg font-bold mb-8">Comments</h1>
      <div className="mb-4">
        <button
          className={`mr-4 ${filterType === "createdDate" ? "font-bold" : ""}`}
          onClick={() => setFilterType("createdDate")}
        >
          By Created Date
        </button>

        <button
          className={`mr-4 ${filterType === "value" ? "font-bold" : ""}`}
          onClick={() => setFilterType("value")}
        >
          By Value
        </button>
        <button
          className={filterType === "controversial" ? "font-bold" : ""}
          onClick={() => setFilterType("controversial")}
        >
          By Controversial
        </button>
      </div>

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none"
        >
          Submit
        </button>
      </form>
      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded shadow-sm">
            {editingCommentId === comment.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, comment.id)}>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <p className="text-gray-800">{comment.content}</p>
                <div className="text-sm text-gray-600">
                  By {comment.author.firstName} {comment.author.lastName} on{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => handleVote(comment.id, "upvote")}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Upvote ({comment.upvotes})
                  </button>
                  <button
                    onClick={() => handleVote(comment.id, "downvote")}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Downvote ({comment.downvotes})
                  </button>
                  {user && parseInt(user.userId) === comment.authorId && (
                    <button
                      onClick={() => handleEdit(comment.id, comment.content)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md"
                    >
                      Edit Comment
                    </button>
                  )}
                  {user && parseInt(user.userId) === comment.authorId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md ml-2"
                    >
                      Delete Comment
                    </button>
                  )}

                  {user && (
                    <button
                      onClick={() => setReportingCommentId(comment.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Report
                    </button>
                  )}
                </div>
                {reportingCommentId === comment.id && (
                  <div className="mt-4 p-2 bg-gray-100 border rounded">
                    <textarea
                      value={reportExplanation}
                      onChange={(e) => setReportExplanation(e.target.value)}
                      placeholder="Explain why you are reporting this comment"
                      className="w-full p-2 mb-4 border rounded"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleReportSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Submit Report
                      </button>
                      <button
                        onClick={() => setReportingCommentId(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="mt-4">
              <textarea
                value={replyContent[comment.id] || ""}
                onChange={(e) =>
                  setReplyContent((prev) => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
                placeholder="Write a reply..."
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={() => handleReplySubmit(comment.id)}
                className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Reply
              </button>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l-2">
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2">
                    {comment.replies.map((reply) =>
                      editingReplyId === reply.id ? (
                        <form
                          key={reply.id}
                          onSubmit={(e) => handleEditReplySubmit(e, reply.id)}
                        >
                          <textarea
                            value={editedReplyContent}
                            onChange={(e) =>
                              setEditedReplyContent(e.target.value)
                            }
                            className="w-full p-2 mb-4 border rounded"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
                          >
                            Save Reply
                          </button>
                        </form>
                      ) : (
                        <div key={reply.id} className="mb-4">
                          <p className="text-gray-800">{reply.content}</p>
                          <div className="text-sm text-gray-600">
                            By {reply.author.firstName} {reply.author.lastName}{" "}
                            on {new Date(reply.createdAt).toLocaleDateString()}
                          </div>
                          <div className="mt-2 flex gap-4">
                            <button
                              onClick={() => handleVote(reply.id, "upvote")}
                              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Upvote ({reply.upvotes})
                            </button>
                            <button
                              onClick={() => handleVote(reply.id, "downvote")}
                              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Downvote ({reply.downvotes})
                            </button>
                            {user &&
                              parseInt(user.userId) === reply.authorId && (
                                <button
                                  onClick={() =>
                                    handleEditReply(reply.id, reply.content)
                                  }
                                  className="px-2 py-1 bg-yellow-600 text-white rounded-md"
                                >
                                  Edit Reply
                                </button>
                              )}
                            {user &&
                              parseInt(user.userId) === reply.authorId && (
                                <button
                                  onClick={() => handleDelete(reply.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-md ml-2"
                                >
                                  Delete Comment
                                </button>
                              )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ blogId }) => {
  return (
    <UserProvider>
      <CommentsSectionInterior blogId={blogId} />
    </UserProvider>
  );
};

export default CommentsSection;
