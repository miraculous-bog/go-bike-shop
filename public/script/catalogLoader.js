const category = decodeURIComponent(location.hash).split("=")[1]
if (!category) {
    location.assign("/catalog.html#category=Багажники")
    location.reload()
}

const fillCategories = async () => {
    const categories = (await axios.get('/api/categories')).data
    const filterList = document.getElementById('filter-list')
    filterList.insertAdjacentHTML("afterbegin",
        categories.map(({ name }) => `<li class="${name === category ? "activeLi" : ""}">
                                        <button type="button" data-category="${name}" class="category-btn">${ name }</button>
                                      </li>`).join('\n'));
    const toCatalogHandler = (e) => {
        const category = e.target.dataset.category;
        location.assign(`/catalog.html#category=${category}`)
        location.reload()
    }
    [...document.querySelectorAll(".category-btn")].forEach(btn => btn.addEventListener("click", toCatalogHandler))
}

fillCategories()

const setProducts = async (category) => {
    const products = (await axios.get(`/api/categories/${category}`)).data
    document.getElementById("catalog").insertAdjacentHTML("afterbegin",
        products.map(product => productCreator(product)).join("\n"));

    const zoomedImgContainer = document.getElementById("zoom-img-container")
    const zoomedImg = document.getElementById("zoom-img")

    const openZoomedImg = (e) => {
        e.preventDefault()
        zoomedImgContainer.classList.toggle("active")
        zoomedImg.src = e.target.dataset.src
    }

    const closeZoomedImg = (e) => {
        e.preventDefault()
        zoomedImgContainer.classList.toggle("active")
        zoomedImg.src = ""
    }

    zoomedImgContainer.addEventListener("click", closeZoomedImg)
    document.addEventListener("keyup", (e) => {
        e.preventDefault()
        console.dir(e)
        if (e.key === "Escape" || e.key === "Esc") closeZoomedImg(e)
    });

    [...document.querySelectorAll(".product-img")].forEach(img => img.addEventListener("click", openZoomedImg))

    const toCartHandler = (e) => {
        const count = Number.parseInt(
            e.target.closest(".wrapper-item").querySelector(".count-input").value)
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const id = e.target.dataset.id
        const foundIndex = cart.findIndex(product => product['_id'] === id)
        if (foundIndex === -1) cart.push({'_id': id, count})
        else cart[foundIndex].count += count
        localStorage.setItem("cart", JSON.stringify(cart))
    }

    [...document.querySelectorAll(".to-cart-btn")].forEach(btn => btn.addEventListener("click", toCartHandler))

    const changeTotalSum = (e) => {
        e.preventDefault()
        const count = Number.parseInt(e.target.value)
        e.target.closest(".wrapper-item").querySelector(".total-sum").innerText =
            `${(Number.parseFloat(e.target.closest(".wrapper-item")
                .querySelector(".price-span").innerText) * (count || 0)).toFixed(1)}`
    }

    [...document.querySelectorAll(".count-input")].forEach(inp => inp.addEventListener("input", changeTotalSum))
}

const productCreator = ({ _id, code, name, price, img }) => {
    return `
        <div class="item">
            <div class="wrapper-item">
                <div class="product-container">
                    <div class="img-item">
                        <img src="imgProduct/${img}" data-src="imgProduct/${img}" alt="${name}" class="product-img">
                    </div>
                    <div class="info-item">
                        <h1>${name}</h1>
                        <p>${code}</p>
                        <div class="info-item-count">
                            <input class="count-input" value="1" min="1" type="number">
                        </div>
                    </div>
                </div>
                <div class="price-item">
                    <h1 id="width-h"><span>цена за 1шт. $</span><span class="price-span">${Number.parseFloat(price) || 0}</span></h1>
                    <h2><span>итог $</span><span class="total-sum" data-id="${_id}">${Number.parseFloat(price) || 0}</span></h2>
                    <div class="addtocart-item">
                        <button type="button" data-id="${_id}" class="to-cart-btn">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
`}

setProducts(category)

