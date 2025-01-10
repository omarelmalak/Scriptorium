// GENAI Citation: Used to initialize CodeTemplate class, along with CSS styling.

"use client";

import React from "react";
import Link from "next/link";

interface CodeTemplate {
  id: number;
  title: string;
  explanation: string;
  content: string;
  language: string;
  input: string;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
  author: {
    firstName: string;
    lastName: string;
  };
}

interface TemplateCardProps {
  templates: CodeTemplate[];
}

const languageLogos: { [key: string]: string } = {
  javascript:
    "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  python:
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  java: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
  c: "https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg",
  cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
  go: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
  kotlin: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png",
  php: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
  ruby: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg",
  rust: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
  swift: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg",
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  templates,
}: TemplateCardProps) => {
  return (
    <div className="bg-white py-24 sm:py-0">
      <div className="px-6 lg:px-8">
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link href={`/templates/${template.id}`} key={template.id}>
              <article
                key={template.id}
                className="w-full bg-gray-100 rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={languageLogos[template.language.toLowerCase()]}
                  alt={template.language}
                  className="w-full h-32 object-contain bg-gray-50"
                />

                <div className="group relative px-6 pb-6">
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                    {template.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm text-gray-600">
                    {template.explanation}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 p-6 text-xs">
                  {template.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="relative flex items-center gap-x-4 p-6">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {`${template.author.firstName} ${template.author.lastName}`}
                    </p>
                    <p className="text-gray-600">
                      Created:{" "}
                      {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
