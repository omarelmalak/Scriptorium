// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { searchTerm, scope } = req.query;

        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        try {
            const codeTemplates = await prisma.codeTemplate.findMany({
                where: {
                    ...(scope === "local" ? { authorId: null } : {}),
                    title: {
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

            res.status(200).json(codeTemplates);
        } catch (error) {
            console.error('Error searching code templates by title:', error);
            res.status(500).json({ error: 'An error occurred while searching by title' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
