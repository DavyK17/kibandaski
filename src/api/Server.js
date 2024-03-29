const root = "/api";

export const Auth = {
    _url: `${root}/auth`,
    get url() {
        return this._url;
    },
    getUser: async function () {
        try {
            let response = await fetch(`${this.url}/user`);
            if (response.ok) return response.json();
        } catch (err) {
            console.error(err);
        }
    },
    register: async function (firstName, lastName, phone, email, password) {
        try {
            let response = await fetch(`${this.url}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, phone, email, password })
            });

            if (response.status !== 503) return response.text();
        } catch (err) {
            console.error(err);
        }
    },
    confirmThirdPartyRegistration: async function (phone, password) {
        try {
            let response = await fetch(`${this.url}/register/ctpr`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password })
            });

            if (response.status !== 503) {
                if (!response.ok) return response.text();
                return response.json();
            }
        } catch (err) {
            console.error(err);
        }
    },
    login: async function (email, password) {
        try {
            let response = await fetch(`${this.url}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.status !== 503) {
                if (!response.ok) return response.text();
                return response.json();
            }
        } catch (err) {
            console.error(err);
        }
    },
    logout: async function () {
        try {
            let response = await fetch(`${this.url}/logout`);
            if (response.ok) return response.text();
        } catch (err) {
            console.error(err);
        }
    }
};

export const Admin = {
    orders: {
        _url: `${root}/admin/orders`,
        get url() {
            return this._url;
        },
        getOrders: async function (id = null, userId = null) {
            try {
                let url;
                let response;

                if (id) {
                    url = new URL(this.url, window.location);
                    url.search = new URLSearchParams({ id }).toString();

                    response = await fetch(url);
                    if (response.ok) return response.json();
                }

                url = userId ? `${this.url}/${userId}` : this.url;
                response = await fetch(`${url}`);
                if (response.ok) return response.json();
            } catch (err) {
                console.error(err);
            }
        },
        acknowledgeOrder: async function (id) {
            try {
                let url = new URL(`${this.url}/acknowledge`, window.location);
                url.search = new URLSearchParams({ id }).toString();

                let response = await fetch(url);
                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        },
        fulfillOrder: async function (id) {
            try {
                let url = new URL(`${this.url}/fulfill`, window.location);
                url.search = new URLSearchParams({ id }).toString();

                let response = await fetch(url);
                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        }
    },
    products: {
        _url: `${root}/admin/products`,
        get url() {
            return this._url;
        },
        createProduct: async function (name, description, price, category) {
            try {
                let response = await fetch(this.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description, price, category })
                });
                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        },
        updateProduct: async function (id, name, description, price, category) {
            try {
                let url = new URL(this.url, window.location);
                url.search = new URLSearchParams({ id }).toString();

                let response = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description, price, category })
                });
                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        },
        deleteProduct: async function (id) {
            try {
                let url = new URL(this.url, window.location);
                url.search = new URLSearchParams({ id }).toString();

                let response = await fetch(url, { method: "DELETE" });
                if (response.status !== 503) {
                    if (!response.ok) return response.text();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    users: {
        _url: `${root}/admin/users`,
        get url() {
            return this._url;
        },
        getUsers: async function (role = null) {
            try {
                let url = role ? `${this.url}/${role}` : this.url;
                let response = await fetch(`${url}`);
                if (response.ok) return response.json();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

export const Customer = {
    products: {
        _url: `${root}/customer/products`,
        get url() {
            return this._url;
        },
        getProducts: async function () {
            try {
                let response = await fetch(this.url);
                if (response.ok) return response.json();
            } catch (err) {
                console.error(err);
            }
        },
        getCategories: async function () {
            try {
                let response = await fetch(`${this.url}/categories`);
                if (response.ok) return response.json();
            } catch (err) {
                console.error(err);
            }
        }
    },
    orders: {
        _url: `${root}/customer/orders`,
        get url() {
            return this._url;
        },
        getOrders: async function (id = null) {
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
                console.error(err);
            }
        },
        cancelOrder: async function (id) {
            try {
                let url = new URL(`${this.url}/cancel`, window.location);
                url.search = new URLSearchParams({ id }).toString();

                let response = await fetch(url);
                if (response.status !== 503) {
                    if (!response.ok) return response.text();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    cart: {
        _url: `${root}/customer/cart`,
        get url() {
            return this._url;
        },
        getCart: async function () {
            try {
                let response = await fetch(this.url);
                if (response.ok) return response.json();
            } catch (err) {
                console.error(err);
            }
        },
        addToCart: async function (id, quantity = 1) {
            try {
                let response = await fetch(this.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: id, quantity })
                });

                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        },
        emptyCart: async function (id) {
            try {
                let response = await fetch(this.url, { method: "DELETE" });
                if (response.status !== 503) {
                    if (!response.ok) return response.text();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        },
        checkout: async function (phone) {
            try {
                let response = await fetch(`${this.url}/checkout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone })
                });
                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        },
        item: {
            _url: `${root}/customer/cart/item`,
            get url() {
                return this._url;
            },
            updateItem: async function (id, quantity) {
                try {
                    let url = new URL(this.url, window.location);
                    url.search = new URLSearchParams({ id }).toString();

                    let response = await fetch(url, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ quantity })
                    });
                    if (response.status !== 503) return response.text();
                } catch (err) {
                    console.error(err);
                }
            },
            removeItem: async function (id) {
                try {
                    let url = new URL(this.url, window.location);
                    url.search = new URLSearchParams({ id }).toString();

                    let response = await fetch(url, { method: "DELETE" });
                    if (response.status !== 503) {
                        if (!response.ok) return response.text();
                        return;
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    users: {
        _url: `${root}/customer/account`,
        get url() {
            return this._url;
        },
        getAccount: async function () {
            try {
                let response = await fetch(this.url);
                if (response.ok) return response.json();
            } catch (err) {
                console.error(err);
            }
        },
        updateAccount: async function (firstName = null, lastName = null, phone = null, email = null, currentPassword = null, newPassword = null) {
            try {
                let response = await fetch(this.url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstName, lastName, phone, email, currentPassword, newPassword })
                });
                if (response.status !== 503) return response.text();
            } catch (err) {
                console.error(err);
            }
        },
        deleteAccount: async function () {
            try {
                let response = await fetch(this.url, { method: "DELETE" });
                if (response.status !== 503) {
                    if (!response.ok) return response.text();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        },
        unlinkThirdParty: async function (provider) {
            try {
                let url = new URL(`${this.url}/unlink`, window.location);
                url.search = new URLSearchParams({ provider }).toString();

                let response = await fetch(url, { method: "DELETE" });
                if (response.status !== 503) {
                    if (!response.ok) return response.text();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
};