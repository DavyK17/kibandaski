const root = "/api";

export const Auth = {
    url: `${root}/auth`,
    getUser: async() => {
        try {
            let response = await fetch(`${Auth.url}/user`);
            if (response.ok) return response.json();
        } catch (err) {
            console.log(err);
        }
    },
    register: async(firstName, lastName, phone, email, password) => {
        try {
            let response = await fetch(`${Auth.url}/register`, {
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
            let response = await fetch(`${Auth.url}/login`, {
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
            let response = await fetch(`${Auth.url}/logout`);
            if (response.ok) return response.text();
        } catch (err) {
            console.log(err);
        }
    }
};

export const Admin = {};

export const Customer = {};