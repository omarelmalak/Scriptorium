// GENAI Citation: Used to define API fetching handlers w/ correct endpoints, error checks, pagination collection.

interface BlogData {
  title: string;
  description: string;
  tags: string[];
  codeIds: number[];
}

export const createBlog = async (blogData: BlogData) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found.");
    }

    const response = await fetch("http://localhost:3000/api/blogs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      return { error: `Failed to create blog` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};


export const getBlogById = async (
  blogId: number,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const url = new URL(`http://localhost:3000/api/blogs/${blogId}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    console.log(url.toString());


    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    console.log(response);
    if (!response.ok) {
      console.error(`Failed to fetch blog with ID ${blogId}`);
      return { error: `Failed to fetch blog with ID ${blogId}` };
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${blogId}:`, error);
    throw error;
  }
};



export const updateBlog = async (
  blogId: number,
  updateData: {
    title?: string;
    description?: string;
    tags?: string[];
    codeIds?: number[];
  }
) => {
  try {
    console.log("TITLE", updateData.title);
    console.log("DESCRIPTION", updateData.description);
    const response = await fetch(`http://localhost:3000/api/blogs/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      console.error(`Failed to update blog with ID ${blogId}`);
      return { error: `Failed to fetch blog with ID ${blogId}` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating blog with ID ${blogId}:`, error);
    throw error;
  }
};

export const deleteBlog = async (blogId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/api/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {

      return { error: `Failed to delete blog with ID ${blogId}` };

    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting blog with ID ${blogId}:`, error);
    throw error;
  }
};

export const upvoteBlog = async (blogId: number) => {
  console.log("UPVOTING...");
  try {
    const response = await fetch(
      `http://localhost:3000/api/blogs/interact/upvote?blogId=${blogId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to upvote blog with ID ${blogId}` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const downvoteBlog = async (blogId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/blogs/interact/downvote?blogId=${blogId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to downvote blog with ID ${blogId}` };

    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const sortBlogs = async (
  filterType: string,
  scope: string,
  page: number = 1,
  limit: number = 9
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/blogs/sort/blogRatings?filterType=${filterType}&page=${page}&limit=${limit}&scope=${scope}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to sort blogs` };
    }

    const data = await response.json();
    console.log("sort response", data);
    return data;

  } catch (error) {
    console.error("Error sorting blogs:", error);
    throw error;
  }
};


export const searchBlogs = async (
  page: number = 1,
  limit: number = 9,
  scope: string,
  categories?: string[],
  searchTerm?: string
) => {
  try {
    const url = new URL("http://localhost:3000/api/blogs/search");
    // http://localhost:3000/api/blogs/search?page=2&limit=1
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    if (categories && categories.length > 0) {
      url.searchParams.append("category", categories.join(","));
    }

    if (searchTerm) {
      url.searchParams.append("searchTerm", searchTerm);
    }

    url.searchParams.append("scope", scope);

    console.log("url", url.toString());
    //http://localhost:3000/api/blogs/search?page=1&limit=10&category=title&searchTerm=hello
    // http://localhost:3000/api/blogs/search?page=1&limit=10&category=title

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      return { error: `Failed to search for blogs` };
    }

    const data = await response.json();
    console.log("DATA: ", data);
    return data;
  } catch (error) {
    console.error("Error searching for blogs:", error);
    throw error;
  }
};
