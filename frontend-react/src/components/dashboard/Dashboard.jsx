import axios from 'axios'
import React, { useEffect } from 'react'
import axiosInstance from '../axiosInstance'

const Dashboard = () => {
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
                
            </div>
        </div>
        </> 
    )
}

export default Dashboard
