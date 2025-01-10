// GENAI Citation: Used to define API fetching handlers, error checks.

export const createReport = async (reportData: {
  explanation: string;
  parentId: string;
  parentType: string;
}) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await fetch(
      "http://localhost:3000/api/reports/reportContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create code");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating code:", error);
    throw error;
  }
};

export const getReport = async (reportId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/reports/${reportId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );


    if (!response.ok) {
      throw new Error("Failed to create code");
    }

    console.log(response);

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating code:", error);
    throw error;
  }
};

export const hideContent = async (reportData: {
  contentId: string;
  contentType: string;
}) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/reports/hideReportedContent`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(reportData),
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to create code");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating code:", error);
    throw error;
  }
};



export const sortReportedContent = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/reports/sortReportedContent?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

        },
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to create code");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating code:", error);
    throw error;
  }
};
