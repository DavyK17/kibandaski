const capitalise = word => {
    if (typeof word !== "string") throw new Error(`Capitalise: Expected a string but received a ${typeof word}`);
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export default capitalise;