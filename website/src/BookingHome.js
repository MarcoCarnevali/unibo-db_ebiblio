import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import BookingCard from "./components/BookingCard";
import { getBookings } from "./Network/NetworkManager";

const BookingHome = ({ history }) => {
    const cardTapped = (title) => {
        history.push(`/detail?ref=${title}`)
    }
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        try {
            setLoading(true);
            const data = await getBookings()
            console.log(data);
            const cards = data.result.map(biblio => {
                return (<BookingCard booking={biblio} book={{}} />)
            })
            setData(cards);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }, []);

    if (loading)
        return (<span>Loading</span>);

    return (
        <div className="bg-gray-200">
            <NavBar />
            <div className="mx-40 my-20">
                <div className="my-16">
                    <a className="text-lg font-bold">Bookings: </a>
                </div>
                <div className="grid grid-flow-row grid-cols-3 grid-rows-3 gap-40">
                    {data}
                </div>
            </div>
        </div>
    );
}

export default BookingHome;