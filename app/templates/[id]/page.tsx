// GENAI Citation: Used to define template page, including CodeTemplate class initialization, template execution, button and variable logic.

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "../../layout/MainLayout";
import MonacoEditor from "@monaco-editor/react";
import { getTemplateById, executeCode, createTemplate, deleteTemplate } from "../../../api/codeTemplate/fetchTemplateCalls";
import { useUser, UserProvider } from "../../../api/user/userContext";

interface CodeTemplate {
  id: number;
  authorId: number;
  title: string;
  explanation: string;
  content: string;
  language: string;
  input?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: { id: number; name: string }[];
  parent?: { id: number, title: string };
  forkedChildren: { id: number; title: string }[];
}

const TemplateDetailsInterior: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const templateId = parseInt(Array.isArray(params?.id) ? params.id[0] : params?.id || "", 10);

  const { user } = useUser();
  const userId = user ? parseInt(user.userId) : null;

  const [template, setTemplate] = useState<CodeTemplate | null>(null);
  const [code, setCode] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const data = await getTemplateById(templateId);
        setTemplate(data.codeTemplate);
        setCode(data.codeTemplate.content || "");
        setInput(data.codeTemplate.input || "");
        setError(null);
      } catch (err) {
        setError("Failed to load template details.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(templateId)) {
      fetchTemplate();
    } else {
      setError("Invalid template ID.");
      setLoading(false);
    }
  }, [templateId]);

  const handleDeleteTemplate = async () => {
    if (!template) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this template? This action cannot be undone."
    );

    if (confirmDelete) {
      console.log("Deleting template:", template.id);
      try {
        await deleteTemplate(template.id);
        alert("Template deleted successfully!");
        router.push("/templateList");
      } catch (error) {
        console.error("Error deleting template:", error);
        alert("Failed to delete the template.");
      }
    }
  };

  const parseExecutionError = (error: string): string => {
    const cleanError = error
      .replace(/\/.*\/TMP_\d+\.(js|py|java|c|cpp):\d+/g, "")
      .replace(/node:internal\/.*?\n/g, "")
      .replace(/at .*?\n/g, "")
      .trim();

    return cleanError || "An unknown error occurred.";
  };

  const handleRunCode = async () => {
    if (!template) return;

    setRunning(true);
    setOutput("");

    try {
      let payload;

      if (code === template.content && input === template.input) {
        payload = { codeTemplateId: template.id };
      } else {
        payload = {
          language: template.language,
          code: code,
          input: input,
        };
      }

      const result = await executeCode(payload);

      if (result.error) {
        const userFriendlyError = parseExecutionError(result.error);
        setOutput(`Execution Error:\n${userFriendlyError}`);
      } else {
        setOutput(result.output || "No output");
      }
    } catch (error) {
      setOutput("An unexpected error occurred while executing the code.");
    } finally {
      setRunning(false);
    }
  };

  const handleSaveCode = async () => {
    setSaving(true);

    try {
      if (template) {
        const codeData = {
          parentId: template.id,
        };
        const newTemplate = await createTemplate(codeData);
        console.log("NEW TEMPLATE: ", newTemplate);
        alert("Code forked successfully!");
        router.push(`/templates/${newTemplate.codeTemplate.id}`);
      }
    } catch (error) {
      alert("Failed to save the code.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditTemplate = () => {
    router.push(`/templates/edit/${templateId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Loading...</p>
      </MainLayout>
    );
  }

  if (error || !template) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">{error || "Template not found."}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">{template.title}</h1>
            {user && userId === template.authorId && (
              <div className="flex gap-4">
                <button
                  onClick={handleEditTemplate}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md shadow hover:bg-yellow-700"
                >
                  Edit Template
                </button>
                <button
                  onClick={handleDeleteTemplate}
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
                >
                  Delete Template
                </button>
              </div>
            )}
          </div>
          {template.parent && (
            <div className="mt-4">
              <p className="text-gray-700">
                Forked from{" "}
                <a
                  href={`/templates/${template.parent.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {template.parent.title}
                </a>
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {template.tags && template.tags.length > 0 ? (
              template.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No tags available.</p>
            )}
          </div>



          <div className="mt-2">
            <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {template.language.toUpperCase()}
            </span>
          </div>

          <p className="mt-4 text-lg text-gray-700">{template.explanation}</p>

          <div className="mt-6 border rounded-lg shadow">
            <MonacoEditor
              height="400px"
              language={template.language}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                theme: "vs-dark",
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800">Standard Input:</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your code"
              className="mt-2 w-full h-32 p-2 border rounded-lg text-gray-800"
            ></textarea>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleRunCode}
              className={`px-6 py-2 rounded-md transition ${running
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              disabled={running}
            >
              {running ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={handleSaveCode}
              className={`px-6 py-2 rounded-md transition ${saving
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : `Fork Code (${template.forkedChildren ? template.forkedChildren.length : 0})`}
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800">Console Output:</h2>
            <div className="mt-2 p-4 bg-gray-100 border rounded-lg text-gray-800">
              {output || "No output yet."}
            </div>
          </div>

          <div className="mt-8 text-gray-500 text-sm">
            Created:{" "}
            <time dateTime={template.createdAt ? new Date(template.createdAt).toISOString() : ""}>
              {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : "Unknown"}
            </time>{" "}
            | Last Updated:{" "}
            <time dateTime={template.updatedAt ? new Date(template.updatedAt).toISOString() : ""}>
              {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : "Unknown"}
            </time>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const TemplateDetails: React.FC = () => {
  return (
    <UserProvider>
      <TemplateDetailsInterior />
    </UserProvider>
  );
};

export default TemplateDetails;
