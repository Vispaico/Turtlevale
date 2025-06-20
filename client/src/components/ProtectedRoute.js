import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CircularProgress, Box } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(adminRequired);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (adminRequired && currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'admin');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [currentUser, adminRequired]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 