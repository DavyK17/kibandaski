export const user = (role, ctpr = false) => ({
    id: "7355234",
    email: "thisisan@email.com",
    role,
    cartId: "3599584",
    federatedCredentials: [{
        id: "1234567890",
        provider: "google",
        confirm: ctpr
    }]
});