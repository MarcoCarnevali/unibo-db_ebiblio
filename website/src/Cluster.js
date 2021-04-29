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
                    <span className="text-lg font-bold">Cluster</span>
                </div>

                <div className="my-16">
                    <span className="text-lg font-bold">Dati: </span>
                </div>

                <div className="bg-gray-300 p-5 rounded-md">
                    <pre><code>
                        % 4 attributes
                        < br />
                        % 13 instances
                        < br />
                        < br />
                        @RELATION UTENTI_UTILIZZATORI
                        < br />
                        < br />
                        @ATTRIBUTE Email STRING
                        < br />
                        @ATTRIBUTE Eta NUMERIC
                        < br />
                        @ATTRIBUTE Sesso (M, F)
                        < br />
                        @ATTRIBUTE NumPrenotazioni NUMERIC
                        < br />
                        < br />
                        @DATA
                        < br />
                        carla@gmail.com,26,F,0
                        < br />
                        franco@gmail.com,35,M,2
                        < br />
                        gino@gmail.com,35,M,2
                        < br />
                        giovanna@gmail.com,27,F,0
                        < br />
                        luigi@gmail.com,24,M,0
                        < br />
                        marco@gmail.com,53,M,2
                        < br />
                        matteo@gmail.com,23,M,0
                        < br />
                        mauro@gmail.com,30,M,0
                        < br />
                        melissa@gmail.com,28,F,1
                        < br />
                        michele@gmail.com,22,M,2
                        < br />
                        piero@gmail.com,25,M,1
                        < br />
                        tiziano@gmail.com,60,M,5
                        < br />
                        vanessa@gmail.com,29,F,2
                    </code></pre>
                </div>


                <div className="my-16">
                    <span className="text-lg font-bold">ASSEGNAZIONI CON DUE CLUSTER: </span>
                </div>

                <div className="bg-gray-300 p-5 rounded-md">
                    <pre><code>
                        0   carla@gmail.com,26,F,0      cluster1
                        < br />
                        1   franco@gmail.com,35,M,2     cluster0
                        < br />
                        2   gino@gmail.com,35,M,2       cluster0
                        < br />
                        3   giovanna@gmail.com,27,F,0   cluster1
                        < br />
                        4   luigi@gmail.com,24,M,0      cluster0
                        < br />
                        5   marco@gmail.com,53,M,2      cluster0
                        < br />
                        6   matteo@gmail.com,23,M,0     cluster0
                        < br />
                        7   mauro@gmail.com,30,M,0      cluster0
                        < br />
                        8   melissa@gmail.com,28,F,1    cluster1
                        < br />
                        9   michele@gmail.com,22,M,2    cluster0
                        < br />
                        10  piero@gmail.com,25,M,1      cluster0
                        < br />
                        11  tiziano@gmail.com,60,M,5    cluster0
                        < br />
                        12  vanessa@gmail.com,29,F,2    cluster1
                        < br />
                    </code></pre>
                </div>

                <div className="my-16">
                    <span className="text-lg font-bold">ASSEGNAZIONI CON TRE CLUSTER: </span>
                </div>

                <div className="bg-gray-300 p-5 rounded-md">
                    <pre><code>
                        0   carla@gmail.com,26,F,0      cluster1
                        < br />
                        1   franco@gmail.com,35,M,2     cluster0
                        < br />
                        2   gino@gmail.com,35,M,2       cluster0
                        < br />
                        3   giovanna@gmail.com,27,F,0   cluster1
                        < br />
                        4   luigi@gmail.com,24,M,0      cluster2
                        < br />
                        5   marco@gmail.com,53,M,2      cluster0
                        < br />
                        6   matteo@gmail.com,23,M,0     cluster2
                        < br />
                        7   mauro@gmail.com,30,M,0      cluster2
                        < br />
                        8   melissa@gmail.com,28,F,1    cluster1
                        < br />
                        9   michele@gmail.com,22,M,2    cluster2
                        < br />
                        10  piero@gmail.com,25,M,1      cluster2
                        < br />
                        11  tiziano@gmail.com,60,M,5    cluster0
                        < br />
                        12  vanessa@gmail.com,29,F,2    cluster1
                        < br />
                    </code></pre>
                </div>

                <div className="my-16">
                    <span className="text-lg font-bold">ASSEGNAZIONI CON TRE CLUSTER: </span>
                </div>

                <div className="bg-gray-300 p-5 rounded-md">
                    <pre><code>
                        0   carla@gmail.com,26,F,0      cluster1
                        < br />
                        1   franco@gmail.com,35,M,2     cluster0
                        < br />
                        2   gino@gmail.com,35,M,2       cluster0
                        < br />
                        3   giovanna@gmail.com,27,F,0   cluster1
                        < br />
                        4   luigi@gmail.com,24,M,0      cluster2
                        < br />
                        5   marco@gmail.com,53,M,2      cluster0
                        < br />
                        6   matteo@gmail.com,23,M,0     cluster2
                        < br />
                        7   mauro@gmail.com,30,M,0      cluster2
                        < br />
                        8   melissa@gmail.com,28,F,1    cluster1
                        < br />
                        9   michele@gmail.com,22,M,2    cluster2
                        < br />
                        10  piero@gmail.com,25,M,1      cluster2
                        < br />
                        11  tiziano@gmail.com,60,M,5    cluster0
                        < br />
                        12  vanessa@gmail.com,29,F,2    cluster1
                        < br />
                    </code></pre>
                </div>

                <div className="my-16">
                    <span className="text-lg font-bold">ASSEGNAZIONI CON QUATTRO CLUSTER: </span>
                </div>

                <div className="bg-gray-300 p-5 rounded-md">
                    <pre><code>
                        0   carla@gmail.com,26,F,0      cluster1
                        < br />
                        1   franco@gmail.com,35,M,2     cluster0
                        < br />
                        2   gino@gmail.com,35,M,2       cluster0
                        < br />
                        3   giovanna@gmail.com,27,F,0   cluster1
                        < br />
                        4   luigi@gmail.com,24,M,0      cluster2
                        < br />
                        5   marco@gmail.com,53,M,2      cluster0
                        < br />
                        6   matteo@gmail.com,23,M,0     cluster2
                        < br />
                        7   mauro@gmail.com,30,M,0      cluster2
                        < br />
                        8   melissa@gmail.com,28,F,1    cluster1
                        < br />
                        9   michele@gmail.com,22,M,2    cluster2
                        < br />
                        10  piero@gmail.com,25,M,1      cluster2
                        < br />
                        11  tiziano@gmail.com,60,M,5    cluster3
                        < br />
                        12  vanessa@gmail.com,29,F,2    cluster1
                        < br />
                    </code></pre>
                </div>
            </div>
        </div>
    );
}

export default Cluster;