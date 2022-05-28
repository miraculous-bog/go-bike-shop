const optionCreator = (category) => {
    return `<option value="${category}">${category}</option>`
}

const productCreator = ({_id, code, name, price, img, category}, index) => (`
    <div class="p-id"><p>${index + 1}</p></div>
    <div class="p-name to-input"><p>${name}</p></div>
    <div class="p-code to-input"><p>${code}</p></div>
    <div class="p-category"><p>${category}</p></div>
    <div class="p-price to-input"><p>${price}</p></div>
    <div class="p-img"><img src="imgProduct/${img}" alt="${name} image"></div>
    <div class="c-del-button">
        <button type="button" data-id="${_id}" class="delete-link need-to-confirm delete-button">✘</button>
    </div>
    <div class="c-edit-button">
        <button data-id="${_id}" data-index="${index}" type="button" class="edit-link need-to-confirm">Изменить</button>
    </div>
`)

const productSelect = document.getElementById("product-select")


const toInputHandler = (e) => {
    const text = e.target.innerText
    const input = document.createElement("textarea")
    input.value = text
    const parent = e.target.classList.contains("to-input") ? e.target : e.target.parentNode
    const child = parent === e.target ? parent.querySelector("p") : e.target
    parent.replaceChild(input, child)
    input.focus()
    input.addEventListener("focusout", (e) => {
        const val = e.target.value
        const p = document.createElement("p")
        p.innerText = val
        parent.replaceChild(p, input)
    })
}

const changeButtonHandler = async (e) => {
    const index = e.target.dataset.index
    const name = productNet.querySelectorAll(".p-name")[index].innerText
    const code = productNet.querySelectorAll(".p-code")[index].innerText
    const price = productNet.querySelectorAll(".p-price")[index].innerText
    const productId = e.target.dataset.id
    await axios.post(`/api/products/${productId}`, {updated: {name, code, price}})
}

const productNet = document.getElementById("product-net")

const deleteButtonHandler = async (e) => {
    e.preventDefault()
    const id = e.target.dataset.id
    await axios.delete(`/api/products/${id}`)
    selectProductHandler({target: {value: productSelect.value}})
}

const selectProductHandler = async (e) => {
    const category = e.target.value
    const products = (await axios.get(`/api/categories/${category}`)).data
    productNet.innerHTML = netHeader + products.map((product, index) => productCreator(product, index))
        .join("\n")
    document.querySelectorAll(".to-input").forEach(el => el.addEventListener("dblclick", toInputHandler))
    document.querySelectorAll(".delete-button").forEach(el => el.addEventListener("click", deleteButtonHandler))
    document.querySelectorAll(".edit-link").forEach(el => el.addEventListener("click", changeButtonHandler))
}

productSelect.addEventListener("change", selectProductHandler)


const adminLoader = async () => {
    const categories = (await axios.get("/api/categories/")).data.map(category => optionCreator(category.name))
        .join("\n")
    document.querySelectorAll(".categories-select").forEach(categorySelector => {
        categorySelector.insertAdjacentHTML("beforeend", categories)
    })
    selectProductHandler({target: productSelect})
}


const netHeader = `
<div class="d-id net-title">Номер</div>
<div class="d-name net-title">Имя товара</div>
<div class="d-code net-title">Код</div>
<div class="d-category net-title">Категория</div>
<div class="d-price net-title">Цена</div>
<div class="d-img net-title">Фото</div>
<div class="d-del net-title">Удалить</div>
<div class="d-ch net-title">Изменить</div>`

adminLoader()

const select = document.getElementById("create-product-category-select")
const nameInput = document.getElementById("create-name")
const codeInput = document.getElementById("create-code")
const priceInput = document.getElementById("create-price")

const createFormHandler = async (e) => {
    e.preventDefault()
    const category = select.value
    const name = nameInput.value
    const code = codeInput.value
    const price = priceInput.value
    const img = ""
    const product = { category, name, code, price, img }
    await axios.post("/api/products/", product)
    if (productSelect.value === category) {
        selectProductHandler({target: {value: category}})
    }
}

document.getElementById("create-product-form").addEventListener("submit", createFormHandler)