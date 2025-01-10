// GENAI Citation: Used to initialize Blog class, CSS styling, and code template mapping.

"use client";
import React from "react";
import Link from "next/link";

interface Blog {
  id: number;
  authorId: number;
  author: {
    firstName: string;
    lastName: string;
  };
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  hidden: boolean;
  tags: { id: number; name: string }[];
  codes: { id: number; title: string }[];
}

interface BlogCardProps {
  blogs: Blog[];
}

const BlogCard: React.FC<BlogCardProps> = ({ blogs }: BlogCardProps) => {
  return (
    <div className="bg-white py-24 sm:py-0">
      <div className="px-6 lg:px-8">
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id}>
              <article
                key={blog.id}
                className="w-full bg-gray-100 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 p-6 text-xs">
                  <time dateTime={blog.createdAt} className="text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </time>

                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="group relative px-6 pb-6">
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                    {blog.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm text-gray-600">
                    {blog.description}
                  </p>
                </div>
                <div className="relative flex items-center gap-x-4 p-6">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {blog.author
                        ? `${blog.author.firstName} ${blog.author.lastName}`
                        : `Author ID: ${blog.authorId}`}
                    </p>
                    <p className="text-gray-600">Upvotes: {blog.upvotes}</p>
                    <p className="text-gray-600">Downvotes: {blog.downvotes}</p>
                  </div>
                </div>
                {blog.codes.length > 0 && (
                  <div className="p-6">
                    <p className="text-sm font-semibold text-gray-900">
                      Associated Code Templates:
                    </p>
                    <ul className="mt-2 text-sm text-gray-600">
                      {blog.codes.map((template) => (
                        <li key={template.title}>{template.title}</li>
                      ))}

                    </ul>
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

