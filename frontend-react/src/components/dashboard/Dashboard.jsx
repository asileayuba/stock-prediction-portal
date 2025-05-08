import axios from 'axios'
import React, { useEffect } from 'react'
import axiosInstance from '../axiosInstance'

const Dashboard = () => {
    useEffect(() => {
        const fetchProtectedData = async () => {
            const accessToken = localStorage.getItem('access_token');

            try {
                const response = await axiosInstance.get('/protected-view', {
                    // headers: {
                    //     Authorization: `Bearer ${accessToken}`
                    // }
                })
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
        {/* <div className='text-light container'>Dashboard</div> */}
        </> 
    )
}

export default Dashboard
