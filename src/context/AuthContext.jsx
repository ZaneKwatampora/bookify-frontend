import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

const googleProvider = new GoogleAuthProvider();

// auth provider 
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // register a user
    const registerUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password)
    }

    const loginUser = async (email, password) => {

        return await signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = async () => {

        return await signInWithPopup(auth, googleProvider)
    }

    // logout the user
    const logout = () => {
        return signOut(auth)
    }

    // manage user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
    
            if (user) {
                const { email, displayName, photoURL } = user;
                const username = displayName || email?.split("@")[0];
    
                const userData = {
                    email,
                    username,
                    photo: photoURL
                };
    
                // You can optionally store this in context if needed
                console.log("User:", userData);
            }
        });
    
        return () => unsubscribe();
    }, []);



    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children} 
        </AuthContext.Provider>
    );
};
