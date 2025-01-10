// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { blogId, content, parentId } = req.body;
        const verified = verifyToken(req);

        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;

        console.log(userId);

        if (!blogId || !content) {
            return res.status(400).json({ error: 'blogId and content are required' });
        }

        try {
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                return res.status(400).json({ error: 'Invalid userId' });
            }

            const blogExists = await prisma.blog.findUnique({
                where: { id: parseInt(blogId, 10) },
            });
            if (!blogExists) {
                return res.status(400).json({ error: 'Invalid blogId' });
            }

            let parsedParentId = parentId ? parseInt(parentId, 10) : null;

            if (parsedParentId) {
                const parentComment = await prisma.comment.findUnique({
                    where: { id: parsedParentId },
                });
                if (!parentComment) {
                    return res.status(404).json({ error: 'Parent comment not found' });
                }
            }

            const newComment = await prisma.comment.create({
                data: {
                    content,
                    parentId: parsedParentId,
                    blogId: parseInt(blogId, 10),
                    authorId: userId,
                },
            });

            res.status(201).json({ comment: newComment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while creating the comment' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
