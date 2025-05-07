import axios from 'axios'
import React, { useEffect } from 'react'

const Dashboard = () => {
    useEffect(() => {
        const fetchProtectedData = async () => {
            const accessToken = localStorage.getItem('access_token');
            console.log('Access Token:', accessToken);

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/protected-view', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
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
        <div className='text-light container'>Dashboard</div>
    )
}

export default Dashboard
