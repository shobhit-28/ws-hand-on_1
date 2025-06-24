export type loginResponse = {
    token: string,
    user: {
        name: string,
        email: string,
        _id: string
    }
}

export type loginPayload = {
    email: string,
    password: string
}

export type signupPayload = {
    email: string,
    password: string,
    confirmPassword: string,
    name: string
}

export type signupResponse = {
    token: string,
    user: {
        name: string,
        email: string,
        _id: string
    }
}