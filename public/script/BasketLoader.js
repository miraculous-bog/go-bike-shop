const products = JSON.parse(localStorage.getItem("cart"))


const productCreator = (product, count) => {
    const {_id, code, name, price, img} = product
    return `
<div class="item-basket">
    <div class="button-del" data-id="${_id}">
        <div class="button-del-img" data-id="${_id}"></div>
    </div>
    <div class="img-item-bas">
        <img src="imgProduct/${img}" alt="${name} image">
    </div>
    <div class="name-item">
        <h1>${name}</h1>
        <p>${code}</p>
    </div>
    <div class="counter-item">
        <h2 class="count-bar">${count}</h2>
        <div class="button-bas-item">
            <button class="btn-minus" data-id="${_id}">&minus;</button>
            <button class="btn-plus" data-id="${_id}">&plus;</button>
        </div>
    </div>
    <div class="price-item-bas">
        <h2>&#36;<span class="price-span">${price}</span></h2>
    </div>
    <div class="whole-price-item">
        <h2>&#36;<span class="total-sum">${(Number.parseFloat(price || '0') * count).toFixed(1)}</span></h2>
    </div>
</div>
`
}

const fillTotal = () => {

}

const fillCart = async (products) => {
    const basket = document.getElementById("basket-net")
    const resolvedProducts = []
    let totalCount = 0
    let totalPrice = 0
    for (const product of products) {
        const {_id, count} = product
        totalCount += count
        const resProduct = (await axios.get(`/api/products/${_id}`)).data
        totalPrice += Number.parseFloat(resProduct.price || '0') * count
        resolvedProducts.push(productCreator(resProduct, count))
    }
    basket.insertAdjacentHTML("afterbegin", resolvedProducts.join("\n"))

    document.getElementById('totalCountId').innerText =
        `${new Set(products.map(product => product['_id'])).size}`
    document.getElementById('totalCount').innerText = `${totalCount}`
    document.getElementById('totalPrice').innerText = `${totalPrice}`

    const submitCart = (e) => {
        const name = document.getElementById('fname').value
        const phone = document.getElementById('tel').value
        e.preventDefault()
        axios.post('/api/order', {
            order: JSON.parse(localStorage.getItem('cart')),
            name, phone
        })
        location.assign('/thank.html')
    }

    document.querySelectorAll(".button-del")
        .forEach(btn => btn.addEventListener("click", e => {
            e.preventDefault()
            const id = e.target.dataset.id
            const cart = JSON.parse(localStorage.getItem("cart"))
            localStorage.setItem("cart", JSON.stringify(cart.filter(el => el._id !== id)))
            location.reload()
        }))

    const counterBtnListener = sign => e => {
        e.preventDefault()
        const id = e.target.dataset.id
        const cart = JSON.parse(localStorage.getItem("cart"))
        const index = cart.findIndex(el => el._id === id)
        cart[index].count = Math.max(1, cart[index].count + sign)
        e.target.closest(".counter-item").querySelector(".count-bar").innerText = `${cart[index].count}`
        e.target.closest(".item-basket").querySelector(".total-sum").innerText =
            `${(Number.parseFloat(e.target.closest(".item-basket")
                .querySelector(".price-span").innerText || '0') * cart[index].count).toFixed(1)}`
        localStorage.setItem("cart", JSON.stringify(cart))
    }

    document.querySelectorAll(".btn-minus").forEach(btn => btn.addEventListener("click", counterBtnListener(-1)))
    document.querySelectorAll(".btn-plus").forEach(btn => btn.addEventListener("click", counterBtnListener(1)))

    if (localStorage.getItem("cart"))
    document.getElementById("submit-order").addEventListener("click", submitCart)
}


if (products) fillCart(products)
