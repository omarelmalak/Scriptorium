// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        let userId = req.headers["user-header"] || null;
        console.log("userId: " + userId);

        try {
            const whereCondition = userId
                ? {
                    OR: [
                        { hidden: false },
                        { hidden: true, authorId: parseInt(userId) },
                    ],
                }
                : { hidden: false };

            const blogs = await prisma.blog.findMany({
                where: whereCondition,
                include: {
                    tags: true,
                    codes: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });

            res.status(200).json(blogs);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).json({ error: "An error occurred while fetching blogs" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
