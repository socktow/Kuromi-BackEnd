import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyEmail = ({ location }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      axios.get(`http://localhost:4000/verify-email?token=${token}`)
        .then(response => {
          setMessage('Email successfully verified!');
        })
        .catch(error => {
          setMessage('Error verifying email.');
        });
    } else {
      setMessage('Invalid verification link.');
    }
  }, [location]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
