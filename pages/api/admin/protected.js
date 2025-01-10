// GENAI Citation: Used to simulate verification (NOT USED), checks.

import { verifyToken } from '../../../utils';

export default function handler(req, res) {
    if (req.method === "GET") {
        const verified = verifyToken(req);

        if (!verified) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (verified.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return null;
        }

        return res.status(200).json({
            user: {
                username: verified.username,
                role: verified.role,
            },
        });
    }
}