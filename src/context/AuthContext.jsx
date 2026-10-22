import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        setCurrentUser(userData);
        setLoading(false); // Unblock the UI immediately

        // Save/update user profile in Firestore
        setDoc(doc(db, 'users', user.uid), {
          ...userData,
          lastLogin: serverTimestamp()
        }, { merge: true }).catch(error => {
          console.error("Error saving user profile: ", error);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
