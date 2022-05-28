const db = new (require("./index.js"))()

const testFunc = async () => {
    const products = await db.getProductsByCategory("Насосы")
    console.log(typeof products)
    products.forEach(async product => console.log((await db.deleteProductById(product._id))))
};

testFunc();