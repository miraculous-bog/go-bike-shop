require("dotenv").config({path: "../.env"})
const mongoose = require("mongoose")
const {DB_HOST} = process.env

module.exports = class DataBase {
    constructor() {
        mongoose.connect(DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        }, (err) => {if (err) console.log(err)})
        const schema = new mongoose.Schema({
            category: String,
            name: String,
            code: String,
            price: String,
            img: String
        });
        this.product = mongoose.model('product', schema);
    }

    getAll() {
        return this.product.find()
    }

    async getCategories() {
        const categories = await this.product.distinct('category')

        return await Promise.all(
            categories.map(async category => ({name: category, imgLink: (await this.getOneProductByCategory(category)).img}))
        );
    }

    getProductsByCategory(category) {
        return this.product.find({ category })
    }

    getOneProductByCategory(category) {
        return this.product.findOne({category})
    }

    getProductById(_id) {
        return this.product.findOne({ _id })
    }

    setProductById(_id, updatedFields) {
        return this.product.findByIdAndUpdate({ _id }, updatedFields)
    }

    createProduct(fields) {
        return this.product.create(fields)
    }

    deleteProductById(_id) {
        return this.product.findOneAndDelete({ _id })
    }

    async closeConnection() {
        mongoose.connection.close();
    }
}