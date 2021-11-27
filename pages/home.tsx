import { onAuthStateChanged  } from "firebase/auth";
import {auth} from './../firebase'
import styles from './../styles/Home.module.scss'
import {useRouter} from 'next/router'
import { useEffect } from "react";
import Header from './../components/header'
import {Container} from 'semantic-ui-react'
export default function Home(){
    const router = useRouter()
    useEffect(()=>{
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                
            } else {
                router.push("/")
            }
          });
    })
    return (
        <div>
            <Header />
            <Container>
                <br/>
                <h1>Home</h1>
            </Container>
            
        </div>
    )
}