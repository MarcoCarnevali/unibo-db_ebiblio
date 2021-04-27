import React from "react";
import { checkLogged, checkUserType } from "../Network/NetworkManager";
import { Link } from "react-router-dom";
import { logout } from "../Network/NetworkManager";

export default class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { email: 'not-logged' };
    }

    componentDidMount() {
        const response = checkLogged();
        console.log(response)
        if (response && response !== 'not-logged')
            this.setState({ email: response })

    }

    logoutTapped = async () => {
        await logout();
        window.location.reload();
    }

    render() {
        var rightHeader;

        if (this.state.email === 'not-logged')
            rightHeader = (
                <div className="float-right">
                    <Link to="/login" className=""> Login </Link>
                    <Link to="/signup" className="p-2 mx-2 text-white font-bold rounded-lg transition duration-500 ease-in-out bg-blue-600 transform hover:scale-110"> Signup </Link>
                </div>
            )
        else
            rightHeader = (
                <div className="float-right">
                    {checkUserType() === "0" ?
                        (<Link to="/profile" className="no-underline hover:underline">Logged as: {this.state.email}</Link>)
                        :
                        (<span className="">Logged as: {this.state.email}</span>)
                    }
                    <button className="p-2 mx-2 text-white font-bold rounded-lg transition bg-blue-600" onClick={this.logoutTapped}> Logout </button>
                </div>
            )

        return (
            <div className="z-50 sticky top-0 w-full h-20 bg-white bg-opacity-60 flex justify-between items-center backdrop-blur border border-gray-20" >
                <div className="mx-10 w-full">
                    <div className="float-left">
                        <Link to="/" className="float-left text-black font-bold text-2xl">Ebiblio</Link>
                    </div>
                    {rightHeader}
                </div>
            </div>
        );
    }
}