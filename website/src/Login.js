import React, { useState } from "react";
import GlassInput from "./components/GlassInput";
import { Link } from "react-router-dom"
import { login } from "./Network/NetworkManager";

const Login = ({ history }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState(null);

    const myChangeHandler = (event) => {
        let nam = event.target.placeholder || event.target.computedName;
        let val = event.target.value;
        
        if (val === "user" || val === "volunteer") {
            setUserType(val);
        }
        
        if (data == null) {
            setData({ [nam]: val })
            return
        }

        const newData = data
        newData[nam] = val
        setData(newData);
    }

    const loginTapped = async () => {
        if (data === null || !data["Email"] || !data["Password"]) {
            setError('*Error: please compile all fields')
            return
        }

        try {
            const response = await login(userType || "user", data["Email"], data["Password"]);
            if(!response.result) {
                setError("*Error: Wrong Email or Password")
                return
            } else if (userType === "volunteer") {
                history.push("/volunteer");
            } else if (response.result.Stato === 'Attivo') {
                history.push("/");
            }else{
                setError("*Error: Account suspended")
                return
            }

        } catch (error) {
            console.error(error)
            if (error.response.status === 500) {
                setError('*Error: something went wrong')
                return
            }else if (error.response.status === 406) {
                setError("*Error: Wrong Email or Password")
                return
            }
        }
    }

    return (
        <div className="min-h-screen bg-blue-dark py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 bg-clip-padding bg-opacity-20 border border-gray-200 backdrop-blur">
                    <div className="max-w-md mx-auto divide-gray-200">
                        <div>
                            <p className="text-3xl font-bold text-white text-center">Ebiblio login</p>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="flex flex-col py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <span className="text-white">User type: </span>
                                <div className="inline-block">
                                    <input type="radio" id="user" name="type" value="user" defaultChecked onChange={myChangeHandler} />
                                    <label className="ml-2 text-white" for="user">User</label>
                                </div>
                                <div className="inline-block">
                                    <input type="radio" id="volunteer" name="type" value="volunteer" onChange={myChangeHandler} />
                                    <label className="ml-2 text-white" for="volunteer">Volunteer</label>
                                </div>
                                <GlassInput type="email" placeholder="Email" onChange={myChangeHandler} />
                                <GlassInput type="password" placeholder="Password" onChange={myChangeHandler} />
                                <button className="bg-white bg-opacity-80 rounded-full border-2 border-white border-opacity-20 text-lg font-medium shadow-sm p-3 w-1/2 place-self-center" onClick={loginTapped}>Sign in</button>
                                <span className="text-red-800">{error}</span>
                            </div>
                            <div className="pt-6 text-base text-white leading-6 font-bold sm:text-lg sm:leading-7">
                                <p>New user?<Link to="/signup" className="text-cyan-600 hover:text-cyan-700"> Sign In! &rarr; </Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;