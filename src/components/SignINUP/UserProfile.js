import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '', // Be cautious about storing passwords
        userId: ''
    });

    useEffect(() => {
        // Retrieve data from sessionStorage
        const email = sessionStorage.getItem('userEmail');
        const password = sessionStorage.getItem('userPassword');
        const userId = sessionStorage.getItem('userId');

        if (email && userId) {
            setUserInfo({
                email,
                password, // Consider not using this in practice for security reasons
                userId
            });
        }
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            <p>Email: {userInfo.email}</p>
            <p>User ID: {userInfo.userId}</p>
            {/* Display user info as needed */}
        </div>
    );
};

export default UserProfile;
