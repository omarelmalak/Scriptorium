// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const userId = req.headers['user-header'] ? parseInt(req.headers['user-header'], 10) : null;

        try {
            const whereCondition = {
                OR: [
                    { hidden: false },
                    ...(userId !== null ? [{ hidden: true, authorId: userId }] : []),
                ],
                codes: {
                    some: {
                        title: {
                            contains: searchTerm.toLowerCase(),
                        },
                    },
                },
            };

            const blogs = await prisma.blog.findMany({
                where: whereCondition,
                include: {
                    tags: true,
                    codes: true,
                    comments: false,
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
            console.error('Error searching blogs by code templates:', error);
            res.status(500).json({ error: 'An error occurred while searching by code templates' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
