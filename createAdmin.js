// GENAI Citation: Used to setup sample admin user for startup script.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const languages = [
  { language: "python", content: `print('Hello, Python!')` },
  { language: "javascript", content: `console.log('Hello, JavaScript!');` },
  {
    language: "java",
    content: `public class Main { public static void main(String[] args) { System.out.println("Hello, Java!"); } }`,
  },
  {
    language: "c",
    content: `#include <stdio.h>\nint main() { printf("Hello, C!\\n"); return 0; }`,
  },
  {
    language: "cpp",
    content: `#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, C++!" << endl; return 0; }`,
  },
  {
    language: "go",
    content: `package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, Go!") }`,
  },
  { language: "ruby", content: `puts 'Hello, Ruby!'` },
  { language: "php", content: `<?php echo 'Hello, PHP!'; ?>` },
  { language: "rust", content: `fn main() { println!("Hello, Rust!"); }` },
  { language: "swift", content: `print("Hello, Swift!")` },
];

async function seedDatabase() {
  console.log("Starting database seeding...");

  // Helper function to hash passwords
  const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  try {
    console.log("Clearing existing data...");
    await prisma.comment.deleteMany();
    await prisma.blog.deleteMany();
    await prisma.codeTemplate.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Users
    console.log("Creating users...");
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const user = await prisma.user.create({
        data: {
          username: `user${i}`,
          password: await hashPassword(`password${i}`),
          email: `user${i}@example.com`,
          firstName: `First${i}`,
          lastName: `Last${i}`,
          phoneNumber: `555-555-00${i}`,
          role: i === 1 ? "ADMIN" : "USER", // First user is an admin
        },
      });
      users.push(user);
    }

    // 2. Create Tags
    console.log("Creating tags...");
    const tags = [];
    for (let i = 1; i <= 5; i++) {
      const tag = await prisma.tag.create({
        data: {
          name: `Tag${i}`,
        },
      });
      tags.push(tag);
    }

    // 3. Create Blogs
    console.log("Creating blogs...");
    const blogs = [];
    for (let i = 1; i <= 10; i++) {
      const blog = await prisma.blog.create({
        data: {
          title: `Blog Title ${i}`,
          description: `This is the description for Blog ${i}.`,
          authorId: users[i % users.length].id,
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })), // Connect all tags
          },
        },
      });
      blogs.push(blog);
    }

    // 4. Create Code Templates
    console.log("Creating code templates...");
    const templates = [];
    for (let i = 1; i <= 10; i++) {
      const langIndex = (i - 1) % languages.length;
      const { language, content } = languages[langIndex];

      const template = await prisma.codeTemplate.create({
        data: {
          title: `Code Template ${i}`,
          explanation: `This is the explanation for Code Template ${i} in ${language}.`,
          content,
          language,
          input: "Sample Input",
          authorId: users[i % users.length].id,
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })), // Connect all tags
          },
        },
      });
      templates.push(template);
    }

    // 5. Create Comments
    console.log("Creating comments...");
    for (let i = 1; i <= 20; i++) {
      await prisma.comment.create({
        data: {
          content: `This is comment ${i}.`,
          blogId: blogs[i % blogs.length].id,
          authorId: users[i % users.length].id,
        },
      });
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
seedDatabase();
