const checkPhone = (type, value) => {
    const regex = () => {
        if (type === "general") return /^254((20|4[0-6]|5\d|6([0-2]|[4-9]))\d{7}|1[0-1]\d{7}|7\d{8})$/;
        if (type === "safaricom") return /^254(11[0-5]|7(([0-2]|9)\d|4([0-6]|8)|5[7-9]|6[8-9]))\d{6}$/;
    }

    return value.match(regex()) ? true : false;
};

module.exports = checkPhone;