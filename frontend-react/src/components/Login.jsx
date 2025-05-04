import React, { useState } from 'react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  return (
        <>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className='text-light text-center mb-4'> Login Into Your Account </h3>
    
                        <form>
                            <div className="mb-3">
                                <input type="text" className='form-control' placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div> 
                            <div className="mb-3">
                                <input type="password" className='form-control' placeholder='Create a secure password' value={password} onChange={(e) => setPassword(e.target.value)} />
            
                            </div>
                            
                            {loading ? (
                                <button type='submit' className='btn btn-info d-block mx-auto' disabled > < FontAwesomeIcon icon={faSpinner} spin /> Logging in... </button>
                            ) : (
                                <button type='submit' className='btn btn-info d-block mx-auto' >Login</button>
                            )}
                              
                        </form>
                    </div>
                </div>
            </div>
        </>
  )
}

export default Login