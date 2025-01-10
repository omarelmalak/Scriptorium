// GENAI Citation: Used for JSON data formatting, pagination, mapping, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken, getUserId } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;
    console.log('Request body:', req.body);

    if (req.method === "GET") {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const userId = getUserId(req);
        // const userId = localStorage.getItem('id');
        // let userId = req.headers["user-header"] || null;
        // console.log("userId: " + userId);



        try {
            const blog = await prisma.blog.findUnique({
                where: { id: parseInt(id) },
                include: {
                    author: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    comments: {
                        skip: parseInt(skip),
                        take: parseInt(limit),
                        orderBy: { createdAt: 'desc' },
                    },
                    tags: {
                        skip: parseInt(skip),
                        take: parseInt(limit),
                        orderBy: { name: 'asc' },
                    },
                    codes: {
                        skip: parseInt(skip),
                        take: parseInt(limit),
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });

            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            console.log(blog.authorId);
            console.log(userId);
            if (blog.hidden && blog.authorId !== userId) {
                console.log("we got here");
                return res.status(403).json({ error: 'Forbidden: This blog is hidden' });
            }

            res.status(200).json({ blog });
        } catch (error) {
            console.error('Error fetching blog:', error);
            res.status(500).json({ error: 'An error occurred while fetching the blog' });
        }
    } else if (req.method === "PUT") {
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;
        const { title, description, tags, codeIds } = req.body;
        console.log("TAGSSSS: ", tags);

        try {
            const blog = await prisma.blog.findUnique({
                where: { id: parseInt(id) },
            });

            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            if (blog.hidden || blog.authorId !== userId) {
                return res.status(403).json({ error: 'Forbidden: You cannot edit this blog' });
            }

            const data = {};
            if (title) data.title = title;
            if (description) data.description = description;

            if (tags) {
                console.log("UPDATING TAGS");

                const tagIds = await Promise.all(
                    tags.map(async (tag) => {
                        const existingTag = await prisma.tag.findUnique({
                            where: { name: tag.trim() },
                        });

                        if (existingTag) {
                            return { id: existingTag.id };
                        } else {
                            const newTag = await prisma.tag.create({
                                data: { name: tag.trim() },
                            });
                            return { id: newTag.id };
                        }
                    })
                );

                data.tags = { connect: tagIds };
            }

            if (codeIds) {
                data.codes = { connect: codeIds.map((id) => ({ id })) };
            }

            const updatedBlog = await prisma.blog.update({
                where: { id: parseInt(id) },
                data,
            });

            res.status(200).json({ blog: updatedBlog });
        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).json({ error: 'An error occurred while updating the blog' });
        }
    } else if (req.method === "DELETE") {
        const verified = verifyToken(req);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;

        try {
            const blog = await prisma.blog.findUnique({
                where: { id: parseInt(id) },
                include: {
                    comments: true,
                    codes: true,
                },
            });

            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            if (blog.hidden || blog.authorId !== userId) {
                return res.status(403).json({ error: 'Forbidden: You cannot delete this blog' });
            }

            await prisma.report.deleteMany({
                where: { parentId: blog.id, parentType: 'blog' },
            });

            const commentIds = blog.comments.map(comment => comment.id);
            await prisma.report.deleteMany({
                where: { parentId: { in: commentIds }, parentType: 'comment' },
            });

            await prisma.comment.deleteMany({
                where: { id: { in: commentIds } },
            });

            await prisma.blog.delete({
                where: { id: parseInt(id) },
            });

            res.status(200).send({ message: 'Successfully deleted blog' });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ error: 'An error occurred while deleting the blog' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
