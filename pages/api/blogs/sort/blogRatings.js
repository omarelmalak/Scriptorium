// GENAI Citation: Used for JSON data formatting, pagination, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { getUserId } from '../../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { filterType, scope, page = 1, limit = 10 } = req.query;

        const userId = getUserId(req);
        let orderField;
        console.log("USER ID: ", userId);

        if (!userId && scope === "local") {
            res.status(405).json({ error: 'Method not allowed' });
        }

        if (filterType === "value") {
            orderField = "upvotes";
        } else if (filterType === "controversial") {
            orderField = "downvotes";
        } else {
            return res.status(400).json({ error: 'Invalid filter type' });
        }

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        try {
            let whereCondition = {
                OR: [
                    { hidden: false },
                    ...(userId !== null ? [{ hidden: true, authorId: userId }] : []),
                ],
            };
            console.log("THIS IS THE SCOPE", scope);
            if (scope === "local" && userId !== null) {
                console.log("WE ARE RIGHT HERE");
                whereCondition = {
                    ...whereCondition,
                    authorId: userId,
                };
            }

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
                orderBy: {
                    [orderField]: 'desc',
                },
                skip: skip,
                take: take,
            });

            const totalBlogs = await prisma.blog.count({
                where: whereCondition,
            });

            res.status(200).json({
                blogs,
                page: parseInt(page),
                limit: take,
                totalBlogs,
                totalPages: Math.ceil(totalBlogs / take),
            });
        } catch (error) {
            console.error('Error fetching blogs:', error);
            res.status(500).json({ error: 'An error occurred while fetching blogs' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
