const owlElementCreator = ({name, imgLink}) => `
    <div class="block-cg">
        <h1>${name}</h1>
        <img src="imgProduct/${imgLink}" alt="${name}">
        <button type="button" class="to-categories-btn" data-category="${name}">В каталог</button>
    </div>
`

const fillCategories = async () => {
    const categories = (await axios.get("/api/categories")).data
    document.getElementById("owl-carousel").insertAdjacentHTML("afterbegin",
        categories.map(category => owlElementCreator(category)).join("\n"))
    // $.getScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js")
    const owl = $("#owl-carousel");
    owl.owlCarousel({
        items: 3,
        margin: 0,
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 3000,
        autoplayHoverPause: true
    });

    const toCatalogHandler = (e) => {
        const category = e.target.dataset.category;
        location.assign(`/catalog.html#category=${category}`)
    }

    [...document.querySelectorAll(".to-categories-btn")]
        .forEach(btn => btn.addEventListener("click", toCatalogHandler))
}

fillCategories()
