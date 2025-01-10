// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from "@prisma/client";
import { verifyAdminRole } from "../../../utils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (!verifyAdminRole(req, res)) {
      return;
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
      const groupedReports = await prisma.report.groupBy({
        by: ["parentId", "parentType"],
        _count: {
          id: true,
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          _count: {
            id: "desc",
          },
        },
      });

      const reportedContent = await Promise.all(
        groupedReports.map(async (reportGroup) => {
          const parentContent =
            reportGroup.parentType === "blog"
              ? await prisma.blog.findUnique({
                where: { id: reportGroup.parentId },
                select: {
                  id: true,
                  title: true,
                  hidden: true,
                  createdAt: true,
                },
              })
              : await prisma.comment.findUnique({
                where: { id: reportGroup.parentId },
                select: {
                  id: true,
                  content: true,
                  hidden: true,
                  createdAt: true,
                },
              });

          return {
            id: reportGroup.parentId,
            type: reportGroup.parentType,
            reportCount: reportGroup._count.id,
            parentContent,
          };
        })
      );

      const totalReports = await prisma.report.count();

      res.status(200).json({
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalReports,
        data: reportedContent,
      });
    } catch (error) {
      console.error("Error fetching reported content:", error);
      res.status(500).json({ error: "An error occurred while fetching reported content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
