// User
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

// Products
export const products = [{
        id: "01075",
        name: "Water",
        description: "Just a good old glass of water.",
        price: 5,
        category: "drinks"
    },
    {
        id: "08053",
        name: "Ugali",
        description: "The maize flour delicacy you know and love.",
        price: 30,
        category: "carbohydrates"
    },
    {
        id: "11540",
        name: "Fresh juice",
        description: "Freshly squeezed orange, mango, pineapple or tamarind juice.",
        price: 30,
        category: "drinks"
    },
    {
        id: "14659",
        name: "Githeri special",
        description: "A delicious mix of githeri and beef stew.",
        price: 70,
        category: "proteins"
    },
    {
        id: "19821",
        name: "Fish",
        description: "Deep fried whole fish straight from the pan.",
        price: 40,
        category: "proteins"
    },
    {
        id: "25352",
        name: "Samosa",
        description: "Tasty beef samosa that goes well with fresh juice.",
        price: 30,
        category: "snacks"
    },
    {
        id: "31072",
        name: "Tilapia",
        description: "Delicious tilapia served stewed or deep fried.",
        price: 100,
        category: "proteins"
    },
    {
        id: "32512",
        name: "Ndengu",
        description: "Nutritious green grams made with tomatoes, carrots and spices.",
        price: 20,
        category: "proteins"
    },
    {
        id: "33249",
        name: "Soda",
        description: "Coca-Cola, Sprite and Fanta (orange or blackcurrant) available.",
        price: 30,
        category: "drinks"
    },
    {
        id: "33688",
        name: "Chapati",
        description: "White and brown chapati available.",
        price: 10,
        category: "carbohydrates"
    },
    {
        id: "43193",
        name: "Beef stew",
        description: "Delicious beef stew made with tomatoes, onions and spices.",
        price: 80,
        category: "proteins"
    },
    {
        id: "46621",
        name: "Mchicha",
        description: "A healthy portion of amaranth.",
        price: 30,
        category: "vegetables"
    },
    {
        id: "52743",
        name: "Tea",
        description: "Freshly brewed black tea (served with milk if desired).",
        price: 20,
        category: "beverages"
    },
    {
        id: "53653",
        name: "Coffee",
        description: "Freshly brewed black coffee.",
        price: 20,
        category: "beverages"
    },
    {
        id: "60256",
        name: "Scrambled eggs",
        description: "Classic scrambled eggs made with onions, salt and black pepper.",
        price: 30,
        category: "proteins"
    },
    {
        id: "63509",
        name: "Githeri",
        description: "A one-pot mix of beans and maize made with tomatoes, onions, carrots and spices.",
        price: 40,
        category: "proteins"
    },
    {
        id: "64212",
        name: "Beans",
        description: "Red beans stewed with tomatoes, onions and spices.",
        price: 20,
        category: "proteins"
    },
    {
        id: "68472",
        name: "Mandazi",
        description: "Soft mandazi that goes well with our delicious tea.",
        price: 5,
        category: "snacks"
    },
    {
        id: "72398",
        name: "Omena",
        description: "Silver cyprinid dish made with tomatoes, onions, green bell pepper and spices.",
        price: 30,
        category: "proteins"
    },
    {
        id: "72663",
        name: "Rice",
        description: "Plain, steamed rice.",
        price: 30,
        category: "carbohydrates"
    },
    {
        id: "74144",
        name: "Chips",
        description: "Freshly cut potato fries straight from the pan.",
        price: 50,
        category: "carbohydrates"
    },
    {
        id: "83132",
        name: "Sukuma wiki",
        description: "Collard greens made with onions and spices.",
        price: 20,
        category: "vegetables"
    },
    {
        id: "84756",
        name: "Pilau",
        description: "Steamed rice mixed with tender beef, cooked in beef broth with an array of spices.",
        price: 100,
        category: "carbohydrates"
    },
    {
        id: "86543",
        name: "Cabbage",
        description: "Cabbage made with onions and spices.",
        price: 20,
        category: "vegetables"
    },
    {
        id: "97676",
        name: "Matumbo",
        description: "Scrumptious intestines made with garlic, bell peppers, onions and spices.",
        price: 40,
        category: "proteins"
    }
];

export const categories = [
    "beverages",
    "carbohydrates",
    "drinks",
    "proteins",
    "snacks",
    "vegetables"
];