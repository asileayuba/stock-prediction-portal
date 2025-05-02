import React, { useState } from 'react'
import axios from 'axios'

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const handleRegistration = async (e) =>{
        e.preventDefault();
        
        const userData = {
            username, email, password
        }
        
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData)
            console.log('response.data==>', response.data)
            console.log('Registration successful');
        }catch(error){
            setErrors(error.response.data)
            console.error('Registration error: ', error.response.data)
        }
    }
  return (
    <>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className="col-md-6 bg-light-dark p-5 rounded">
                    <h3 className='text-light text-center mb-4'> Register for an Account </h3>

                    <form onSubmit={handleRegistration}>
                        <div className="mb-3">
                            <input type="text" className='form-control' placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <small>{errors.username && <div className='text-danger'>{errors.username}</div>}</small>
                        </div>
                        <div className="mb-3">
                            <input type="email" className='form-control' placeholder='Enter your email address' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-5">
                            <input type="password" className='form-control' placeholder='Create a secure password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <small>{errors.password && <div className='text-danger'>{errors.password}</div>}</small>
                        </div>
                        
                        <button type='submit' className='btn btn-info d-block mx-auto' >Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Register