import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import BookCardAdmin from "../components/BookCardAdmin";
import AddBookButton from "../components/AddBookButton";
import GlassInput from "../components/GlassInput";
import "../style/main.css";
import { useLocation } from "react-router-dom";
import { getBiblio, getBooks, getEBooks, getLibrarySeatsBooked } from "../Network/NetworkManager";
import SeatCard from "../components/SeatCard";

const DetailAdmin = () => {
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const ref = query.get('ref');
    const [data, setData] = useState(null);
    const [books, setBooks] = useState(null);
    const [eBooks, setEBooks] = useState(null);
    const [seats, setSeats] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(async () => {
        try {
            setLoading(true);
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
                    <a className="text-6xl font-bold">{data.Nome}</a>
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
                    <a className="text-lg font-bold">Seats booked: </a>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-20">
                    {seats}
                </div>
            </div>
        </div>
    );
}

export default DetailAdmin;