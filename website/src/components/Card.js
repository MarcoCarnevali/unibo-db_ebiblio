import React from "react";

export class Card extends React.Component {
    render() {
        return (
            <article className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105" onClick={this.props.onClick}>
                <img alt="Placeholder" className="block rounded-t-2xl h-auto w-full" src="https://picsum.photos/600/400/?random" />

                <h1 className="text-lg p-2 md:p-4">
                    <a className="no-underline hover:underline text-black" href="#">
                        {this.props.biblio.Nome}
                </a>
                </h1>

                <a className="flex items-center no-underline hover:underline text-black text-sm p-2 md:p-4" href="#">
                    {this.props.biblio.Indirizzo}
                </a>

            </article>
        )
    }
}