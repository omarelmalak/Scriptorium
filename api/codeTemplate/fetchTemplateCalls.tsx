// GENAI Citation: Used to define API fetching handlers w/ correct endpoints, error checks, pagination collection.

export const createTemplate = async (codeData: {
  title?: string;
  explanation?: string;
  content?: string;
  tags?: string[];
  language?: string;
  parentId?: number;
}) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found.");
    }

    const response = await fetch("http://localhost:3000/api/codes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(codeData),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to create code");
    }

    const data = await response.json();
    console.log("Data from createTemplate", data);
    return data;
  } catch (error) {
    console.error("Error creating code:", error);
    throw error;
  }
};

export const getTemplateById = async (
  codeId: number,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const url = new URL(`http://localhost:3000/api/codes/${codeId}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch code with ID ${codeId}`);
    }

    const data = await response.json();
    console.log("CODE TEMPLATE FETCH DATA: ", data);
    return data;
  } catch (error) {
    console.error(`Error fetching code with ID ${codeId}:`, error);
    throw error;
  }
};

export const updateTemplate = async (
  codeId: number,
  updateData: {
    title?: string;
    explanation?: string;
    content?: string;
    tags?: string[];
    input?: string;
    language?: string;
  }
) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found.");
    }

    const response = await fetch(`http://localhost:3000/api/codes/${codeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return {
        error: `Failed to update code with ID ${codeId}.`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error updating code with ID ${codeId}:`, error.message);
    return {
      error: `Failed to update code with ID ${codeId}.`,
    };
  }
};

export const deleteTemplate = async (codeId: number) => {
  try {

    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found.");
    }

    const response = await fetch(`http://localhost:3000/api/codes/${codeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete code with ID ${codeId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting code with ID ${codeId}:`, error);
    throw error;
  }
};

export const getAllCodes = async (
  page: number,
  limit: number,
  scope: string,
  searchCategories: string[],
  searchQuery: string
) => {
  try {
    const baseUrl = "http://localhost:3000";
    const url = new URL(`${baseUrl}/api/codes/search`);

    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("scope", scope);


    if (searchCategories.length > 0) {
      url.searchParams.append("category", searchCategories.join(","));
    }

    if (searchQuery) {
      url.searchParams.append("searchTerm", searchQuery);
    }

    console.log("FINAL URL:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    console.log(response);
    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      return {
        error: `Failed to fetch codes. Status: ${response.status}. ${errorDetails.message || "Unknown error occurred."
          }`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching codes:", error);
    throw new Error(`An unexpected error occurred while fetching templates: ${error}`);
  }
};





export const executeCode = async (params: {
  codeTemplateId?: number;
  code?: string;
  language?: string;
  input?: string;
}) => {
  const { codeTemplateId, code, language, input } = params;

  if (!codeTemplateId) {
    if (!code && !language) {
      return {
        error:
          "You must provide either `codeTemplateId` or both `code` and `language`.",
      };
    }
    if (!code) {
      return {
        error: "Code is empty. Please provide some code to execute.",
      };
    }
    if (!language) {
      return {
        error: "No language provided.",
      };
    }
  }

  try {
    const payload: Record<string, any> = {};
    if (codeTemplateId) payload.codeTemplateId = codeTemplateId;
    if (code) payload.code = code;
    if (language) payload.language = language;
    if (input) payload.input = input;

    const response = await fetch(
      "http://localhost:3000/api/execution/execute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        error: `Failed to execute code. Server responded with: ${response.status} ${response.statusText}. ${errorText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error executing code:", error);
    return {
      error: `Failed to execute code due to an unexpected error: ${error}`,
    };
  }
};
