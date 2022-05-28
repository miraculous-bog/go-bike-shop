const {Telegraf} = require('telegraf')
const fs = require("fs")
require("dotenv").config()
const usersFile = "users.txt"
let users = fs.existsSync(usersFile) ? fs.readFileSync(usersFile, {encoding: "utf-8"}).split("\n") : []
users = users.filter(id => !!id)
const {BOT_TOKEN, BOT_LOGIN_TOKEN} = process.env

const bot = new Telegraf(BOT_TOKEN)
bot.start((ctx) => {
    ctx.reply('/login <token>')
})
bot.command("login", (ctx) => {
    const token = ctx.update.message.text.split("/login ")[1]
    const userId = ctx.message.chat.id
    if (users.includes(userId)) return ctx.reply("You are already authorized")
    if (token === BOT_LOGIN_TOKEN) {
        users.push(userId)
        saveUsers(users)
        ctx.reply("Authorized")
    } else {
        ctx.reply("Not authorized: incorrect token")
    }
})

const sendOrder = (order, name, phone, totalPrice, totalUniqueProducts, totalCount) => {
    console.log("sending order")
    users.forEach(async id => {
	if (id) {
	console.log(`sending to user: ${id}`)
        try {
            await bot.telegram.sendMessage(id, `Имя: ${name}\nТелефон: ${phone}`)
            await bot.telegram.sendMessage(id,
                `Всего отдельных едениц: ${totalUniqueProducts}\nВсего товара: ${totalCount}\nЦена: ${totalPrice.toFixed(1)}`)
            for (const product of order) {
                const {img, price, count, name, category, code} = product
                try {
                    if (fs.existsSync(`./public/imgProduct/${img}`)) {
                        await bot.telegram.sendPhoto(id, {source: `./public/imgProduct/${img}`})
                    }
                } catch (err) {
                    console.error(err)
                }
                const message = [`Название: ${name}`, `Код: ${code}`, `Категория: ${category}`,
                    `Цена: ${price}`, `Количество: ${count}`, `Всего: ${(price * count).toFixed(1)}`]
                bot.telegram.sendMessage(id, message.join("\n"))
            }
        } catch (e) {
            console.error(e)
        }
	}
    })
}

const saveUsers = (users) => {
    fs.writeFile(usersFile, users.join("\n"), (err) => {
        if (err) console.log(err)
    })
}
bot.launch()
module.exports = {
    sendOrder,
}
