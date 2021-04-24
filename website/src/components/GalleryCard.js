import React from "react";

export default class GalleryCard extends React.Component {
    render() {
        return (
            <img alt="Placeholder"
                className="rounded-2xl shadow-lg w-auto border border-gray-200 bg-white bg-opacity-60 backdrop-blur transition duration-500 ease-in-out transform hover:scale-105"
                src={"images/" + this.props.biblio.NomeFoto} />
        )
    }
}