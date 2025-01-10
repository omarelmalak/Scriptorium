// GENAI Citation: Used to define decoded logic, UseEffect, User class, context saving w/ UserProvider, local storage setup.

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    password: string;
    phoneNumber: string;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decoded:
                    {
                        userId: string;
                        username: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                        profilePicture: string;
                        createdAt: string;
                        updatedAt: string;
                        role: string;
                        password: string;
                        phoneNumber: string;
                    } = jwtDecode(accessToken);
                setUser({
                    userId: decoded.userId,
                    username: decoded.username,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    email: decoded.email,
                    profilePicture: decoded.profilePicture,
                    createdAt: new Date(decoded.createdAt).toLocaleDateString(),
                    updatedAt: new Date(decoded.updatedAt).toLocaleDateString(),
                    role: decoded.role,
                    password: decoded.password,
                    phoneNumber: decoded.phoneNumber
                });
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
