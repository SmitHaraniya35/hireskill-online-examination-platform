import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

// generate access token using jwt
export const generateAccessToken = (userId: string, email: string) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_ACCESS_SECRETKEY as string,
        { expiresIn: "1d" }
    )
};

// verify access token using jwt
export const verifyAccessToken = (token: string) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRETKEY as string
    )
}

// generate hashed refresh token id using uuidv4() for storing in database for cross verification
export const generateRefreshTokenId = async () => {
    const refreshTokenId = uuidv4();
    const hashedRefreshTokenId = await bcrypt.hash(refreshTokenId, 10);
    return hashedRefreshTokenId;  
}

// generate refresh token using jwt
export const generateRefreshToken = (userId: string, refreshTokenId: string) => {
    return jwt.sign(
        {
            userId,
            refreshTokenId
        },
        process.env.JWT_REFRESH_SECRETKEY as string,
        { expiresIn: "24h" }
    )
};

// verify refresh token using jwt 
export const verifyRefreshToken = (token: string) => {
    const { userId, refreshTokenId } = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRETKEY as string
    ) as {
        userId: string,
        refreshTokenId: string
    }
        
    return { userId, refreshTokenId };
}


