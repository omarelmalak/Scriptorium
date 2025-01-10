// GENAI Citation: Used to define logout w/ safe localstorage logic.

"use client";

export const logout = async (router: any) => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("id");

    router.push("/home");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
