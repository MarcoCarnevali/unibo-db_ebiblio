import React from "react";
const dateFormat = require('dateformat');

export default class UserMessagesCard extends React.Component {
    render() {
        return (
            <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur" onClick={this.openModal}>
                <h1 className="text-lg p-2 md:p-4">
                    <span className="text-black font-bold">
                        {this.props.isFlag ? this.props.message.Testo : this.props.message.Titolo}
                    </span>
                </h1>

                <span className="flex items-center text-black text-xs p-2 md:p-4">
                    Date: {dateFormat(this.props.message.Giorno, "dd/mm/yyyy")}
                </span>
                {!this.props.isFlag ? (
                    <span className="flex items-center text-black p-2 md:p-4">
                    {this.props.message.Testo}
                </span>
                ):(<></>)}
            </article>
        )
    }
}