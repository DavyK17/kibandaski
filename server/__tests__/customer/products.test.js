const app = require("../../app");
const server = require("supertest").agent(app);

const endpoint = "/api/customer/products";
describe(endpoint, () => {
    describe("GET /", () => {
        describe("if product ID is not provided", () => {
            it("return 200 status code and array of products", async() => {
                const { statusCode, body } = await server.get(endpoint);
                
                expect(statusCode).toEqual(200);
                expect(Array.isArray(body)).toBe(true);

                if (body.length > 0) {
                    expect(body[0]).toHaveProperty("id");
                    expect(body[0]).toHaveProperty("name");
                    expect(body[0]).toHaveProperty("description");
                    expect(body[0]).toHaveProperty("price");
                    expect(body[0]).toHaveProperty("category");
                }
            });
        });

        describe("if product ID is provided", () => {
            let productId;

            describe("if product exists", () => {
                it("return 200 status code and product details", async() => {
                    productId = "01075";
                    const { statusCode, body } = await server.get(`${endpoint}?id=${productId}`);

                    expect(statusCode).toEqual(200);
                    expect(body).toEqual({
                        id: "01075",
                        name: "Water",
                        description: "Just a good old glass of water.",
                        price: 5,
                        category: "drinks"
                    });
                });
            });

            describe("if product does not exist", () => {
                it("return 404 error", async() => {
                    productId = "00000";
                    const { statusCode } = await server.get(`${endpoint}?id=${productId}`);

                    expect(statusCode).toEqual(404);
                });
            });
        });
    });

    describe("GET /:category", () => {
        it("return 200 status code and array of products in category", async () => {
            let category = "proteins";
            const { statusCode, body } = await server.get(`${endpoint}/${category}`);

            expect(statusCode).toEqual(200);
            expect(Array.isArray(body)).toBe(true);

            if (body.length > 0) {
                expect(body[0]).toHaveProperty("id");
                expect(body[0]).toHaveProperty("name");
                expect(body[0]).toHaveProperty("description");
                expect(body[0]).toHaveProperty("price");
                expect(body[0]).not.toHaveProperty("category");
            }
        });
    });

    describe("GET /categories", () => {
        it("returns 200 status code and array of existing product categories", async () => {
            const { statusCode, body } = await server.get(`${endpoint}/categories`);

            expect(statusCode).toEqual(200);
            expect(Array.isArray(body)).toBe(true);

            if (body.length > 0) expect(typeof body[0]).toBe("string");
        });
    });
});