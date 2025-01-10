// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyAdminRole } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "PATCH") {
        if (!verifyAdminRole(req, res)) {
            return;
        }

        const { contentId, contentType } = req.body;

        if (!contentId || !contentType) {
            return res.status(400).json({ error: 'Content ID and type are required' });
        }

        if (contentType !== 'blog' && contentType !== 'comment') {
            return res.status(400).json({ error: 'Content type must be either "blog" or "comment"' });
        }

        try {
            if (contentType === 'blog') {
                await prisma.blog.update({
                    where: { id: parseInt(contentId) },
                    data: { hidden: true },
                });
            } else if (contentType === 'comment') {
                await prisma.comment.update({
                    where: { id: parseInt(contentId) },
                    data: { hidden: true },
                });
            }

            res.status(200).json({ message: 'Content has been hidden successfully' });
        } catch (error) {
            console.error('Error hiding content:', error);
            res.status(500).json({ error: 'An error occurred while hiding the content' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
