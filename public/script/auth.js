const authForm = document.getElementById('auth')
const passInput = document.getElementById('pass')

const HOST = 'http://localhost:5673'
import axios from 'axios'

const auth = async (token) => {
    try {
        const res = await axios.post(`${HOST}/admin/auth`, {
            token
        })
    } catch (e) {
        console.error(e)
    }
}

authForm.addEventListener('submit', e => {
    e.preventDefault()
    const token = passInput.value
})