// GENAI Citation: Used to create email test regex, JSON data formatting, error checks.

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, firstName, lastName, email, password, phoneNumber, profilePicture } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        try {
            const existingUser = await prisma.user.findUnique({
                where: { username },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            const updateData = {
                firstName: firstName || existingUser.firstName,
                lastName: lastName || existingUser.lastName,
                email: email || existingUser.email,
                phoneNumber: phoneNumber || existingUser.phoneNumber,
                profilePicture: profilePicture || existingUser.profilePicture,
                role: existingUser.role,
            };

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            } else {
                updateData.password = existingUser.password;
            }

            const updatedUser = await prisma.user.update({
                where: { username },
                data: updateData,
            });

            const payload = {
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phoneNumber: updatedUser.phoneNumber,
                profilePicture: updatedUser.profilePicture,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };

            const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET);

            res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedUser,
                token,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while updating the profile' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
