// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../utils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const verified = verifyToken(req);

    if (!verified) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { parentId, parentType, explanation } = req.body;

    if (!parentId || !parentType || !explanation) {
      return res
        .status(400)
        .json({ error: "All fields (parentId, parentType, explanation) are required" });
    }

    if (parentType !== "blog" && parentType !== "comment") {
      return res.status(400).json({ error: 'parentType must be either "blog" or "comment"' });
    }

    try {

      if (parentType === "blog") {
        const blogExists = await prisma.blog.findUnique({ where: { id: parseInt(parentId, 10) } });
        if (!blogExists) {
          return res.status(404).json({ error: `Blog with ID ${parentId} does not exist.` });
        }
      } else if (parentType === "comment") {
        const commentExists = await prisma.comment.findUnique({
          where: { id: parseInt(parentId, 10) },
        });
        if (!commentExists) {
          return res.status(404).json({ error: `Comment with ID ${parentId} does not exist.` });
        }
      }


      const report = await prisma.report.create({
        data: {
          explanation,
          parentId: parseInt(parentId, 10),
          parentType,
        },
      });

      res.status(201).json({ message: "Report submitted successfully", report });
    } catch (error) {
      console.error("Error submitting report:", error);
      res
        .status(500)
        .json({ error: "An error occurred while submitting the report", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
