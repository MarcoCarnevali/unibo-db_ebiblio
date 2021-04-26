import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Card } from "../components/Card";
import { getBiblios } from "../Network/NetworkManager";

const HomeAdmin = ({ history }) => {
    const cardTapped = (title) => {
        history.push(`/detailAdmin?ref=${title}`)
    }
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <div className="grid grid-flow-row grid-cols-3 grid-rows-3 gap-40">
                    {data}
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;