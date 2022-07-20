const idGen = length => {
    const chars = "0123456789";
    const charLength = chars.length;
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}

module.exports = idGen;