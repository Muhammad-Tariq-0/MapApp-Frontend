import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';

const UserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSignIn, setIsSignIn] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignIn) {
            // Sign-in logic
            try {
                const response = await axios.get('https://squid-app-ni9et.ondigitalocean.app/users');
                const users = response.data;

                if (Array.isArray(users)) {
                    const user = users.find(user => user.email === email && user.password === password);

                    if (user) {
                        // Store user information in session storage
                        sessionStorage.setItem('userEmail', email);
                        sessionStorage.setItem('userPassword', password);
                        sessionStorage.setItem('userId', user.id.toString());

                        setMessage('Sign-in successful');
                        alert('Sign In Successful')
                        navigate('/');
                    } else {
                        setMessage('Invalid email or password');
                    }
                } else {
                    setMessage('Unexpected response format');
                }
            } catch (error) {
                console.error('Error during sign-in:', error);
                setMessage('Failed to sign in');
            }
        } else {
            // Check if user with email already exists
            try {
                const response = await axios.get('https://squid-app-ni9et.ondigitalocean.app/users');
                const users = response.data;

                if (Array.isArray(users)) {
                    const existingUser = users.find(user => user.email === email);

                    if (existingUser) {
                        setMessage('Email already exists. Please use a different email.');
                        return;
                    }

                    if (password !== repeatPassword) {
                        setMessage('Passwords do not match');
                        return;
                    }

                    // If email does not exist, proceed with signup
                    try {
                        const signUpResponse = await axios.post('http://localhost:3001/users', { name, email, password });
                        setMessage(`User added with Email: ${signUpResponse.data.email}`);
                        alert(`User Added sucessfully with email:${signUpResponse.data.email}`)
                        setIsSignIn(true)
                    } catch (error) {
                        console.error('Error adding user:', error);
                        setMessage(`Failed to add user: ${error.response?.data?.error || error.message}`);
                    }
                } else {
                    setMessage('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setMessage('Failed to check existing users');
            }
        }
    };

    return (
        <div className="form-container">
            <h1 className='formheadinglabel'>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
            <p className='formheadinglabel'>{isSignIn ? 'Please enter your email and password to sign in.' : 'Please fill in this form to create an account.'}</p>
            <hr />

            <form onSubmit={handleSubmit}>
                {!isSignIn && (
                    <>
                        <label className='formheadinglabel' htmlFor="name"><b>Name</b></label>
                        <input id="input" type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />

                        <label className='formheadinglabel' htmlFor="email"><b>Email</b></label>
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label className='formheadinglabel' htmlFor="password"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <label className='formheadinglabel' htmlFor="repeat-password"><b>Repeat Password</b></label>
                        <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                    </>
                )}
                {isSignIn && (
                    <>
                        <label className='formheadinglabel' htmlFor="email"><b>Email</b></label>
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label className='formheadinglabel' htmlFor="password"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </>
                )}

                <div className="clearfix">
                    {!isSignIn && <button id="button" type="submit" className="signupbtn">Sign Up</button>}
                    {isSignIn && <button id="button" type="submit" className="signupbtn">Sign In</button>}
                    <button id="button" type="button" className="cancelbtn" onClick={() => setIsSignIn(!isSignIn)}>
                        {isSignIn ? 'Create an Account' : 'Sign In Instead'}
                    </button>
                </div>
            </form>

            <p>{message}</p>
        </div>
    );
};

export default UserForm;























// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserForm.css';

// const UserForm = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [repeatPassword, setRepeatPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [isSignIn, setIsSignIn] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         if (isSignIn) {
//             try {
//                 const response = await axios.get('http://localhost:3001/users');
//                 const users = response.data;
    
//                 if (Array.isArray(users)) {
//                     const user = users.find(user => user.email === email && user.password === password);
    
//                     if (user) {
//                         // Store user information in session storage
//                         sessionStorage.setItem('userEmail', email);
//                         sessionStorage.setItem('userPassword', password);
//                         sessionStorage.setItem('userId', user.id.toString());
    
//                         setMessage('Sign-in successful');
//                         // Navigate to Main component with user_id
//                         // navigate('/user/userprofile');
//                         navigate('/');
//                     } else {
//                         setMessage('Invalid email or password');
//                     }
//                 } else {
//                     setMessage('Unexpected response format');
//                 }
//             } catch (error) {
//                 console.error('Error during sign-in:', error);
//                 setMessage('Failed to sign in');
//             }
//         } else {
//             if (password !== repeatPassword) {
//                 setMessage('Passwords do not match');
//                 return;
//             }
    
//             try {
//                 const response = await axios.post('http://localhost:3001/users', { name, email, password });
//                 setMessage(`User added with ID: ${response.data.id}`);
//             } catch (error) {
//                 console.error('Error adding user:', error);
//                 setMessage(`Failed to add user: ${error.response?.data?.error || error.message}`);
//             }
//         }
//     };
  
//     return (
//         <div className="form-container">
//             <h1 className='formheadinglabel'>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
//             <p className='formheadinglabel'>{isSignIn ? 'Please enter your email and password to sign in.' : 'Please fill in this form to create an account.'}</p>
//             <hr />

//             <form onSubmit={handleSubmit}>
//                 {!isSignIn && (
//                     <>
//                         <label className='formheadinglabel' htmlFor="name"><b>Name</b></label>
//                         <input id="input" type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />

//                         <label className='formheadinglabel' htmlFor="email"><b>Email</b></label>
//                         <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

//                         <label className='formheadinglabel' htmlFor="password"><b>Password</b></label>
//                         <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

//                         <label className='formheadinglabel' htmlFor="repeat-password"><b>Repeat Password</b></label>
//                         <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
//                     </>
//                 )}
//                 {isSignIn && (
//                     <>
//                         <label className='formheadinglabel' htmlFor="email"><b>Email</b></label>
//                         <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

//                         <label className='formheadinglabel' htmlFor="password"><b>Password</b></label>
//                         <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                     </>
//                 )}

//                 <div className="clearfix">
//                     {!isSignIn && <button id="button" type="submit" className="signupbtn">Sign Up</button>}
//                     {isSignIn && <button id="button" type="submit" className="signupbtn">Sign In</button>}
//                     <button id="button" type="button" className="cancelbtn" onClick={() => setIsSignIn(!isSignIn)}>
//                         {isSignIn ? 'Create an Account' : 'Sign In Instead'}
//                     </button>
//                 </div>
//             </form>

//             <p>{message}</p>
//         </div>
//     );
// };

// export default UserForm;















