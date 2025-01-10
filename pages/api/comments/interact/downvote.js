// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { commentId } = req.query;

    if (req.method === 'POST') {
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;

        try {
            const comment = await prisma.comment.findUnique({
                where: { id: parseInt(commentId, 10) },
                select: {
                    id: true,
                    upvotes: true,
                    hidden: true,
                    authorId: true,
                    downvotes: true,
                    upvoters: true,
                    downvoters: true,
                },
            });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (comment.hidden && comment.authorId !== userId) {
                return res.status(403).json({ error: 'This comment is hidden' });
            }

            const alreadyDownvoted = comment.downvoters.some((u) => u.id === userId);
            const alreadyUpvoted = comment.upvoters.some((u) => u.id === userId);

            if (alreadyDownvoted) {
                await prisma.comment.update({
                    where: { id: parseInt(commentId, 10) },
                    data: {
                        downvotes: { decrement: 1 },
                        downvoters: { disconnect: { id: userId } },
                    },
                });

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        downvotedComments: { disconnect: { id: parseInt(commentId, 10) } },
                    },
                });

                return res.status(200).json({ message: 'Downvote removed successfully' });
            }

            if (alreadyUpvoted) {
                await prisma.comment.update({
                    where: { id: parseInt(commentId, 10) },
                    data: {
                        upvotes: { decrement: 1 },
                        downvotes: { increment: 1 },
                        upvoters: { disconnect: { id: userId } },
                        downvoters: { connect: { id: userId } },
                    },
                });

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        upvotedComments: { disconnect: { id: parseInt(commentId, 10) } },
                        downvotedComments: { connect: { id: parseInt(commentId, 10) } },
                    },
                });

                return res.status(200).json({ message: 'Changed vote to downvote' });
            }

            await prisma.comment.update({
                where: { id: parseInt(commentId, 10) },
                data: {
                    downvotes: { increment: 1 },
                    downvoters: { connect: { id: userId } },
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    downvotedComments: { connect: { id: parseInt(commentId, 10) } },
                },
            });

            res.status(200).json({ message: 'Downvoted successfully' });
        } catch (error) {
            console.error('Error downvoting the comment:', error);
            res.status(500).json({ error: 'An error occurred while downvoting the comment' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
