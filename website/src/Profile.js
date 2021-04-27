import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SeatCard from "./components/SeatCard"
import BookCardBooked from "./components/BookCardBooked"
import UserMessagesCard from "./components/UserMessagesCard"
import { getUserSeatsBooked, getUserDelivered, getUserLended, getUserMessages, getUserFlags } from "./Network/NetworkManager";

const Profile = ({ history }) => {
    const [seats, setSeats] = useState([]);
    const [delivered, setDelivered] = useState([]);
    const [lended, setLended] = useState([]);
    const [messages, setMessages] = useState([]);
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const seatsResponse = await getUserSeatsBooked()

                const seats = seatsResponse.result.map(x => (<SeatCard seat={x} />))
                setSeats(seats);

                const deliveredResponse = await getUserDelivered();
                const deliveredCards = deliveredResponse.result.map(x => (<BookCardBooked book={x} />));
                setDelivered(deliveredCards);
                const lendedResponse = await getUserLended();
                const lendedCards = lendedResponse.result.map(x => (<BookCardBooked book={x} />));
                setLended(lendedCards);

                const messagesResponse = await getUserMessages();
                const messagesCards = messagesResponse.result.map(x => (<UserMessagesCard message={x} />));
                setMessages(messagesCards);

                const flagsResponse = await getUserFlags();
                const flagsCards = flagsResponse.result.map(x => (<UserMessagesCard message={x} isFlag={true} />));
                setFlags(flagsCards);

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
                {seats.length > 0 ? (
                    <>
                        <div className="my-16">
                            <span className="text-lg font-bold">Seats booked: </span>
                        </div>
                        <div className="grid grid-flow-row grid-cols-3 gap-20">
                            {seats}
                        </div>
                    </>
                ) : (<></>)}

                {delivered.length > 0 ? (
                    <>
                        <div className="my-16">
                            <span className="text-lg font-bold">Books delivered: </span>
                        </div>
                        <div className="grid grid-flow-row grid-cols-3 gap-20">
                            {delivered}
                        </div>
                    </>
                ) : (<></>)}

                {lended.length > 0 ? (
                    <>
                        <div className="my-16">
                            <span className="text-lg font-bold">Books lended: </span>
                        </div>
                        <div className="grid grid-flow-row grid-cols-3 gap-20">
                            {lended}
                        </div>
                    </>
                ) : (<></>)}

                {messages.length > 0 ? (
                    <>
                        <div className="my-16">
                            <span className="text-lg font-bold">Messages from administrators: </span>
                        </div>
                        {messages}
                    </>
                ) : (<></>)}

                {flags.length > 0 ? (
                    <>
                        <div className="my-16">
                            <span className="text-lg font-bold">Flags from administrators: </span>
                        </div>
                        {flags}
                    </>
                ) : (<></>)}

            </div>
        </div>
    );
}

export default Profile;