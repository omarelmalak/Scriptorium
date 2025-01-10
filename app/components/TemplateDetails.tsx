// GENAI Citation: Use to define initialize Template class, language selection, mock template.

"use client";

import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

interface TemplateTag {
  id: number;
  name: string;
}

interface Template {
  id: number;
  authorId: number;
  title: string;
  explanation: string;
  content: string;
  language: string;
  input: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TemplateTag[];
}

const mockTemplate: Template = {
  id: 1,
  authorId: 1,
  title: "Quick Sort Algorithm",
  explanation: "An efficient algorithm for sorting arrays.",
  content: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
  language: "JavaScript",
  input: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: [
    { id: 1, name: "Sorting" },
    { id: 2, name: "Algorithms" },
  ],
};

const TemplateDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
  const templateId = parseInt(params.id, 10);
  const template = templateId === mockTemplate.id ? mockTemplate : null;

  const [code, setCode] = useState(template?.content || "");
  const [input, setInput] = useState(template?.input || "");

  if (!template) {
    return (
      <MainLayout>
        <p className="text-center mt-20 text-gray-500">Template not found</p>
      </MainLayout>
    );
  }

  const handleRunCode = () => {
    alert("This feature is not yet implemented but would execute the code.");
  };

  return (
    <MainLayout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">{template.title}</h1>

          <div className="mt-4 text-gray-600">
            By <span className="font-medium text-gray-900">Author {template.authorId}</span> -{" "}
            <time dateTime={template.createdAt.toISOString()}>
              {new Date(template.createdAt).toLocaleDateString()}
            </time>
          </div>
          <div className="mt-4 flex gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>


          <div className="mt-6">
            <p className="text-lg text-gray-700">{template.explanation}</p>
          </div>


          <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
            <CodeMirror
              value={code}
              height="400px"
              extensions={
                template.language === "JavaScript"
                  ? [javascript()]
                  : template.language === "Python"
                    ? [python()]
                    : []
              }
              onChange={(value) => setCode(value)}
              className="bg-gray-50"
            />
          </div>


          <div className="mt-6">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700">
              Input (optional)
            </label>
            <textarea
              id="input"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter any inputs for the code execution..."
            />
          </div>


          <div className="mt-6 flex gap-4">
            <button
              onClick={handleRunCode}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Run Code
            </button>
            <button
              onClick={() => alert("This feature would save the template.")}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TemplateDetails;
