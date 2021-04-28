import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { BookCard } from "./components/BookCard";
import GalleryCard from "./components/GalleryCard";
import SeatCard from "./components/SeatCard";
import Map from "./components/Map";
import GlassInput from "./components/GlassInput";
import "./style/main.css";
import { useLocation } from "react-router-dom";
import { getBiblio, getBooks, getEBooks, getGallery, getPhones, checkSeatAvailability, bookSeat, checkLogged, remoteLog } from "./Network/NetworkManager";

const informations = (data, phones) => {
    return (
        <div className="mt-5 space-y-1">
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="inline-block align-middle">{data.Email}</span>
            </div>
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="inline-block align-middle">{data.Indirizzo}</span>
            </div>
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="inline-block align-middle" href={data.Sito}>{data.Sito}</span>
            </div>
            {phones}
        </div>
    )
}

const Detail = () => {
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const ref = query.get('ref');
    const [bookButtonDisabled, setBookButtonDisabled] = useState(true);
    const [data, setData] = useState(null);
    const [books, setBooks] = useState(null);
    const [eBooks, setEBooks] = useState(null);
    const [photos, setPhotos] = useState(null);
    const [phones, setPhones] = useState(null);
    const [bookingDates, setBookingDates] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [loading, setLoading] = useState(true);

    const datePickerChanged = (event) => {
        console.log("date: ", event.target.value)
        setBookingDates({ date: event.target.value, startTime: bookingDates?.startTime || null, endTime: bookingDates?.endTime || null })
        if (bookingDates?.startTime && bookingDates?.endTime) {
            setBookButtonDisabled(false);
        }
    }

    const startTimePickerChanged = (event) => {
        console.log("start time: ", event.target.value)
        setBookingDates({ date: bookingDates?.date || null, startTime: event.target.value || null, endTime: bookingDates?.endTime || null })
        if (bookingDates?.date && bookingDates?.endTime) {
            setBookButtonDisabled(false);
        }
    }

    const endTimePickerChanged = (event) => {
        console.log("endTime: ", event.target.value)
        setBookingDates({ date: bookingDates?.date || null, startTime: bookingDates?.startTime || null, endTime: event.target.value })
        if (bookingDates?.date && bookingDates?.startTime) {
            setBookButtonDisabled(false);
        }
    }

    const tappedSeatAvailability = async () => {
        const response = await checkSeatAvailability(ref, bookingDates.startTime, bookingDates.endTime, bookingDates.date)
        const seats = response.result.map(x => (<SeatCard seat={x} onClick={() => bookSeatTapped(x.Num)} />))
        setAvailableSeats(seats)
    }

    const bookSeatTapped = async (seatId) => {
        const email = checkLogged();
        console.log(email)
        if (email === 'not-logged') {
            window.alert('please log-in to book a seat');
            return
        }
        await bookSeat(ref, bookingDates.startTime, bookingDates.endTime, bookingDates.date, seatId);
        await remoteLog('book-seat', { library: ref, startTime: bookingDates.startTime, endTime: bookingDates.endTime, date: bookingDates.date, id: seatId })
        window.location.reload();
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getBiblio(ref)
                setData(data.result);

                const booksResponse = await getBooks(ref);
                const booksCards = booksResponse.result.map(x => (<BookCard book={x} isBook={true} />))
                setBooks(booksCards);

                const eBooksResponse = await getEBooks(ref);
                const eBooksCards = eBooksResponse.result.map(x => (<BookCard book={x} isBook={false} />))
                setEBooks(eBooksCards)

                const galleryResponse = await getGallery(ref);
                const galleryCards = galleryResponse.result.map(x => (<GalleryCard biblio={x} />));
                setPhotos(galleryCards);

                const phoneResponse = await getPhones(ref);
                const phonesDiv = phoneResponse.result.map(x => (<div className="space-x-3">
                    <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="inline-block align-middle">{x.NumTel}</span>
                </div>));
                setPhones(phonesDiv);

                setLoading(false);
            } catch (error) {
                setData({ Nome: "", Lat: 0.0, Lon: 0.0, Indirizzo: "", NoteStoriche: "" })
                setLoading(false);
                console.error(error);
            }
        }
        loadData();
    }, []);

    if (loading)
        return (<span>Loading</span>);

    return (
        <div>
            <NavBar />
            <div className="mx-40 my-20 space-y-10 h-full">
                <div className="my-16">
                    <span className="text-6xl font-bold">{data.Nome}</span>
                    {informations(data, phones)}
                </div>
                <div id="map-container">
                    <Map title={data.Indirizzo} coordinates={[data.Lat, data.Lon]} />
                </div>
                <div id="gallery">
                    <span className="text-3xl font-bold">Gallery</span>
                    <div className="grid mt-5 grid-cols-3 gap-4">
                        {photos}
                    </div>
                </div>
                <div id="books">
                    <span className="text-3xl font-bold">Books</span>
                    <div className="grid mt-5 grid-cols-3 gap-4">
                        {books}
                    </div>
                </div>
                <div id="ebooks">
                    <span className="text-3xl font-bold">eBooks</span>
                    <div className="grid mt-5 grid-cols-3 gap-4">
                        {eBooks}
                    </div>
                </div>
                <div id="note">
                    <span className="text-3xl font-bold">Note</span>
                    <div className="mt-5">
                        <span className="block-inline">{data.NoteStoriche}</span>
                    </div>
                </div>
                <div id="book">
                    <span className="text-3xl font-bold">Book</span>
                    <div className="mt-5">
                        <span className="block-inline">Select Date: </span>
                        <GlassInput title="date" className="block-inline text-black ml-3" textColor="text-black" type="date" min={new Date().toISOString().slice(0, 10)} onChange={datePickerChanged} />
                    </div>
                    <div className="mt-5">
                        <span className="block-inline">Select Start time: </span>
                        <GlassInput className="block-inline text-black ml-3" textColor="text-black" type="time" onChange={startTimePickerChanged} />
                    </div>
                    <div className="mt-5">
                        <span className="block-inline">Select End time: </span>
                        <GlassInput className="block-inline text-black ml-3" textColor="text-black" type="time" onChange={endTimePickerChanged} />
                    </div>
                    <div className="mt-5">
                        <button className="block-inline bg-blue-500 text-white p-5 rounded-full disabled:opacity-50" disabled={bookButtonDisabled} onClick={tappedSeatAvailability}>Check availability</button>
                    </div>

                    {availableSeats != null ? (
                        <div className="mt-10 disabled:opacity-0" disabled={availableSeats === null}>
                            <span className="font-bold text-lg">Available seats: </span>
                        </div>
                    ) : (<></>)}

                    <div className="grid mt-5 grid-cols-3 gap-4">
                        {availableSeats}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;