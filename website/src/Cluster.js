import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { Card } from "./components/Card";
import { getBiblios } from "./Network/NetworkManager";

const Cluster = () => {
    return (
        <div className="bg-gray-200">
            <NavBar />
            <div className="mx-40 my-20">
                <div className="my-16">
                    <span className="text-lg font-bold">Cluster: </span>
                </div>
                
            </div>
        </div>
    );
}

export default Cluster;