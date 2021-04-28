import React from "react";
import { getBook, bookDeliver, modifyDeliveredBook } from "../Network/NetworkManager";
const dateFormat = require('dateformat');

export default class BookingCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, book: {}, note: "", inputs: null };
    }

    openModal = async () => {
        console.log(this.props.booking.Note)
        const response = await getBook(this.props.booking.CodLibro);
        this.setState({ showModal: true, book: response.result[0], note: "", inputs: this.state.inputs })
        console.log(dateFormat(this.props.booking.GiornoConsegna, "dd/mm/yyyy"))
    }

    closeModal = () => {
        this.setState({ showModal: false, book: {}, note: "", inputs: null })
    }

    ctaAction = async () => {
        const type = this.state.book.StatoPrestito === "Prenotato" ? "Affidamento" : "Restituzione";
        await bookDeliver(this.props.booking.Prestito, type, this.state.note)
        window.location.reload();
    }

    modifyAction = async () => {
        console.log(this.state.inputs)
        const type = this.state.book.StatoPrestito === "Prenotato" ? "Restituzione" : "Affidamento";
        await modifyDeliveredBook(this.props.booking.Prestito, type, this.state.inputs.note, this.state.inputs.date)
        window.location.reload();
    }

    changeHandler = (e) => {
        var inputs = this.state.inputs
        if (inputs === null) {
            inputs = {}
        }

        inputs[e.target.name] = e.target.value;

        this.setState({ showModal: true, book: this.state.book, note: e.target.value, inputs })
    }

    render() {
        return (
            <>
                <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105" onClick={this.openModal}>
                    <h1 className="text-lg font-bold p-2 md:p-4">
                        <span className="text-black text-lg" href="#">
                            {this.props.booking.EmailUtilizzatore}
                        </span>
                    </h1>

                    <span className="flex items-center text-black text-sm p-2 md:p-4">
                        Library: {this.props.booking.Biblioteca}
                    </span>
                    <span className="flex items-center text-black text-sm p-2 md:p-4">
                        Start Date: {dateFormat(this.props.booking.DataAvvio, "dd/mm/yyyy")}
                    </span>
                    <span className="flex items-center text-black text-sm p-2 md:p-4">
                        End Date: {dateFormat(this.props.booking.DataFine, "dd/mm/yyyy")}
                    </span>

                </article>
                {this.state.showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-4xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                        <h3 className="text-3xl font-semibold ml-5">
                                            {this.state.book.Titolo || ""}
                                        </h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={this.closeModal}
                                        >
                                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                ×
                                        </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto ml-5">
                                        <span>Edition: {this.state.book.Edizione || ""}</span>
                                        <br />
                                        <span>Year: {this.state.book.Anno || ""}</span>
                                        <br />
                                        <span>Pages: {this.state.book.Pagine || ""}</span>
                                        <br />
                                        <span>Shelf: {this.state.book.Scaffale || ""}</span>
                                        <br />
                                        <span>Book Status: {this.state.book.StatoConservazione || ""}</span>
                                    </div>
                                    <div className="relative p-6 flex-auto ml-5">
                                        <span>Date: <input className="border rounded" type="date" name="date" defaultValue={dateFormat(this.props.booking.GiornoConsegna, "yyyy-mm-dd")} onChange={this.changeHandler} /></span>
                                        <br />
                                        <span>Note: <input className="border rounded" name="note" defaultValue={this.props.booking.Note} onChange={this.changeHandler} /></span>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={this.closeModal}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-green-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.modifyAction}
                                            disabled={this.state.inputs === null}
                                        >
                                            Modify
                                        </button>
                                        <button
                                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.ctaAction}
                                        >
                                            {this.state.book.StatoPrestito === "Prenotato" ? "Deliver" : "Return"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>
        )
    }
}