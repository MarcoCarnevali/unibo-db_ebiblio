import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { Card } from "./components/Card";
import { getBiblios } from "./Network/NetworkManager";
import { Link } from "react-router-dom";

const Home = ({ history }) => {
    const cardTapped = (title) => {
        history.push(`/detail?ref=${title}`)
    }
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
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
        }
        loadData();
    }, []);

    if (loading)
        return (<span>Loading</span>);

    return (
        <div className="bg-gray-200">
            <NavBar />
            <div className="mx-40 my-20">
                <div>
                <Link to="/leaderboard" className="bg-gray-300 p-3 rounded-full font-bold text-black ">Leaderboard</Link>
                <Link to="/cluster" className="bg-gray-300 p-3 rounded-full font-bold text-black ml-5">Cluster</Link>
                </div>
                <div className="my-16">
                    <span className="text-lg font-bold">Libraries in Bologna: </span>
                </div>
                <div className="grid grid-flow-row grid-cols-3 gap-20">
                    {data}
                </div>
            </div>
        </div>
    );
}

export default Home;