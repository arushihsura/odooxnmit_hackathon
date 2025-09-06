import { commonrequest } from "./ApiCall";
import { BACKEND_URL } from "./helper";

export const registerfunction = async (data) => {
    return await commonrequest("POST", `${BACKEND_URL}/api/user/register`, data);
};

export const sentOtpFunction = async (data) => {
    return await commonrequest("POST", `${BACKEND_URL}/api/user/sendotp`, data);
};

export const userVerify = async (data) => {
    return await commonrequest("POST", `${BACKEND_URL}/api/user/login`, data);
};
