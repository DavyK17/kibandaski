const url = "/api";

export const Auth = {
    getUser: async() => {
        try {
            let response = await fetch(`${url}/auth/user`);
            if (response.ok) return response.json();
        } catch (err) {
            console.log(err);
        }
    },
    register: async(firstName, lastName, phone, email, password) => {
        try {
            let response = await fetch(`${url}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, phone, email, password })
            });

            if (response.ok) return response.text();
        } catch (err) {
            console.log(err);
        }
    },
    login: async(email, password) => {
        try {
            let response = await fetch(`${url}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) return response.text();
            return response.json();
        } catch (err) {
            console.log(err);
        }
    },
    logout: async() => {
        try {
            let response = await fetch(`${url}/auth/logout`);
            if (response.ok) return response.text();
        } catch (err) {
            console.log(err);
        }
    }
};

export const Admin = {};

export const Customer = {};