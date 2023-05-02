import { Button } from "primereact/button";
import React from "react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Home = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['connect.sid']);
    const [userInfo, setUserInfo] = useState({ _id: 0, name: '', email: '', password: '' });
    useEffect(() => {
        fetch(`/api/users/me`, {
            method: 'GET',
            mode: 'cors',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        }).then((response) => response.json()).then(data => {
            console.log(JSON.stringify(data));
            setUserInfo(data);
        }).catch((e) => {
            console.log(e);
        });
    }, []);

    const logout = () => {
        fetch(`/api/auth/logout`, {
            method: 'DELETE',
            mode: 'cors',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            body: JSON.stringify({ action: 'remove' })
        }).then((response) => {
            response.text();
        }).catch((e) => {
            console.log(e);
        }).then(data => {
            console.log(JSON.stringify(data));
            window.location.href = "/";
        }).catch((e) => {
            console.log(e);
        });
    }

    return (
        <div className="App">
            <h1>Home</h1>
            <p>Hello {userInfo.name}!</p>
            <Button label="LogOut" onClick={() => {
                logout();
            }} />
            <Button label="LogIn" onClick={() => {
                window.location.href = "/login";
            }} />
            <Button label="Register" onClick={() => {
                window.location.href = "/register";
            }} />
        </div>
    );
}

export default Home;