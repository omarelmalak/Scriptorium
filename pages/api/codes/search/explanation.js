// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { searchTerm, scope } = req.query;
        const userId = req.headers['user-header'] ? parseInt(req.headers['user-header'], 10) : null;

        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        try {
            const codes = await prisma.codeTemplate.findMany({
                where: {
                    ...(scope === "local" && userId ? { authorId: userId } : {}),
                    explanation: {
                        contains: searchTerm.toLowerCase(),
                    },
                },
                include: {
                    tags: true,
                    blogs: false,
                    forkedChildren: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });

            res.status(200).json(codes);
        } catch (error) {
            console.error('Error searching codes by explanation:', error);
            res.status(500).json({ error: 'An error occurred while searching by explanation' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
