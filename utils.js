// GENAI Citation: Used to define verification utils and user ID fetching.

import jwt from 'jsonwebtoken';

const access = process.env.JWT_ACCESS_SECRET;

export function verifyToken(req) {

    console.log("This is printing from verifyToken");
    const authorization = req.headers['authorization'];
    console.log(authorization);
    if (!authorization) {
        console.log("none");
        return null;
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        console.log("No token");
        return null;
    }

    console.log(token);

    try {
        const verified = jwt.verify(token, access);
        console.log("\n\n\n\n\nverified " + verified);
        return verified;
    } catch (error) {
        console.log(error);
        return null;
    }
}



export function getUserId(req) {
    console.log("Getting user id");
    // console.log(req);
    const authorization = req.headers['authorization'];
    if (!authorization) {
        console.log("in here now: " + authorization);
        return null;
    }
    console.log("authorization " + authorization);
    const token = authorization.split(' ')[1];
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.decode(token);
        return decoded ? decoded.userId : null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}


export function verifyAdminRole(req, res) {
    const verified = verifyToken(req);

    if (!verified) {
        res.status(401).json({ message: 'Not authorized' });
        return false;
    }

    if (verified.role !== 'ADMIN') {
        res.status(403).json({ message: 'Forbidden' });
        return false;
    }

    return true;
}
