import { Button } from "primereact/button";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const UserInfo = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['x-auth-token']);
    const [userInfo, setUserInfo] = useState({ _id: 0, name: '', email: '', password: '' });
    useEffect(() => {
        fetch(`http://localhost:8080/api/users/me`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': cookies["x-auth-token"],
            },
            cache: 'no-cache'
        }).then((response) => response.json()).then(data => {
            console.log(JSON.stringify(data));
            setUserInfo(data);
        }).catch((e) => {
            console.log(e);
        });
    }, []);


    return (
        <div className="App">
            <h1>Home</h1>
            <p>Hello {userInfo.name} from {userInfo.email}!</p>
        </div>
    );
}

export default UserInfo;