// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from "@prisma/client";
import { getUserId, verifyToken } from "../../../utils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = getUserId(req);

    try {
      const codeTemplate = await prisma.codeTemplate.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          blogs: {
            skip,
            take: parseInt(limit, 10),
            orderBy: { createdAt: "desc" },
          },
          tags: {
            skip,
            take: parseInt(limit, 10),
            orderBy: { name: "asc" },
          },
          forkedChildren: true,
          parent: true
        },
      });

      if (!codeTemplate) {
        return res.status(404).json({ error: "Code template not found" });
      }

      res.status(200).json({ codeTemplate });
    } catch (error) {
      console.error("Error fetching code template:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the code template" });
    }
  } else if (req.method === "PUT") {
    const { title, explanation, content, tags, input, language } = req.body; // Accept tags as names
    const id = req.query.id;

    const verified = verifyToken(req);
    console.log("verified", verified);

    if (!verified) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = verified.userId;

    try {
      const existingTemplate = await prisma.codeTemplate.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existingTemplate) {
        return res.status(404).json({ error: "Code template not found" });
      }

      if (existingTemplate.authorId !== userId) {
        return res.status(403).json({
          error: "Forbidden: You are not the author of this code template",
        });
      }

      const data = {};
      if (title !== undefined) data.title = title;
      if (explanation !== undefined) data.explanation = explanation;
      if (content !== undefined) data.content = content;
      if (input !== undefined) data.input = input;
      if (language !== undefined) data.language = language;

      if (tags !== undefined) {
        const tagNames = tags.map((tag) => tag.trim()).filter((tag) => tag);

        const existingTags = await prisma.tag.findMany({
          where: { name: { in: tagNames } },
        });

        const existingTagNames = existingTags.map((tag) => tag.name);

        const newTagNames = tagNames.filter(
          (name) => !existingTagNames.includes(name)
        );

        const newTags = await Promise.all(
          newTagNames.map((name) =>
            prisma.tag.create({
              data: { name },
            })
          )
        );

        const allTags = [...existingTags, ...newTags];

        data.tags = {
          set: allTags.map((tag) => ({ id: tag.id })),
        };
      }

      const updatedTemplate = await prisma.codeTemplate.update({
        where: { id: parseInt(id, 10) },
        data,
        include: { tags: true },
      });

      res.status(200).json({ codeTemplate: updatedTemplate });
    } catch (error) {
      console.error("Error updating code template:", error);

      res.status(500).json({
        error: "An error occurred while updating the code template",
      });
    }
  } else if (req.method === "DELETE") {
    const verified = verifyToken(req);
    if (!verified) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = verified.userId;

    try {
      const codeTemplate = await prisma.codeTemplate.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          blogs: true,
          author: true,
          tags: true,
          parent: true,
        },
      });

      if (!codeTemplate) {
        return res.status(404).json({ error: "Code template not found" });
      }

      if (codeTemplate.authorId !== userId) {
        return res.status(403).json({
          error: "Forbidden: You are not the author of this code template",
        });
      }

      const blogIds = codeTemplate.blogs.map((blog) => blog.id);
      for (const blogId of blogIds) {
        const blog = await prisma.blog.findUnique({
          where: { id: blogId },
          select: { codes: true },
        });

        const updatedCodes = blog.codes.filter(
          (codeId) => codeId !== codeTemplate.id
        );
        await prisma.blog.update({
          where: { id: blogId },
          data: {
            codes: { set: updatedCodes },
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { codes: true },
      });

      const updatedUserCodes = user.codes.filter(
        (codeId) => codeId !== codeTemplate.id
      );
      await prisma.user.update({
        where: { id: userId },
        data: {
          codes: { set: updatedUserCodes },
        },
      });

      if (codeTemplate.parentId) {
        await prisma.codeTemplate.update({
          where: { id: codeTemplate.parentId },
          data: {
            forkedChildren: {
              disconnect: { id: codeTemplate.id },
            },
          },
        });
      }

      await prisma.codeTemplate.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(200).json({ message: "Successfully deleted code template" });
    } catch (error) {
      console.error("Error deleting code template:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the code template" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
