import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import BookingCard from "./components/BookingCard";
import { getBookings } from "./Network/NetworkManager";

const BookingHome = ({ history }) => {
    const [delivered, setDelivered] = useState(null);
    const [booked, setBooked] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getBookings()
                console.log(data);
                const deliveredCards = data.result
                    .filter(x => (x.StatoPrestito === 'Consegnato'))
                    .map(biblio => {
                        return (<BookingCard booking={biblio} book={{}} />)
                    })
                const bookedCards = data.result
                    .filter(x => (x.StatoPrestito === 'Prenotato'))
                    .map(biblio => {
                        return (<BookingCard booking={biblio} book={{}} />)
                    })

                setDelivered(deliveredCards);
                setBooked(bookedCards);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }

        loadData();
    }, []);

    if (loading)
        return (<span>Loading</span>);

    return (
        <div className="bg-gray-200">
            <NavBar />
            <div className="mx-40 my-20">
                <div className="my-16">
                    <span className="text-lg font-bold">Booked: </span>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-20">
                    {booked}
                </div>

                <div className="my-16">
                    <span className="text-lg font-bold">Delivered: </span>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-20">
                    {delivered}
                </div>
            </div>
        </div>
    );
}

export default BookingHome;