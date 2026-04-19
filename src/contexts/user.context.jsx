import {createContext, useState, useEffect, useCallback} from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';
import {useNavigate} from "react-router-dom";

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };
  const navigate = useNavigate();

  const goToHomePage = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
      goToHomePage();
    });

    return unsubscribe;
  }, [goToHomePage]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
