import { useEffect, useState } from "react";

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState({ _id: 0, name: '', email: '', password: '' });
    useEffect(() => {
        fetch(`http://localhost:8080/api/users/me`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
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