import React from "react";
import { getBook, bookDeliver } from "../Network/NetworkManager";
import GlassInput from "../components/GlassInput";

export default class BookingCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, book: {}, type: "restituzione", note: "" };
    }

    openModal = async () => {
        const response = await getBook(this.props.booking.CodLibro);
        this.setState({ showModal: true, book: response.result[0], type: "restituzione", note: "" })
    }

    closeModal = () => {
        this.setState({ showModal: false, book: {}, type: "restituzione", note: "" })
    }

    ctaAction = async () => {
        await bookDeliver(this.props.booking.Prestito, this.state.type, this.state.note)
        window.location.reload();
    }

    pickerChanged = (value) => {
        this.setState({ showModal: true, book: this.state.book, type: value.target.value, note: this.state.note })
    }

    noteChanged = (e) => {
        this.setState({ showModal: true, book: this.state.book, type: this.state.type, note: e.target.value })
    }

    render() {
        return (
            <>
                <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105" onClick={this.openModal}>
                    <h1 className="text-lg p-2 md:p-4">
                        <a className="no-underline hover:underline text-black" href="#">
                            {this.props.booking.EmailUtilizzatore}
                        </a>
                    </h1>

                    <a className="flex items-center no-underline hover:underline text-black text-sm p-2 md:p-4" href="#">
                        Library: {this.props.booking.Biblioteca}
                    </a>
                    <a className="flex items-center no-underline hover:underline text-black text-sm p-2 md:p-4" href="#">
                        Status: {this.props.booking.StatoPrestito}
                    </a>
                    <a className="flex items-center no-underline hover:underline text-black text-sm p-2 md:p-4" href="#">
                        Start Date: {this.props.booking.DataAvvio}
                    </a>
                    <a className="flex items-center no-underline hover:underline text-black text-sm p-2 md:p-4" href="#">
                        End Date: {this.props.booking.DataFine}
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
                                        <br />
                                        <span>Booking Status: {this.state.book.StatoPrestito || ""}</span>
                                    </div>
                                    <div className="relative p-6 flex-auto ml-5">
                                        <select className="bg-blue-900 bg-opacity-20 rounded-full border-2 border-white border-opacity-20 text-lg text-white font-medium p-3 outline-none placeholder-white shadow-md" onChange={this.pickerChanged}>
                                            <option value="Restituzione" >Restituzione</option>
                                            <option value="Affidamento" >Affidamento</option>
                                        </select>
                                    </div>
                                    <div className="relative p-6 flex-auto ml-5">
                                        <span className="block-inline">Note: </span>
                                        <br />
                                        <GlassInput className="block-inline text-black ml-3" textColor="text-black" type="text" onChange={this.noteChanged} />
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
                                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.ctaAction}
                                        >
                                            Deliver
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