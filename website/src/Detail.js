import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { BookCard } from "./components/BookCard";
import GalleryCard from "./components/GalleryCard";
import Map from "./components/Map";
import GlassInput from "./components/GlassInput";
import "./style/main.css";
import { useLocation } from "react-router-dom";
import { getBiblio, getBooks, getEBooks, getGallery } from "./Network/NetworkManager";

const informations = (data) => {
    return (
        <div className="mt-5 space-y-1">
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a className="inline-block align-middle">{data.Email}</a>
            </div>
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a className="inline-block align-middle">{data.Indirizzo}</a>
            </div>
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a className="inline-block align-middle" href={data.Sito}>{data.Sito}</a>
            </div>
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a className="inline-block align-middle">1111111111</a>
            </div>
        </div>
    )
}

const perks = () => {
    return (
        <div>
            <div className="space-x-3 mt-5">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <a className="inline-block align-middle">Charge plug</a>
            </div>
            <div className="space-x-3">
                <svg width="24" height="24" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="red">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <a className="inline-block align-middle">Ethernet plug</a>
            </div>
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
    const [loading, setLoading] = useState(true);

    const datePickerChanged = (value) => {
        setBookButtonDisabled(false);
    }

    useEffect(async () => {
        try {
            setLoading(true);
            const data = await getBiblio(ref)
            setData(data.result);

            const booksResponse = await getBooks(ref);
            const booksCards = booksResponse.result.map(x => (<BookCard book={x}/>))
            setBooks(booksCards);

            const eBooksResponse = await getEBooks(ref);
            const eBooksCards = eBooksResponse.result.map(x => (<BookCard book={x}/>))
            setEBooks(eBooksCards)

            const galleryResponse = await getGallery(ref);
            const galleryCards = galleryResponse.result.map(x => (<GalleryCard biblio={x} />));
            setPhotos(galleryCards);

            setLoading(false);
        } catch (error) {
            setData({Nome: "", Lat: 0.0, Lon: 0.0, Indirizzo: "", NoteStoriche: ""})
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
                    {informations(data)}
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
                        <span className="block-inline">Select Date and time: </span>
                        <GlassInput className="block-inline text-black ml-3" textColor="text-black" type="datetime-local" onChange={e => datePickerChanged(e.target.value)} />
                        <button className="block-inline bg-blue-500 text-white p-5 rounded-full ml-10 disabled:opacity-50" disabled={bookButtonDisabled}>Book now!</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;