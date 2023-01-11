const root = "/api";

export const Auth = {
    _url: `${root}/auth`,
    get url() {
        return this._url;
    },
    getUser: async function() {
        try {
            let response = await fetch(`${this.url}/user`);
            if (response.ok) return response.json();
        } catch (err) {
            console.log(err);
        }
    },
    register: async function(firstName, lastName, phone, email, password) {
        try {
            let response = await fetch(`${this.url}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, phone, email, password })
            });

            if (response.ok) return response.text();
        } catch (err) {
            console.log(err);
        }
    },
    login: async function(email, password) {
        try {
            let response = await fetch(`${this.url}/login`, {
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
    logout: async function() {
        try {
            let response = await fetch(`${this.url}/logout`);
            if (response.ok) return response.text();
        } catch (err) {
            console.log(err);
        }
    }
};

export const Admin = {};
export const Customer = {
    products: {
        _url: `${root}/customer/products`,
        get url() {
            return this._url;
        },
        getProducts: async function(category) {
            if (category) {
                if (typeof category !== "string") throw new Error("[Server, getProducts] Category must be a string.");
                category = category.toLowerCase();
            }

            try {
                let url = category ? `${this.url}/${category}` : this.url;
                let response = await fetch(url);
                if (response.ok) return response.json();
            } catch (err) {
                console.log(err);
            }
        },
    }
};