import React, {useState} from "react";
import axios from 'axios'

const Auth = () => {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const authLogic = async (url) => {
		try { 
			const response = await axios.post(`http://localhost:3000/api${url}`, { username, password});
			setMessage(response.data.message);
		} catch (error) {
			setMessage(error.response.data.error);
		}
	};

	return (
		<div className="text-center">
			<h1 className="text-center mt-5">Authentication</h1>
			<div>
				<label> Username: </label>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>

			</div>
			<div>
				<label> Password: </label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
			</div>
			<div>
				<button onClick={() => authLogic('/register')}> Register </button>
			 <button onClick={() => authLogic('/login')}>Login</button>
		</div>
		{message && <p>{message}</p>}
		</div>
		
	);
};

export default Auth;
