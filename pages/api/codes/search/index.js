// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from "@prisma/client";
import { getUserId } from "../../../../utils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const {
      category,
      searchTerm,
      page = 1,
      limit = 10,
      scope = "global",
    } = req.query;

    try {
      const userId = getUserId(req);
      const categories = Array.isArray(category)
        ? category.map((cat) => cat.trim())
        : category
          ? category.split(",").map((cat) => cat.trim())
          : [];

      const whereCondition = {
        AND: [],
      };


      if (scope === "local" && userId) {
        whereCondition.AND.push({ authorId: parseInt(userId, 10) });
      }


      if (searchTerm) {
        if (!categories.length) {
          whereCondition.AND.push({
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { explanation: { contains: searchTerm, mode: "insensitive" } },
              { tags: { some: { name: { contains: searchTerm, mode: "insensitive" } } } },
            ],
          });
        } else {
          const categoryFilters = [];
          categories.forEach((cat) => {
            switch (cat) {
              case "title":
                categoryFilters.push({ title: { contains: searchTerm, mode: "insensitive" } });
                break;
              case "explanation":
                categoryFilters.push({ explanation: { contains: searchTerm, mode: "insensitive" } });
                break;
              case "tags":
                categoryFilters.push({
                  tags: { some: { name: { contains: searchTerm, mode: "insensitive" } } },
                });
                break;
              default:
                break;
            }
          });
          whereCondition.AND.push({ OR: categoryFilters });
        }
      }

      const templates = await prisma.codeTemplate.findMany({
        where: whereCondition,
        include: {
          tags: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        take: parseInt(limit, 10),
      });

      const totalTemplates = await prisma.codeTemplate.count({
        where: whereCondition,
      });

      const totalPages = Math.ceil(totalTemplates / parseInt(limit, 10));

      return res.status(200).json({
        results: templates,
        total: totalTemplates,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching templates:", error);
      return res.status(500).json({ error: "An error occurred while fetching templates." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
