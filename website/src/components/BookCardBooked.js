import React from "react";
const dateFormat = require('dateformat');

export default class BookCardBooked extends React.Component {
    render() {
        return (
            <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105" onClick={this.openModal}>
                    <h1 className="text-lg p-2 md:p-4">
                        <a className="text-black font-bold">
                            {this.props.book.Titolo}
                        </a>
                    </h1>

                    <a className="flex items-center text-black text-sm p-2 md:p-4">
                        Start Date: {dateFormat(this.props.book.DataAvvio, "dd/mm/yyyy")}
                    </a>
                    <a className="flex items-center text-black text-sm p-2 md:p-4">
                        End Date: {dateFormat(this.props.book.DataFine, "dd/mm/yyyy")}
                    </a>
                    

                </article>
        )
    }
}