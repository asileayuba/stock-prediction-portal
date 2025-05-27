import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'

const Dashboard = () => {
    const [ticker, setTicker] = useState()

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get('/protected-view');
                console.log('Success:', response.data);
            } catch (error) {
                if (error.response) {
                    console.error('Backend error:', error.response.status, error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Request setup error:', error.message);
                }
            }
        }
        fetchProtectedData();
    }, [])

    return (
        <>
        <div className='container'>
            <div className="row">
                <div className="col-md-6 mx-auto ">
                    <form >
                        <input type='text' className='form-control' placeholder='Enter Stock Ticker' 
                        onChange={(e) => setTicker(e.target.value)} required
                        />
                        <button type='submit' className='btn btn-info mt-3'>View Prediction</button>
                    </form>
                </div>
            </div>
        </div>
        </> 
    )
}

export default Dashboard
