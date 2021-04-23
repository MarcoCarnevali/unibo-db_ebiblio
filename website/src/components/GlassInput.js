import React from "react";

export default class GlassInput extends React.Component {
    render() {
        const textColor = this.props.textColor || "text-white";
        const className = `bg-white bg-opacity-20 rounded-full border-2 border-white border-opacity-20 text-lg ${textColor} font-medium p-3 outline-none placeholder-white shadow-md`
        return (
            <input type={this.props.type}
                   className={className}
                   placeholder={this.props.placeholder}
                   onChange={this.props.onChange} />
        )
    }
}