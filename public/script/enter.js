const form = document.getElementById("pass-form")
const passInput = document.getElementById("pass")

const passSubmitHandler = async (e) => {
    e.preventDefault()
    const pass = passInput.value
    try {
        location.assign((await axios.post('/api/auth', { pass })).data)
    } catch (e) {
        alert("Incorrect password")
    }
}

form.addEventListener("submit", passSubmitHandler)