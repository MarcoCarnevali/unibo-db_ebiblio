import React from "react";
import { modifyBook, deleteBook } from "../Network/NetworkManager";
import GlassInput from "../components/GlassInput";

export default class BookCardAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, isBook: !this.props.book.Dimensione, inputs: {} };
    }

    handleChange = (e) => {
        var inputs = this.state.inputs
        inputs[e.target.name] = e.target.value
        this.setState({ showModal: true, isBook: this.state.isBook, inputs: inputs })
    }

    openModal = () => {
        this.setState({ showModal: true, isBook: !this.props.book.Dimensione, inputs: {} })
    }

    closeModal = () => {
        this.setState({ showModal: false, isBook: !this.props.book.Dimensione, inputs: {} })
    }

    modifyAction = async () => {
        const {title, edition, year, pages, shelf, conservationStatus, lendStatus, dimension, link } = this.state.inputs;
        await modifyBook(this.props.library, this.props.book.Codice, title, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, null, link )
        window.location.reload();
    }

    deleteAction = async () => {
        await deleteBook(this.props.library, this.props.book.Codice);
        window.location.reload();
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
                                            <input className="border rounded font-bold" name="title" defaultValue={this.props.book.Titolo} onChange={this.handleChange} />
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
                                                <span>Edition: <input className="border rounded" name="edition" defaultValue={this.props.book.Edizione} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Year: <input className="border rounded" name="year" defaultValue={this.props.book.Anno} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Pages: <input className="border rounded" name="pages" defaultValue={this.props.book.Pagine} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Shelf: <input className="border rounded" name="shelf" defaultValue={this.props.book.Scaffale} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Book Status: <input className="border rounded" name="conservationStatus" defaultValue={this.props.book.StatoConservazione} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Booking Status: <input className="border rounded" name="lendStatus" defaultValue={this.props.book.StatoPrestito} onChange={this.handleChange} /></span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Edition: <input className="border rounded" name="edition" defaultValue={this.props.book.Edizione} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Year: <input className="border rounded" name="year" defaultValue={this.props.book.Anno} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Size: <input className="border rounded" name="dimension" defaultValue={this.props.book.Dimensione} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Link: <input className="border rounded" name="link" defaultValue={this.props.book.Link} onChange={this.handleChange} /></span>
                                                <br />
                                                <span>AccessNumber: {this.props.book.NumeroAccessi}</span>
                                            </>
                                        )}
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
                                            className="bg-red-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.deleteAction}
                                            disabled={false}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.modifyAction}
                                            disabled={false}
                                        >
                                            Modify
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