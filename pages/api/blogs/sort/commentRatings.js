// GENAI Citation: Used for JSON data formatting, pagination, selection, error checks.

import { PrismaClient } from "@prisma/client";
import { getUserId } from "../../../../utils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { blogId, filterType, page = 1, limit = 10 } = req.query;

    const userId = getUserId(req);

    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    let orderField;
    if (filterType === "value") {
      orderField = "upvotes";
    } else if (filterType === "controversial") {
      orderField = "downvotes";
    } else if (filterType === "createdDate") {
      orderField = "id";
    } else {
      return res.status(400).json({ error: "Invalid filter type" });
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    try {
      const comments = await prisma.comment.findMany({
        where: {
          blogId: parseInt(blogId),
          OR: [
            { hidden: false },
            ...(userId !== null ? [{ hidden: true, authorId: userId }] : []),
          ],
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          [orderField]: "desc",
        },
        skip,
        take,
      });

      const totalComments = await prisma.comment.count({
        where: {
          blogId: parseInt(blogId),
          OR: [
            { hidden: false },
            ...(userId !== null ? [{ hidden: true, authorId: userId }] : []),
          ],
        },
      });

      res.status(200).json({
        comments,
        page: parseInt(page),
        limit: take,
        totalComments,
        totalPages: Math.ceil(totalComments / take),
      });
    } catch (error) {
      console.error("Error fetching comments for blog:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching comments" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
