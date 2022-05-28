const express = require('express')
const app = express()
require('dotenv').config()
const { PORT, ADMIN_PASS } = process.env
const db = new (require("./db/index.js"))()
const { sendOrder } = require("./telegram-bot")

app.use(express.json())
app.use(express.static('public'))

app.post('/api/order', async (req, res) => {
    const { order, name, phone } = req.body
    const finalOrder = await Promise.all(order.map(async ({ _id, count }) =>
        ({...(await db.getProductById(_id))["_doc"], count})))

    let totalPrice = 0
    let totalUniqueProducts = finalOrder.length
    let totalCount = 0

    finalOrder.forEach(({ price, count }) => {
        totalPrice += Number.parseFloat(price || '0') * count
        totalCount += count
    })

    sendOrder(finalOrder, name, phone, totalPrice, totalUniqueProducts, totalCount)
    res.status(200).send("msg")
})

app.get('/api/categories', async (req, res) => {
    const categories = await db.getCategories();
    if (categories) {
        return res.status(200).send(categories)
    }
    res.status(200).send("internal error")
})

app.get('/api/categories/:category', async (req, res) => {
    const { category } = req.params
    const products = await db.getProductsByCategory(category)
    if (products) return res.status(200).send(products)
    res.status(400).send('internal error')
})

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await db.getProductById(id)
    if (product) return res.status(200).send(product)
    res.status(400).send('product not found')
})

app.post('/api/products/:id', async (req, res) => {
    const { id } = req.params
    const { updated } = req.body
    const product = await db.setProductById(id, updated)
    if (product) return res.status(200).send({message: "success"})
    res.status(400).send('product not found')
})

app.post('/api/products', async (req, res) => {
    const product = db.createProduct(req.body)
    if (product) return res.status(200).send(product)
    res.status(400).send('internal error')
})

app.delete('/api/products/:id', async (req, res) => {
    const product = await db.deleteProductById(req.params.id)
    if (product) return res.status(200).send(product)
    res.status(400).send('product not found')
})

app.post('/api/auth', (req, res) => {
    const { pass } = req.body
    if (pass === ADMIN_PASS) return res.status(200).send('/5GZSW2H5UbgP2sLH.html')
    res.status(400).send({message: "Failure"})
})

app.listen(PORT, () => {
    console.log(`Server has started at http://localhost:${PORT}`)
})
