const axios = require('axios');

const address = "http://localhost:8123"

export const getBiblios = async () => {
    const response = await performGET("/getBiblios");
    return response.data;
}

export const getBiblio = async (libraryName) => {
    const response = await performGET(`/library/${libraryName}`);
    return response.data;
}

export const signup = async (mail, psw, SessoUt, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, ProfessioneUt) => {
    const response = await performPOST("/signup", { mail, psw, SessoUt, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, ProfessioneUt });
    return response.data;
}

export const login = async (mail, psw) => {
    const response = await performPOST("/login", { mail, psw });
    return response.data;
}

export const checkLogged = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ebiblio_email=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    else return "not-logged";
}

export const logout = async () => {
    const response = await performGET("/logout");
    return response.data;
}

export const getBooks = async (libraryName) => {
    const response = await performGET(`/library/${libraryName}/books`);
    return response.data;
}

export const getEBooks = async (libraryName) => {
    const response = await performGET(`/library/${libraryName}/ebooks`);
    return response.data;
}

export const getGallery = async (libraryName) => {
    const response = await performGET(`/library/gallery/${libraryName}`);
    return response.data;
}

export const bookBooking = async (bookId) => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performPOST(`/user/booking/book`, { email, bookId });
    return response.data;
}

const performGET = async (path, params) => {
    return axios.get(address + path, {
        params: params,
        withCredentials: true
    });
}

const performPOST = async (path, params) => {
    return await axios({
        method: 'post',
        url: address + path,
        data: params,
        withCredentials: true
    });
}