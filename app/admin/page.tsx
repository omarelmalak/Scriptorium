// GENAI Citation: Used to define AdminItem class, useEffect, routing, styling, button logic.

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../layout/MainLayout";
import { hideContent, sortReportedContent } from "../../api/reports/fetchReportsCalls";

interface AdminItem {
  id: number;
  type: "Blog" | "Comment";
  title?: string;
  content?: string;
  reports: number;
  hidden: boolean;
}

const AdminPage: React.FC = () => {
  const [adminItems, setAdminItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminItems = async () => {
      try {
        setLoading(true);
        const reportedData = await sortReportedContent();
        console.log(reportedData);
        const combinedItems = reportedData.data.map((item: any) => ({
          id: item.id,
          type: item.type === "blog" ? "Blog" : "Comment",
          title: item.type === "blog" ? item.parentContent?.title : undefined,
          content: item.type === "comment" ? item.parentContent?.content : undefined,
          reports: item.reportCount,
          hidden: item.parentContent?.hidden || false,
        }));
        setAdminItems(combinedItems);
      } catch (error) {
        console.error("Failed to fetch reported content:", error);
        alert("An error occurred while fetching reported content.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminItems();
  }, []);

  const handleHide = async (id: number, type: "Blog" | "Comment") => {
    try {
      const reportData = {
        contentId: id.toString(),
        contentType: type.toLowerCase(),
      };

      await hideContent(reportData);

      alert(`${type} with ID ${id} has been successfully hidden.`);

      setAdminItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id && item.type === type ? { ...item, hidden: true } : item
        )
      );
    } catch (error) {
      console.error(`Failed to hide ${type} with ID ${id}:`, error);
      alert(`Failed to hide ${type} with ID ${id}.`);
    }
  };

  const handleViewReport = (id: number) => {
    router.push(`/admin/report/${id}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Loading...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Title/Content</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Reports</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Hidden</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`${item.type === "Blog" ? "bg-blue-100" : "bg-yellow-100"
                      } ${item.hidden ? "text-gray-400" : "text-gray-900"}`}
                  >
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">
                      {item.type === "Blog" ? item.title : item.content}
                    </td>
                    <td className="px-6 py-4">{item.reports}</td>
                    <td className="px-6 py-4">{item.hidden ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleViewReport(item.id)}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                      >
                        View Report
                      </button>
                      {!item.hidden && (
                        <button
                          onClick={() => handleHide(item.id, item.type)}
                          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
                        >
                          Hide
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
