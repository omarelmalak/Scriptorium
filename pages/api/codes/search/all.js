// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const userId = req.headers["user-header"] || null;
    const scope = req.query.scope || "global";
    try {
      let whereCondition = {};

      if (scope === "local" && userId) {
        whereCondition = {
          authorId: parseInt(userId),
        };
      }


      const codeTemplates = await prisma.codeTemplate.findMany({
        where: whereCondition,
        include: {
          tags: true,
          forkedChildren: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });


      res.status(200).json(codeTemplates);
    } catch (error) {
      console.error("Error fetching code templates:", error);
      res.status(500).json({ error: "An error occurred while fetching code templates" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
