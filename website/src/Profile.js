import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SeatCard from "./components/SeatCard"
import { getUserSeatsBooked, getUserDelivered, getUserLended } from "./Network/NetworkManager";

const Profile = ({ history }) => {
    const [seats, setSeats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        try {
            setLoading(true);
            const seatsResponse = await getUserSeatsBooked()
            
            const seats = seatsResponse.result.map(x => (<SeatCard seat={x} />))
            setSeats(seats);

            const deliveredResponse = await getUserDelivered();
            console.log("delivered: ",deliveredResponse);

            const lendedResponse = await getUserLended();
            console.log("lended: ",lendedResponse);

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
                    <a className="text-lg font-bold">Seats booked: </a>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-40">
                    {seats}
                </div>
            </div>
        </div>
    );
}

export default Profile;