import React from "react";
import { addBook } from "../Network/NetworkManager";
import GlassInput from "../components/GlassInput";

export default class AddBookButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, isBook: this.props.isBook, inputs: {} };
    }

    handleChange = (e) => {
        var inputs = this.state.inputs
        inputs[e.target.name] = e.target.value
        this.setState({ showModal: true, isBook: this.state.isBook, inputs: inputs })
    }

    openModal = () => {
        console.log("CIAO")
        this.setState({ showModal: true, isBook: this.props.isBook, inputs: {} })
    }

    closeModal = () => {
        this.setState({ showModal: false, isBook: this.props.isBook, inputs: {} })
    }

    addAction = async () => {
        const { title, edition, year, pages, shelf, conservationStatus, lendStatus, dimension, link, genre, author } = this.state.inputs;
        await addBook(this.props.library, title, this.props.isBook, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, link, genre, author)
        window.location.reload();
    }

    render() {
        return (
            <>
                <svg onClick={this.openModal} xmlns="http://www.w3.org/2000/svg" className="ml-5 mt-2 inline-block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
                                            <input className="border rounded font-bold" name="title" placeholder="Title" onChange={this.handleChange} />
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
                                                <span>Edition: <input className="border rounded" name="edition" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Year: <input className="border rounded" name="year" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Genre: <input className="border rounded" name="genre" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Author: <input className="border rounded" name="author" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Pages: <input className="border rounded" name="pages" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Shelf: <input className="border rounded" name="shelf" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Book Status: <input className="border rounded" name="conservationStatus" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Booking Status: <input className="border rounded" name="lendStatus" onChange={this.handleChange} /></span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Edition: <input className="border rounded" name="edition" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Year: <input className="border rounded" name="year" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Genre: <input className="border rounded" name="genre" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Author: <input className="border rounded" name="author" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Size: <input className="border rounded" name="dimension" onChange={this.handleChange} /></span>
                                                <br />
                                                <span>Link: <input className="border rounded" name="link" onChange={this.handleChange} /></span>
                                                <br />
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
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-blue-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-40"
                                            type="button"
                                            onClick={this.addAction}
                                            disabled={false}
                                        >
                                            Add
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