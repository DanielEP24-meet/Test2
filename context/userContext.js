import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA7_5tTBM3MWG6F8casKP6mNLxEkxZBbho",
    authDomain: "hestiadb-fbba3.firebaseapp.com",
    databaseURL: "https://hestiadb-fbba3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hestiadb-fbba3",
    storageBucket: "hestiadb-fbba3.appspot.com",
    messagingSenderId: "979082184288",
    appId: "1:979082184288:web:bd33de71ab4bf7d0222505",
    measurementId: "G-0S4N9VQJSM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const database = getDatabase(app);

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userRef = ref(database, `Users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log('User data:', snapshot.val());
        setUser({ uid, ...snapshot.val() });
      } else {
        setUser({ uid });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in 2");
      await fetchUserData(userCredential.user.uid);
      console.log("User logged in 1");
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      await set(ref(database, `Users/${uid}`), ...userData);
      setUser({ uid, ...userData });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUser = async (newUserData) => {
    if (!user || !user.uid) return;
    try {
      const updatedUserData = { ...user, ...newUserData };
      await set(ref(database, `users/${user.uid}`), updatedUserData);
      setUser(updatedUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider 
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


export async function fetchOrgs(specificOrgs = null) {
  const orgsRef = ref(database, 'Orgs');
  
  try {
    const snapshot = await get(orgsRef);
    
    if (snapshot.exists()) {
      const orgsData = snapshot.val();
      let result = {};
      
      if (specificOrgs && typeof specificOrgs === 'object' && !Array.isArray(specificOrgs)) {
        // Fetch only specific orgs if provided as an object
        Object.keys(specificOrgs).forEach(orgName => {
          if (orgsData.hasOwnProperty(orgName)) {
            result[orgName] = orgsData[orgName];
          }
        });
      } else {
        // Fetch all orgs if no specific ones provided or if input is not an object
        result = orgsData;
      }
      
      return result;
    } else {
      console.log("No data available in Orgs");
      return {};
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}