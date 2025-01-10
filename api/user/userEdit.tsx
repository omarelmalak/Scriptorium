// GENAI Citation: Used to define localstorage update, error checks.

export const editUser = async (UserProfile: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string;
}, profileImage?: File) => {
    try {
        const response = await fetch("http://localhost:3000/api/users/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UserProfile),
        });

        if (!response.ok) {
            throw new Error("Failed to edit user");
        }

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('accessToken', data.token);
        }
        return data;
    } catch (error) {
        console.error("Error editing user:", error);
        throw error;
    }
}