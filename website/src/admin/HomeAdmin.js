import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Card } from "../components/Card";
import { getBiblios, sendMessageToUser, flagUser, approveUser } from "../Network/NetworkManager";

const HomeAdmin = ({ history }) => {
    const cardTapped = (title) => {
        history.push(`/detailAdmin?ref=${title}`)
    }
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [manageStatus, setManageStatus] = useState(null);
    const [flagTitle, setFlagTitle] = useState(null);
    const [messageTitle, setMessageTitle] = useState(null);
    const [message, setMessage] = useState(null);
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
            const data = await getBiblios()
            console.log(data);
            const cards = data.result.map(biblio => {
                return (<Card biblio={biblio} onClick={() => cardTapped(biblio.Nome)} />)
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
                    <a className="text-lg font-bold">Libraries in Bologna: </a>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-40">
                    {data}
                </div>
                <div className="my-20">
                    <a className="text-lg font-bold">Manage users: </a>

                    <div className="mt-5">
                        <span>Type the user email: <input className="border rounded ml-2" name="user-email" placeholder="user@email.com" onChange={handleChange} /></span>
                    </div>
                    {manageStatus === 'message' ? (
                        <div className="mt-5">
                            <span>Title:<input className="border rounded align-top ml-2" name="user-message-title" placeholder="Title" onChange={handleChange} /></span>
                            <div className="mt-5">
                                <span>Message:<textarea className="border rounded align-top ml-2" name="user-message" placeholder="Write your message here..." maxlength="300" rows="4" cols="50" onChange={handleChange} /></span>
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

export default HomeAdmin;