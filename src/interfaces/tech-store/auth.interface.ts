interface LoginBodyI {
    username: string;
    password: string;
}

interface ResponseLoginI {
    id       : string;
    firstName: string;
    lastName : string;
    username : string;
    email    : string;
    token    : string;
}

export {
    LoginBodyI,
    ResponseLoginI,
};