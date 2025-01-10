// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { blogId } = req.query;
    console.log("METHOD:", req.method);

    if (req.method === "POST") {
        console.log('POST request received');
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;
        console.log("got here");

        try {
            const blog = await prisma.blog.findUnique({
                where: { id: parseInt(blogId, 10) },
                select: {
                    id: true,
                    upvotes: true,
                    hidden: true,
                    downvotes: true,
                    upvoters: true,
                    downvoters: true,
                },
            });

            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            if (blog.hidden) {
                return res.status(403).json({ error: 'This blog is hidden and cannot be modified' });
            }

            const alreadyUpvoted = blog.upvoters.some((user) => user.id === userId);
            const alreadyDownvoted = blog.downvoters.some((user) => user.id === userId);

            if (alreadyUpvoted) {
                await prisma.blog.update({
                    where: { id: parseInt(blogId, 10) },
                    data: {
                        upvotes: { decrement: 1 },
                        totalVotes: { decrement: 1 },
                        upvoters: { disconnect: { id: userId } },
                    },
                });

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        upvotedBlogs: { disconnect: { id: parseInt(blogId, 10) } },
                    },
                });

                return res.status(200).json({ message: 'Upvote removed successfully' });
            }

            if (alreadyDownvoted) {
                await prisma.blog.update({
                    where: { id: parseInt(blogId, 10) },
                    data: {
                        upvotes: { increment: 1 },
                        downvotes: { decrement: 1 },
                        upvoters: { connect: { id: userId } },
                        downvoters: { disconnect: { id: userId } },
                    },
                });

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        downvotedBlogs: { disconnect: { id: parseInt(blogId, 10) } },
                        upvotedBlogs: { connect: { id: parseInt(blogId, 10) } },
                    },
                });

                return res.status(200).json({ message: 'Changed vote to upvote' });
            }

            await prisma.blog.update({
                where: { id: parseInt(blogId, 10) },
                data: {
                    upvotes: { increment: 1 },
                    totalVotes: { increment: 1 },
                    upvoters: { connect: { id: userId } },
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    upvotedBlogs: { connect: { id: parseInt(blogId, 10) } },
                },
            });

            res.status(200).json({ message: 'Upvoted successfully' });
        } catch (error) {
            console.error('Error upvoting the blog:', error);
            res.status(500).json({ error: 'An error occurred while upvoting the blog' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
