import { createContext, ReactNode, useContext, useState } from "react";
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import config from "../../config";
export type authContextType = {
    uid: string
    email: string
    comission: number
    payday: number
    userSession?: (uid,name, email, comission, payday)=>void
    app: FirebaseApp,
    auth: Auth,
    db: Firestore
    name:string
};

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
  };

const authContextDefaultValues: authContextType = {
    uid: '',
    email: '',
    comission: 0,
    payday: 15,
    userSession: ()=>{},
    app: initializeApp(firebaseConfig),
    auth: null,
    db: null,
    name:''
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [uid, setUid] = useState('')
    const [email, setEmail] = useState('')
    const [comission, setComission] = useState(0)
    const [payday, setPayday] = useState(0)
    const [name, setName] = useState("")
    const app = authContextDefaultValues.app
    const auth = getAuth(authContextDefaultValues.app)
    const db = getFirestore(authContextDefaultValues.app)


    const userSession = (uid,email,name,comission,payday) => {
        setUid(uid)
        setName(name)
        setEmail(email)
        setComission(comission)
        setPayday(payday)
    }
    const value = {
        uid,
        email,
        name,
        comission,
        payday,
        app,
        auth,
        db,
        userSession,
    }
    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
}