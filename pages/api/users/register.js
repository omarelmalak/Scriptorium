// GENAI Citation: Used to help structure user creation w/ DB & bcrypt password hashing, error checks.

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_AVATAR_PATH = '/default_avatar.png';

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, password, firstName, lastName, email, phoneNumber } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const hash = await bcrypt.hash(password, 10);

        let role = "USER";

        if (email == "admin@admin.com") {
            role = "ADMIN";
        }

        console.log({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            role: role,
        });

        try {
            const newUser = await prisma.user.create({
                data: {
                    username: username,
                    password: hash,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    profilePicture: DEFAULT_AVATAR_PATH,
                    role: role,
                },
            });
            res.status(201).json({ "message": "Sucessful Registration", user: newUser });
        } catch (error) {
            res.status(400).json({ error: 'Username or email already exists' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
