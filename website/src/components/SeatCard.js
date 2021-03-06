import React from "react";
const dateFormat = require('dateformat');

export default class SeatCard extends React.Component {
    render() {
        return (
            <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105">
                <h1 className="text-lg p-2 md:p-4">
                    <span className="text-black font-bold">
                        Seat Number: {this.props.seat.Num}
                    </span>
                </h1>

                <div className="p-2 md:p-4">
                    <span className="text-black inline-block">Ethernet: </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke={this.props.seat.Ethernet === 1 ? "green" : "red"}>
                        {this.props.seat.Ethernet === 1 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                    </svg>
                </div>

                <div className="p-2 md:p-4">
                    <span className="text-black inline-block">Presa: </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke={this.props.seat.Presa === 1 ? "green" : "red"}>
                        {this.props.seat.Presa === 1 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                    </svg>
                </div>

                {this.props.seat.Giorno ? (
                    <div className="p-2 md:p-4 text-black">
                        <span className="flex items-center text-black text-sm">
                            Date: {dateFormat(this.props.seat.Giorno, "dd/mm/yyyy")}
                        </span>
                        <br />
                        <span className="flex items-center text-black text-sm">
                            Start Time: {this.props.seat.OraInizio.slice(0, -3)}
                        </span>
                        <br />
                        <span className="flex items-center text-black text-sm">
                            End Time: {this.props.seat.OraFine.slice(0, -3)}
                        </span>
                        {this.props.showEmail ? (
                            <>
                                <br />
                                <span className="flex items-center text-black text-sm">
                                    Email: {this.props.seat.EmailUtilizzatore}
                                </span>
                            </>
                        ) : (<></>)}
                    </div>
                ) : (<></>)}

                {!this.props.seat.Giorno ? (
                    <div className="p-2 md:p-4">
                        <button
                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                            type="button"
                            onClick={this.props.onClick}
                        >
                            Book
                    </button>
                    </div>
                ) : (<></>)}
            </article>
        )
    }
}