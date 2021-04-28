const axios = require('axios');

const address = "http://localhost:8123"

export const getBiblios = async () => {
    const response = await performGET("/libraries");
    return response.data;
}

export const getBiblio = async (libraryName) => {
    const response = await performGET(`/library/${libraryName}`);
    return response.data;
}

export const signup = async (mail, psw, SessoUt, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, ProfessioneUt, TrasportoUt, type) => {
    const response = await performPOST("/signup", { mail, psw, SessoUt, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, ProfessioneUt, TrasportoUt, type });
    return response.data;
}

export const login = async (tipo, mail, psw) => {
    var numberType = 0;
    if (tipo === 'volunteer')
        numberType = 1
    else if (tipo === 'admin')
        numberType = 2

    const response = await performPOST("/login", { tipo: numberType, mail, psw });
    return response.data;
}

export const checkLogged = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ebiblio_email=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    else return "not-logged";
}

export const checkUserType = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ebiblio_userType=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    else return null;
}

export const logout = async () => {
    const response = await performGET("/logout");
    return response.data;
}

export const getBooks = async (libraryName) => {
    const response = await performGET(`/library/${libraryName}/books`);
    return response.data;
}

export const getBook = async (bookId) => {
    const response = await performGET(`/book/${bookId}`);
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

export const getPhones = async (libraryName) => {
    const response = await performGET(`/library/phones/${libraryName}`);
    return response.data;
}

export const getBookings = async (libraryName) => {
    const response = await performGET(`/bookings`);
    console.log(response)
    return response.data;
}

export const bookBooking = async (bookId) => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performPOST(`/user/booking/book`, { email, bookId });
    return response.data;
}

export const bookDeliver = async (bookId, type, note) => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/bookings/deliver/${bookId}`, { email, type, note });
    return response.data;
}

export const checkSeatAvailability = async (libraryName, startTime, endTime, date) => {
    const response = await performGET(`/library/${libraryName}/seats`, { startTime, endTime, date });
    return response.data;
}

export const bookSeat = async (libraryName, startTime, endTime, date, seatId) => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performPOST(`/library/${libraryName}/seat/${seatId}/book`, { startTime, endTime, date, email });
    return response.data;
}

export const modifyBook = async (libraryName, bookId, title, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, nAccess, link, genre, authors) => {
    const userType = checkUserType();
    if (userType === 'admin') { return null }
    const response = await performPOST(`/library/${libraryName}/books/${bookId}/modify`, { title, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, nAccess, link, genre, authors });
    return response.data;
}

export const deleteBook = async (libraryName, bookId) => {
    const userType = checkUserType();
    if (userType === 'admin') { return null }
    const response = await performPOST(`/library/${libraryName}/books/${bookId}/delete`, {});
    return response.data;
}

export const addBook = async (libraryName, title, type, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, link, genre, authors) => {
    const userType = checkUserType();
    if (userType === 'admin') { return null }
    console.log(libraryName)
    const response = await performPOST(`/library/${libraryName}/books/add`, { title, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, type, link, genre, authors });
    return response.data;
}

export const sendMessageToUser = async (title, text, userEmail) => {
    const userType = checkUserType();
    const adminEmail = checkLogged();
    if (userType === 'admin' || adminEmail === 'not-logged') { return null }
    const response = await performPOST(`/user/${userEmail}/message`, { title, text, adminEmail });
    return response.data;
}

export const flagUser = async (text, userEmail) => {
    const userType = checkUserType();
    const adminEmail = checkLogged();
    if (userType === 'admin' || adminEmail === 'not-logged') { return null }
    const response = await performPOST(`/user/${userEmail}/flag`, { text, adminEmail });
    return response.data;
}

export const approveUser = async (userEmail) => {
    const userType = checkUserType();
    if (userType === 'admin') { return null }
    const response = await performPOST(`/user/${userEmail}/approve`, {});
    return response.data;
}

export const getLibrarySeatsBooked = async (libraryName) => {
    const response = await performGET(`/library/${libraryName}/seatsList`, {});
    return response.data;
}

export const getUserSeatsBooked = async () => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/user/${email}/seats`, {});
    return response.data;
}

export const getUserDelivered = async () => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/user/${email}/delivered`, {});
    return response.data;
}

export const getUserLended = async () => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/user/${email}/lended`, {});
    return response.data;
}

export const getAdminLibrary = async () => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/admin/${email}/getLibrary`, {});
    return response.data;
}

export const getBookAuthors = async (bookId) => {
    const response = await performGET(`/book/${bookId}/getAuthors`, {});
    return response.data;
}

export const getEbook = async (bookId) => {
    const response = await performGET(`/ebook/${bookId}`, {});
    return response.data;
}

export const getUserMessages = async () => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/user/${email}/getMessages`, {});
    return response.data;
}

export const getUserFlags = async () => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/user/${email}/getFlags`, {});
    return response.data;
}

export const accessEbook = async (ebookId) => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performGET(`/ebook/${ebookId}/history`, { email });
    return response.data;
}

export const modifyDeliveredBook = async (prestitoId, type, note, date) => {
    const email = checkLogged();
    if (email === 'not-logged') { return null }
    const response = await performPOST(`/bookings/modify/${prestitoId}`, { type, note, date, email });
    return response.data;
}

/* log is an object of what we want to log: e.g. { email:"" }
    "action" is the type of action where the log is fired e.g. "signup"
*/
export const remoteLog = async (action, log) => {
    if (!log.email) {
        log.email = checkLogged();
    }
    const response = await performPOST(`/log`, { action, log });
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