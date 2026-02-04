import { v4 as uuidv4 } from 'uuid';

export const generateUserId = () => {
    return uuidv4();
}

export const generateResetPasswordOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

export const generateUniqueTestToken = () => {
    const unique_token = uuidv4();
    return unique_token;
}