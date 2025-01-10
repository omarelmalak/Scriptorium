// GENAI Citation: Used to help structure JWT signature and token payload initialization, error checks.

import jwt from 'jsonwebtoken';

const access = process.env.JWT_ACCESS_SECRET;
const refresh = process.env.JWT_REFRESH_SECRET;

export default function handler(req, res) {
    if (req.method === "POST") {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'No refresh token passed' });
        }

        try {
            const verified = jwt.verify(refreshToken, refresh);

            const { verifiedUsername, verifiedRole } = verified;

            const jwtTokenPayload = {
                username: verifiedUsername,
                role: verifiedRole,
            };

            const newAccessToken = jwt.sign(
                jwtTokenPayload,
                access,
                { expiresIn: '5m' }
            );

            return res.status(200).json({
                accessToken: newAccessToken,
            });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}