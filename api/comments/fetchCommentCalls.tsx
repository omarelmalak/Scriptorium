// GENAI Citation: Used to define API fetching handlers, error checks, pagination collection.

export const createComment = async (
  blogId: number,
  content: string,
  parentId?: number
) => {
  try {
    const response = await fetch("http://localhost:3000/api/comments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        blogId,
        content,
        parentId,
      }),
    });



    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    const data = await response.json();
    console.log("DATA", data);
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const updateComment = async (commentId: number, content: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}


export const downvoteComment = async (commentId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/comments/interact/downvote?commentId=${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to downvote comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error downvoting comment:", error);
    throw error;
  }
};

export const upvoteComment = async (commentId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/comments/interact/upvote?commentId=${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upvote comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error upvoting comment:", error);
    throw error;
  }
};


export const sortComments = async (blogId: number, filterType: string) => {
  let allComments: any[] = [];
  let page = 1;
  const limit = 10;

  try {
    while (true) {
      const url = `http://localhost:3000/api/blogs/sort/commentRatings?blogId=${blogId}&filterType=${filterType}&page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sorted comments");
      }

      const data = await response.json();
      if (data.comments.length === 0) {
        break;
      }

      allComments = [...allComments, ...data.comments];
      page++;
    }

    return allComments;
  } catch (error) {
    console.error("Error fetching sorted comments:", error);
    throw error;
  }
};