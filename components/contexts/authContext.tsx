import { createContext, ReactNode, useContext, useState } from "react";
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import config from "../../config";
import moment from "moment";
import { calcComission } from "../../Utils/validations";
import Service from "../../model/service";
export type chartDateType = {
    date:string,
    count:number
}
export type authContextType = {
    uid: string
    email: string
    comission: number
    payday: number
    userSession?: (uid,name, email, comission, payday)=>void
    app: FirebaseApp,
    auth: Auth,
    db: Firestore
    name:string,
    titlePages:string,
    updateTitlePage: (tittle:string)=>void,
    profit: number,
    rentability: number,
    updateRent: (profit:number, rentability:number)=>void,
    serviceList: Service[],
    updateServiceList: (service: Service[])=>void
    updateCurrentList: (day:number, firebaseList: Service[]) => void,
    currentDayFilter: number,
    updateCurrentDayFilter: (day:number)=>void,
    chartdatabyDate : chartDateType[],
    setChartbyDate : (chartdatabyDate) =>void

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
    userSession: () => { },
    app: initializeApp(firebaseConfig),
    auth: null,
    db: null,
    name: '',
    titlePages: '',
    updateTitlePage: () => { },
    profit: 0,
    rentability: 0,
    updateRent: () => { },
    serviceList: [],
    updateServiceList: () => { },
    updateCurrentList: () => { },
    currentDayFilter: 0,
    updateCurrentDayFilter: () => { },
    chartdatabyDate: [{date:'', count:0}],
    setChartbyDate: () => { },
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
    const [titlePages, settitlePages] = useState("")
    const [rentability, setRent] = useState(0)
    const [profit, setProfit] = useState(0)
    const [serviceList, setserviceList] = useState([new Service('','','','',0,new Date())])
    const [currentDayFilter, setcurrentDayFilter] = useState(7)
    const [chartdatabyDate, setchartdatabyDate] = useState([{date:'', count:0}])

    const updateCurrentList = (day:number, firebaseList)=> {
        setcurrentDayFilter(day) 
        const serviceList = []
        firebaseList.map((docService)=>{  
            const getnow = moment()
            const serviceDate = moment(docService.serviceDate)
            const diff = getnow.diff(serviceDate, 'days')
            if(diff <= day){
                serviceList.push({
                    id: docService.id,
                    service: docService.service,
                    name: docService.name,
                    price: docService.price,
                    serviceDate: docService.serviceDate
                })    
            }
        })
        serviceList.sort((a,b) => {
            return +moment(b.date).toDate() - +moment(a.date).toDate()
        })
        let rent = calcComission(serviceList, comission == null ? 100 : comission)
        updateRent(rent[1], rent[0])
        setserviceList(serviceList)
    }
    const updateCurrentDayFilter = (day:number)=>{
        setcurrentDayFilter(day)
    }
    const userSession = (uid,name,email,comission,payday) => {
        setUid(uid)
        setName(name)
        setEmail(email)
        setComission(comission)
        setPayday(payday)
    }
    const updateTitlePage = (tittle:string)=>{
        settitlePages(tittle)
    }
    const updateRent = (profit:number, rentability:number)=>{
        setRent(rentability)
        setProfit(profit)
    }
    const updateServiceList = (service:Service[]) => {
        setserviceList(service)
    }
    const setChartbyDate = (chartData)=>{
        setchartdatabyDate(chartData)
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
        titlePages,
        profit,
        rentability,
        serviceList,
        currentDayFilter,
        chartdatabyDate,
        userSession,
        updateTitlePage,
        updateRent,
        updateServiceList,
        updateCurrentList,
        updateCurrentDayFilter,
        setChartbyDate
    }
    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
}