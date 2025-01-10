// GENAI Citation: Used to define template edit page and button logic.

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "../../../layout/MainLayout";
import MonacoEditor from "@monaco-editor/react";
import { getTemplateById, updateTemplate } from "../../../../api/codeTemplate/fetchTemplateCalls";

interface CodeTemplate {
  id: number;
  title: string;
  explanation: string;
  content: string;
  tags: { id: number; name: string }[];
  input?: string;
  language: string;
}

const EditTemplate: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const templateId = parseInt(id, 10);

  const [template, setTemplate] = useState<CodeTemplate | null>(null);
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const supportedLanguages = [
    "python",
    "javascript",
    "java",
    "c",
    "cpp",
    "go",
    "ruby",
    "php",
    "rust",
    "swift",
    "kotlin",
  ];

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getTemplateById(templateId);
        const templateData = data.codeTemplate;
        setTemplate(templateData);
        setTitle(templateData.title);
        setExplanation(templateData.explanation);
        setContent(templateData.content);
        setTags(
          templateData.tags
            .map((tag: { id: number; name: string }) => tag.name)
            .join(", ")
        );
        setInput(templateData.input || "");
        setLanguage(templateData.language);
      } catch (error) {
        console.error("Error fetching template:", error);
        alert("Failed to load template.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(templateId)) {
      fetchTemplate();
    } else {
      alert("Invalid template ID.");
      setLoading(false);
    }
  }, [templateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTemplate = {
      title,
      explanation,
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      input,
      language,
    };

    try {
      await updateTemplate(templateId, updatedTemplate);
      alert("Template updated successfully!");
      router.push(`/templates/${templateId}`);
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update the template.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Loading...</p>
      </MainLayout>
    );
  }

  if (!template) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Template not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Edit Template</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="explanation"
              className="block text-gray-700 font-medium"
            >
              Explanation
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              rows={4}
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium"
            >
              Code Content
            </label>
            <MonacoEditor
              height="400px"
              language={language}
              value={content}
              onChange={(value) => setContent(value || "")}
              options={{
                theme: "vs-dark",
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-gray-700 font-medium">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div>
            <label htmlFor="input" className="block text-gray-700 font-medium">
              Standard Input (optional)
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-gray-700 font-medium"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              required
            >
              <option value="" disabled>
                Select a language
              </option>
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Template
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditTemplate;
