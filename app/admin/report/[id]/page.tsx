// GENAI Citation: Used to define RelatedContent class, Report class, useEffect, CSS styling.

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReport } from "../../../../api/reports/fetchReportsCalls";
import MainLayout from "../../../layout/MainLayout";

interface Report {
  id: number;
  explanation: string;
  parentType: string;
}

interface RelatedContent {
  id: number;
  type: "blog" | "comment";
  title?: string;
  description?: string;
  content?: string;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

const ReportDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [report, setReport] = useState<Report | null>(null);
  const [relatedContent, setRelatedContent] = useState<RelatedContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const data = await getReport(Number(id));
        console.log("Fetched Report Data:", data);
        setReport(data.report);
        setRelatedContent(data.relatedContent);
        setError(null);
      } catch (err) {
        console.error("Error fetching report details:", err);
        setError("Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Loading...</p>
      </MainLayout>
    );
  }

  if (error || !report || !relatedContent) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">{error || "Report not found"}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Report Details</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Report Information</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>
                <strong>ID:</strong> {report.id}
              </p>
              <p>
                <strong>Explanation:</strong> {report.explanation}
              </p>
              <p>
                <strong>Type:</strong> {report.parentType.charAt(0).toUpperCase() + report.parentType.slice(1)}
              </p>
            </div>
          </div>

          {relatedContent.type === "blog" && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Blog Content</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p>
                  <strong>ID:</strong> {relatedContent.id}
                </p>
                <p>
                  <strong>Title:</strong> {relatedContent.title}
                </p>
                <p>
                  <strong>Description:</strong> {relatedContent.description}
                </p>
                <p>
                  <strong>Hidden:</strong> {relatedContent.hidden ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(relatedContent.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(relatedContent.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {relatedContent.type === "comment" && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Comment Content</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p>
                  <strong>ID:</strong> {relatedContent.id}
                </p>
                <p>
                  <strong>Content:</strong> {relatedContent.content}
                </p>
                <p>
                  <strong>Hidden:</strong> {relatedContent.hidden ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(relatedContent.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(relatedContent.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportDetails;
