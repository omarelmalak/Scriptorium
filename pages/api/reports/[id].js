// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const userRole = verified.role;

        try {
            const report = await prisma.report.findUnique({
                where: { id: parseInt(id, 10) },
            });

            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }

            let relatedContent = null;
            if (report.parentType === 'blog') {
                relatedContent = await prisma.blog.findUnique({
                    where: { id: report.parentId },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        hidden: true,
                        createdAt: true,
                        updatedAt: true,
                        authorId: true,
                    },
                });
            } else if (report.parentType === 'comment') {
                relatedContent = await prisma.comment.findUnique({
                    where: { id: report.parentId },
                    select: {
                        id: true,
                        content: true,
                        hidden: true,
                        createdAt: true,
                        updatedAt: true,
                        authorId: true,
                    },
                });
            }

            if (!relatedContent) {
                return res.status(404).json({ error: 'Related content not found' });
            }

            if (userRole !== 'ADMIN' && relatedContent.authorId !== verified.userId) {
                return res.status(403).json({ error: 'Forbidden: You are not authorized to view this report' });
            }

            res.status(200).json({
                report: {
                    id: report.id,
                    explanation: report.explanation,
                    parentType: report.parentType,
                    createdAt: report.createdAt,
                },
                relatedContent: {
                    type: report.parentType,
                    ...relatedContent,
                },
            });
        } catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).json({ error: 'An error occurred while fetching the report' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
