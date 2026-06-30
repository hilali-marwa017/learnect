import axios from 'axios'
// creation d'une propre instance axios 
const api = axios.create({
    // url de base d l'api laravel
    baseURL: 'http://localhost:8000/api',
    //entetes envoyees avec chaque requette
    headers: {
        'Content-Type': 'application/json', //les donnees envoyees sont au format JSON
        'Accept': 'application/json',//la reponse attendue est en json
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') //recuperer token
    if (token){
        config.headers.Authorization = `Bearer ${token}` //
    }
    return config
})

api.interceptors.response.use(
    (response) => response, //200 ok
    (error) => {
        if (error.response?.status === 401){//remove token
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login' //rederiction au login 
        }
        return Promise.reject(error)
    }
)

export default api