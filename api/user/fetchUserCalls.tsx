// GENAI Citation: Used to define handler logic, error checks.

export const registerUser = async (userData: {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}) => {
  try {
    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};


export const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to login, please try again later.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/users/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};



