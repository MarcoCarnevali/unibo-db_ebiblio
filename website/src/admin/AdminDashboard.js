import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import BookCardAdmin from "../components/BookCardAdmin";
import AddBookButton from "../components/AddBookButton";
import "../style/main.css";
import { getBiblio, getBooks, getEBooks, getLibrarySeatsBooked, getAdminLibrary, sendMessageToUser, flagUser, approveUser, remoteLog } from "../Network/NetworkManager";
import SeatCard from "../components/SeatCard";

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [books, setBooks] = useState(null);
    const [eBooks, setEBooks] = useState(null);
    const [seats, setSeats] = useState(null);
    const [user, setUser] = useState(null);
    const [manageStatus, setManageStatus] = useState(null);
    const [flagTitle, setFlagTitle] = useState(null);
    const [messageTitle, setMessageTitle] = useState(null);
    const [message, setMessage] = useState(null);
    const [ref, setRef] = useState("");
    const [loading, setLoading] = useState(true);

    const handleChange = async (e) => {
        if (e.target.name === 'user-email') {
            setUser(e.target.value)
        } else if (e.target.name === 'user-message') {
            setMessage(e.target.value)
        } else if (e.target.name === 'user-message-title') {
            setMessageTitle(e.target.value)
        } else if (e.target.name === 'user-flag-title') {
            setFlagTitle(e.target.value)
        }
    }

    const flagUserAction = async () => {
        if (manageStatus === 'flag') {
            await flagUser(flagTitle, user)
            await remoteLog('admin-flag', { flagTitle, user })
            window.location.reload();
        } else {
            setManageStatus('flag')
            setMessage(null)
            setFlagTitle(null)
            setMessageTitle(null)
        }
    }

    const approveUserAction = async () => {
        if (manageStatus === 'approve') {
            await approveUser(user);
            await remoteLog('admin-approve', { user})
            window.location.reload();
        } else {
            setManageStatus('approve')
            setMessage(null)
            setFlagTitle(null)
            setMessageTitle(null)
        }
    }

    const sendMessage = async () => {
        if (manageStatus === 'message') {
            console.log(message)
            await sendMessageToUser(messageTitle, message, user);
            await remoteLog('admin-sendMessage', { messageTitle, message, user })
            window.location.reload();
        } else {
            setManageStatus('message')
            setMessage(null)
            setFlagTitle(null)
            setMessageTitle(null)
        }
    }

    useEffect(async () => {
        try {
            setLoading(true);

            const libraryResponse = await getAdminLibrary();
            const ref = libraryResponse.result[0].NomeBiblioteca
            setRef(libraryResponse.result[0].NomeBiblioteca);

            const data = await getBiblio(ref)
            setData(data.result);

            const booksResponse = await getBooks(ref);
            const booksCards = booksResponse.result.map(x => (<BookCardAdmin book={x} library={ref} />))
            setBooks(booksCards);

            const eBooksResponse = await getEBooks(ref);
            const eBooksCards = eBooksResponse.result.map(x => (<BookCardAdmin book={x} library={ref} />))
            setEBooks(eBooksCards)

            const seatsResponse = await getLibrarySeatsBooked(ref);
            const seatsCards = seatsResponse.result.map(x => (<SeatCard seat={x} showEmail={true} />))
            setSeats(seatsCards)
            setLoading(false);
        } catch (error) {
            setData({ Nome: "", Lat: 0.0, Lon: 0.0, Indirizzo: "", NoteStoriche: "" })
            setLoading(false);
            console.error(error);
        }
    }, []);

    if (loading)
        return (<span>Loading</span>);

    return (
        <div>
            <NavBar />
            <div className="mx-40 my-20 space-y-10 h-full">
                <div className="my-16">
                    <span className="text-6xl font-bold">{data.Nome}</span>
                </div>
                <div id="books">
                    <span className="text-3xl font-bold align-middle">Books</span>
                    <AddBookButton isBook={true} library={ref} />
                    <div className="grid mt-5 grid-cols-3 gap-4">
                        {books}
                    </div>
                </div>
                <div id="ebooks">
                    <span className="text-3xl font-bold align-middle">eBooks</span>
                    <AddBookButton isBook={false} library={ref} />
                    <div className="grid mt-5 grid-cols-3 gap-4">
                        {eBooks}
                    </div>
                </div>
                <div className="my-16">
                    <span className="text-lg font-bold">Seats booked: </span>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-20">
                    {seats}
                </div>

                <div className="my-20">
                    <span className="text-lg font-bold">Manage users: </span>

                    <div className="mt-5">
                        <span>Type the user email: <input className="border rounded ml-2" name="user-email" placeholder="user@email.com" onChange={handleChange} /></span>
                    </div>
                    {manageStatus === 'message' ? (
                        <div className="mt-5">
                            <span>Title:<input className="border rounded align-top ml-2" name="user-message-title" placeholder="Title" onChange={handleChange} /></span>
                            <div className="mt-5">
                                <span>Message:<textarea className="border rounded align-top ml-2" name="user-message" placeholder="Write your message here..." maxLength="300" rows="4" cols="50" onChange={handleChange} /></span>
                            </div>
                        </div>
                    ) : (<></>)}

                    {manageStatus === 'flag' ? (
                        <div className="mt-5">
                            <span>Reason:<input className="border rounded align-top ml-2" name="user-flag-title" placeholder="reason" onChange={handleChange} /></span>
                        </div>
                    ) : (<></>)}

                    <div className="mt-5">
                        <button
                            className="bg-green-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                            type="button"
                            onClick={approveUserAction}
                            disabled={((user === null || user === '') && manageStatus !== 'approve')}
                        >
                            Approve user
                        </button>
                        <button
                            className="bg-red-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                            type="button"
                            onClick={flagUserAction}
                            disabled={(manageStatus !== 'flag' && (user === null || user === '')) || (manageStatus === 'flag' && (flagTitle === null || flagTitle === ''))}
                        >
                            Flag user
                        </button>
                        <button
                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                            type="button"
                            onClick={sendMessage}
                            // ((true || false) && false) || (true && (false || false)) = false || 
                            disabled={((user === null || user === '') && manageStatus !== 'message') || (manageStatus === 'message' && (message === null || message === '' || messageTitle === null || messageTitle === ''))}
                        >
                            Send message
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;