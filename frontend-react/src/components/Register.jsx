import React, { useState } from 'react'

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  return (
    <>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className="col-md-6 bg-light-dark p-5 rounded">
                    <h3 className='text-light text-center mb-4'> Register for an Account </h3>

                    <form>
                        <input type="text" className='form-control mb-3' placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="email" className='form-control mb-3' placeholder='Enter your email address' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" className='form-control mb-5' placeholder='Create a secure password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='submit' className='btn btn-info d-block mx-auto' >Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Register