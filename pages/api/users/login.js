// GENAI Citation: Used to help structure JWT signature and token payload initialization.

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const access = process.env.JWT_ACCESS_SECRET;
const refresh = process.env.JWT_REFRESH_SECRET;

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });


        if (!user) {
            return res.status(401).json({ error: 'Username does not exist in Prisma DB' });
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return res.status(401).json({ error: 'Password does not match in Prisma DB' });
        }

        const jwtTokenPayload = {
            userId: user.id,
            username: username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
            expiresAt: Math.floor(Date.now() / 1000) + 60 * 5,
        };

        const accessToken = jwt.sign(jwtTokenPayload, access);
        const refreshToken = jwt.sign(jwtTokenPayload, refresh, { expiresIn: '2h' });

        res.status(200).json({
            user,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}