import React, { useState, useEffect } from "react";
import GlassInput from "./components/GlassInput";
import { Link } from "react-router-dom";
import { signup } from "./Network/NetworkManager";
import "./style/main.css";

const Home = ({ history }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState("user");
    const [gender, setGender] = useState("M");
    
    const myChangeHandler = (event) => {
        let nam = event.target.placeholder || event.target.computedName;
        let val = event.target.value;
        
        if (val === "user" || val === "volunteer")
            setUserType(val);
        else if (val === "male" || val === "female") 
            setGender(val === "male" ? "M" : "F");
        
        if (data == null) {
            setData({ [nam]: val })
            return
        }

        const newData = data
        newData[nam] = val
        setData(newData);
    }

    const signupTapped = async () => {
        console.log("DATA: ",data)
        if (data === null || !data["Email"] || !data["Password"] ) {
            setError('*Error: please compile all fields')
            return
        }
        if (data["Password"] !== data["Re-type Password"]) {
            setError('*Error: passwords should match')
            return
        }
        try {
            await signup(data["Email"], data["Password"], gender, data["First Name"], data["Last Name"], data["Phone number"], data["Date of birth"], data["Place of birth"], data["Job"], data["Transportation"], userType);
            history.push('/login')
        } catch (error) {
            if (error.response.status === 409) {
                setError('*Error: email already exists')
                return
            } else if (error.response.status === 500) {
                setError('*Error: something went wrong')
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
                                <GlassInput type="password" placeholder="Re-type Password" onChange={myChangeHandler} />
                                <GlassInput type="text" placeholder="First Name" onChange={myChangeHandler} />
                                <GlassInput type="text" placeholder="Last Name" onChange={myChangeHandler} />
                                <GlassInput custom="birth" id="birth" type="date" placeholder="Date of birth" onChange={myChangeHandler} />
                                <GlassInput type="text" placeholder="Place of birth" onChange={myChangeHandler} />
                                <GlassInput type="tel" placeholder="Phone number" onChange={myChangeHandler} />
                                <select className="bg-white bg-opacity-20 rounded-full border-2 border-white border-opacity-20 text-lg text-white font-medium p-3 outline-none placeholder-white shadow-md" onChange={myChangeHandler}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {userType !== null && userType === 'volunteer' ? (
                                    <>
                                         <GlassInput type="text" placeholder="Transportation" onChange={myChangeHandler} />
                                    </>
                                ) : (<>

                                    <GlassInput type="text" placeholder="Job" onChange={myChangeHandler} />

                                </>)}

                                <button className="bg-white bg-opacity-80 rounded-full border-2 border-white border-opacity-20 text-lg font-medium shadow-sm p-3 w-1/2 place-self-center" onClick={signupTapped}>Sign up</button>
                                <span className="text-red-800">{error}</span>
                            </div>

                            <div className="pt-6 text-base text-white leading-6 font-bold sm:text-lg sm:leading-7">
                                <p>Already an User?<Link to="/login" className="text-cyan-600 hover:text-cyan-700"> Sign In! &rarr; </Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;