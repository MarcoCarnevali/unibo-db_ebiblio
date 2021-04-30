import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { Card } from "./components/Card";
import { getBookLeaderboard, getEBookLeaderboard, getLibrariesLeaderboard, getVolunteerLeaderboard } from "./Network/NetworkManager";
import Table from "./components/Table";

const Leaderboard = ({ history }) => {
    const [libraries, setLibraries] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [books, setBooks] = useState([]);
    const [ebooks, setEBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const libraries = await getLibrariesLeaderboard()//.result.map(x => (<span>{x}</span>))
            setLibraries(libraries.result)

            const books = await getBookLeaderboard()
            console.log(books)
            setBooks(books.result)

            const ebooks = await getEBookLeaderboard()
            console.log(ebooks)
            setEBooks(ebooks.result)

            const volunteers = await getVolunteerLeaderboard()
            setVolunteers(volunteers.result)

            setLoading(false)
        }
        loadData();
    }, []);

    if (loading)
        return (<span>Loading</span>);

    return (
        <div className="bg-gray-200">
            <NavBar />
            <div className="mx-40 my-10">
                <div className="my-16">
                    <span className="text-lg font-bold"> Libraries with less used seats: </span>
                </div>
                <Table data={libraries} />

                <div className="my-16">
                    <span className="text-lg font-bold">Most booked books: </span>
                </div>
                <Table data={books} />

                <div className="my-16">
                    <span className="text-lg font-bold">Most accessed e-books: </span>
                </div>
                <Table data={ebooks} />

                <div className="my-16">
                    <span className="text-lg font-bold">Volunteers with the highest number of deliveries: </span>
                </div>
                <Table data={volunteers} />
            </div>
        </div>
    );
}

export default Leaderboard;