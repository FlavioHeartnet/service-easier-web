import { createContext, ReactNode, useContext, useState } from "react";

export type authContextType = {
    uid: string
    email: string
    comission: number
    payday: number
    userSession?: (uid, email, comission, payday)=>void
};

const authContextDefaultValues: authContextType = {
    uid: '',
    email: '',
    comission: 0,
    payday: 15,
    userSession: ()=>{}
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


    const userSession = (uid,email,comission,payday) => {
        setUid(uid)
        setEmail(email)
        setComission(comission)
        setPayday(payday)
    }
    const value = {
        uid,
        email,
        comission,
        payday,
        userSession
    }
    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
}