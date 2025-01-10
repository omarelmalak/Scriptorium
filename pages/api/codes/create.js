// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { parentId, title, explanation, content, tags = [], language } = req.body;

        console.log("parentId", parentId);
        console.log("title", title);
        console.log("explanation", explanation);
        console.log("content", content);
        console.log("language", language);

        const verified = verifyToken(req);
        console.log("verified", verified);
        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = verified.userId;

        try {

            const author = await prisma.user.findUnique({
                where: { id: parseInt(userId) },
                select: { firstName: true, lastName: true },
            });

            if (!author) {
                return res.status(404).json({ error: 'Author not found' });
            }

            console.log("there exists an author");

            let parentData = {};
            if (parentId) {
                if (title || explanation || content || language) {
                    console.log("are we here");
                    return res.status(401).json({ error: 'Incorrect usage of code template create API' });
                }

                const parentTemplate = await prisma.codeTemplate.findUnique({
                    where: { id: parseInt(parentId) },
                    include: { tags: true },
                });

                if (!parentTemplate) {
                    console.log("object not found");
                    return res.status(404).json({ error: 'Parent code template not found' });
                }

                const titleAdjusted = userId === parentTemplate.authorId
                    ? parentTemplate.title + " (Copy)"
                    : parentTemplate.title;

                parentData = {
                    content: parentTemplate.content,
                    explanation: parentTemplate.explanation,
                    title: titleAdjusted,
                    tags: parentTemplate.tags.map(tag => tag.name),
                    language: parentTemplate.language,
                };
            }
            console.log("parentData");
            console.log(parentData);

            const allTagNames = tags.length > 0 ? tags : parentData.tags || [];

            const existingTags = await prisma.tag.findMany({
                where: { name: { in: allTagNames } },
            });
            const existingTagNames = existingTags.map(tag => tag.name);

            const newTagNames = allTagNames.filter(tagName => !existingTagNames.includes(tagName));
            const newTags = await Promise.all(
                newTagNames.map(name => prisma.tag.create({ data: { name } }))
            );

            const allTagsToConnect = [...existingTags, ...newTags];

            const newCodeTemplate = await prisma.codeTemplate.create({
                data: {
                    title: title || parentData.title,
                    explanation: explanation || parentData.explanation,
                    content: content || parentData.content,
                    authorId: parseInt(userId),
                    parentId: parentId ? parseInt(parentId) : null,
                    language: language || parentData.language,
                    tags: {
                        connect: allTagsToConnect.map(tag => ({ id: tag.id })),
                    },
                },
                include: { tags: true },
            });

            console.log(newCodeTemplate);
            res.status(201).json({
                codeTemplate: newCodeTemplate,
                author: {
                    firstName: author.firstName,
                    lastName: author.lastName,
                },
            });
        } catch (error) {
            console.error('Error creating code template:', error);
            res.status(500).json({ error: 'An error occurred while creating the code template' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
