// GENAI Citation: Used for JSON data formatting, pagination, mapping, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { title, description, tags = [], codeIds = [] } = req.body;
        const verified = verifyToken(req);
        console.log("verified", verified);

        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;
        console.log("userId", userId);
        console.log("THESE ARE THE TAGS", tags);

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        try {
            const existingBlog = await prisma.blog.findUnique({
                where: { title }
            });

            if (existingBlog) {
                return res.status(400).json({ error: 'A blog with that title already exists' });
            }

            const existingTags = await prisma.tag.findMany({
                where: { name: { in: tags } },
            });
            const existingTagNames = existingTags.map(tag => tag.name);

            const newTagNames = tags.filter(tagName => !existingTagNames.includes(tagName));
            const newTags = await Promise.all(
                newTagNames.map(name => prisma.tag.create({ data: { name } }))
            );

            const allTagsToConnect = [...existingTags, ...newTags];

            const validCodeTemplates = await prisma.codeTemplate.findMany({
                where: { id: { in: codeIds } }
            });
            const validCodeTemplateIds = validCodeTemplates.map(template => template.id);

            const newBlog = await prisma.blog.create({
                data: {
                    title,
                    description,
                    authorId: parseInt(userId),
                    tags: {
                        connect: allTagsToConnect.map(tag => ({ id: tag.id })),
                    },
                    codes: {
                        connect: validCodeTemplateIds.map(id => ({ id })),
                    },
                },
            });

            res.status(201).json({ blog: newBlog });
        } catch (error) {
            console.error("Error creating blog:", error);
            res.status(500).json({ error: 'An error occurred while creating the blog' });
        }
    } else {
        console.log("Method not allowed");
        res.status(405).json({ error: 'Method not allowed' });
    }
}

