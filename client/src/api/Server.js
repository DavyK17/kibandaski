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
        getProducts: async function() {
            try {
                let response = await fetch(this.url);
                if (response.ok) return response.json();
            } catch (err) {
                console.log(err);
            }
        },
        getCategories: async function() {
            try {
                let response = await fetch(`${this.url}/categories`);
                if (response.ok) return response.json();
            } catch (err) {
                console.log(err);
            }
        }
    },
    orders: {
        _url: `${root}/customer/orders`,
        get url() {
            return this._url;
        },
        getOrders: async function(id = null) {
            try {
                let response;

                if (id) {
                    let url = new URL(this.url, window.location);
                    url.search = new URLSearchParams({ id }).toString();

                    response = await fetch(url);
                    if (response.ok) return response.json();
                }

                response = await fetch(this.url);
                if (response.ok) return response.json();
            } catch (err) {
                console.log(err);
            }
        },
        cancelOrder: async function(id) {
            try {
                let url = this.url;
                url.search = new URLSearchParams({ id }).toString();

                let response = await fetch(url, { method: "DELETE" });
                if (response.ok) return response.text();
            } catch (err) {
                console.log(err);
            }
        }
    }
};