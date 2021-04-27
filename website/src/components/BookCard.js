import React from "react";
import { bookBooking, getBookAuthors } from "../Network/NetworkManager";
import GlassInput from "../components/GlassInput";

export class BookCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, isBook: !this.props.book.Dimensione, bookDate: "", authors: "" };
    }

    openModal = async () => {
        this.setState({ showModal: true, isBook: this.state.isBook, bookDate: this.state.bookDate, authors: this.state.authors })

        if (this.state.authors === "") {
            const response = await getBookAuthors(this.props.book.Codice);
            const authorsArray = response.result.map(x => {
                return `${x.Nome} ${x.Cognome}`
            });
            this.setState({ showModal: true, isBook: this.state.isBook, bookDate: this.state.bookDate, authors: authorsArray.toString() })
        }

    }

    closeModal = () => {
        this.setState({ showModal: false, isBook: !this.props.book.Dimensione, bookDate: this.state.bookDate, authors: this.state.authors })
    }

    ctaAction = async () => {
        if (this.state.isBook) {
            const response = await bookBooking(this.props.book.Codice);
            if (response !== null) {
                window.location.reload();
            }
        } else {
            // Redirect to links
        }
    }

    datePickerChanged = (value) => {
        this.setState({ showModal: this.state.showModal, isBook: !this.props.book.Dimensione, bookDate: value })
    }

    render() {
        return (
            <>
                <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105" onClick={this.openModal}>
                    <h1 className="text-lg p-2 md:p-4">
                        <a className="no-underline hover:underline text-black" href="#">
                            {this.props.book.Titolo}
                        </a>
                    </h1>

                    <a className="flex items-center no-underline hover:underline text-black text-sm p-2 md:p-4" href="#">
                        {this.props.book.Edizione}
                    </a>

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
                                            {this.props.book.Titolo}
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
                                        {this.state.isBook ? (
                                            <>
                                                <span>Edition: {this.props.book.Edizione}</span>
                                                <br />
                                                <span>Year: {this.props.book.Anno}</span>
                                                <br />
                                                <span>Genre: {this.props.book.Genere}</span>
                                                <br />
                                                <span>Authors: {this.state.authors}</span>
                                                <br />
                                                <span>Pages: {this.props.book.Pagine}</span>
                                                <br />
                                                <span>Shelf: {this.props.book.Scaffale}</span>
                                                <br />
                                                <span>Book Status: {this.props.book.StatoConservazione}</span>
                                                <br />
                                                <span>Booking Status: {this.props.book.StatoPrestito}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Edition: {this.props.book.Edizione}</span>
                                                <br />
                                                <span>Year: {this.props.book.Anno}</span>
                                                <br />
                                                <span>Authors: {this.state.authors}</span>
                                                <br />
                                                <span>Genre: {this.props.book.Genere}</span>
                                                <br />
                                                <span>Size: {this.props.book.Dimensione}</span>
                                                <br />
                                                <span>AccessNumber: {this.props.book.NumeroAccessi}</span>
                                            </>
                                        )}
                                    </div>
                                    {/* Book section */}
                                    {!this.state.isBook ? (<></>) : (
                                        <div className="relative p-6 flex-auto ml-5">
                                            <span className="block-inline">Select Date and time: </span>
                                            <br />
                                            <GlassInput className="block-inline text-black ml-3" textColor="text-black" type="datetime-local" onChange={e => this.datePickerChanged(e.target.value)} />
                                        </div>)}
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
                                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.ctaAction}
                                            disabled={this.state.isBook && (this.props.book.StatoConservazione === 'Scadente' || this.props.book.StatoPrestito !== 'Disponibile' || !this.state.bookDate)}
                                        >
                                            {this.state.isBook ? "Book" : "Access"}
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