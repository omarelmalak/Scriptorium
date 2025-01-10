// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;
        const { content } = req.body;

        try {
            const comment = await prisma.comment.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    hidden: true,
                    authorId: true,
                },
            });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (comment.hidden && comment.authorId !== userId) {
                return res.status(403).json({ error: 'This comment is hidden' });
            }

            if (comment.hidden) {
                return res.status(403).json({ error: 'This comment cannot be edited' });
            }

            const updateData = {};
            if (content !== undefined) updateData.content = content;

            const updatedComment = await prisma.comment.update({
                where: { id: parseInt(id) },
                data: updateData,
            });

            res.status(200).json({ comment: updatedComment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while updating the comment' });
        }
    } else if (req.method === "DELETE") {
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;

        try {
            const comment = await prisma.comment.findUnique({
                where: { id: parseInt(id, 10) },
                select: {
                    id: true,
                    upvoters: { select: { id: true } },
                    downvoters: { select: { id: true } },
                    replies: { select: { id: true } },
                    parentId: true,
                    blogId: true,
                    hidden: true,
                    authorId: true,
                },
            });

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (comment.hidden && comment.authorId !== userId) {
                return res.status(403).json({ error: 'This comment is hidden' });
            }

            const deleteChildren = async (parentId) => {
                const children = await prisma.comment.findMany({
                    where: { parentId },
                    select: {
                        id: true,
                        upvoters: { select: { id: true } },
                        downvoters: { select: { id: true } },
                    },
                });

                for (const child of children) {
                    await deleteChildren(child.id);

                    for (const upvoter of child.upvoters) {
                        await prisma.user.update({
                            where: { id: upvoter.id },
                            data: {
                                upvotedComments: { disconnect: { id: child.id } },
                            },
                        });
                    }

                    for (const downvoter of child.downvoters) {
                        await prisma.user.update({
                            where: { id: downvoter.id },
                            data: {
                                downvotedComments: { disconnect: { id: child.id } },
                            },
                        });
                    }

                    await prisma.report.deleteMany({
                        where: { parentId: child.id },
                    });

                    await prisma.comment.delete({
                        where: { id: child.id },
                    });
                }
            };

            await deleteChildren(comment.id);

            for (const upvoter of comment.upvoters) {
                await prisma.user.update({
                    where: { id: upvoter.id },
                    data: {
                        upvotedComments: { disconnect: { id: comment.id } },
                    },
                });
            }

            for (const downvoter of comment.downvoters) {
                await prisma.user.update({
                    where: { id: downvoter.id },
                    data: {
                        downvotedComments: { disconnect: { id: comment.id } },
                    },
                });
            }

            await prisma.report.deleteMany({
                where: { parentId: comment.id },
            });

            await prisma.comment.delete({
                where: { id: parseInt(id, 10) },
            });

            res.status(200).json({ message: 'Comment and its children deleted' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'An error occurred while deleting the comment' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
