// GENAI Citation: Used to define template page creation and button logic + MonacoEditor initialization.

"use client";

import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import MonacoEditor from "@monaco-editor/react";
import { createTemplate } from "../../../api/codeTemplate/fetchTemplateCalls";

const CreateTemplate: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const handleSaveTemplate = async () => {
    setSaving(true);

    try {
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const templateData = {
        title,
        explanation: description,
        content: code,
        tags: tagList,
        language,
      };

      console.log("Saving template:", templateData);

      const response = await createTemplate(templateData);
      console.log("Response:", response);
      alert(`Template saved successfully! ID: ${response.codeTemplate.id}`);

      setTitle("");
      setDescription("");
      setLanguage("javascript");
      setCode("");
      setTags("");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save the template.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Create New Code Template</h1>

          <div className="mt-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template title"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags, e.g., sorting, algorithms"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="go">Go</option>
              <option value="kotlin">Kotlin</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="rust">Rust</option>
              <option value="swift">Swift</option>
            </select>
          </div>

          <div className="mt-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Code
            </label>
            <div className="mt-1 border rounded-lg shadow">
              <MonacoEditor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  theme: "vs-dark",
                  minimap: { enabled: false },
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveTemplate}
              className={`px-6 py-2 rounded-md transition ${saving
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Template"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateTemplate;
