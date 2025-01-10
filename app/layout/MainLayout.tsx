// GENAI Citation: Used to define the main page layout for clarity with Header + Footer components.

"use client";
import React, { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
