import { Menu} from 'semantic-ui-react'
import styles from './../styles/Header.module.scss'
import {useRouter} from 'next/router'
import { signOut,onAuthStateChanged  } from "firebase/auth";
import {auth } from './../firebase'
import { useAuth } from './contexts/authContext';
import { useEffect } from 'react';
export default function Header(){
    const router = useRouter()
    const {userSession} = useAuth()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userSession(user.uid,user.email,2,0)
            } else {
              router.push('/')
            }
          });
    }, [router, userSession])
      
    

    function handleroute(url){
        router.push({
            pathname: url
        })
    }

    function logout(){
        signOut(auth).then(()=>{

        }).catch(error => {
            console.log(error)
        })
    }
    return (<div className={styles.container}>
        <Menu fixed='top' inverted secondary pointing>
        <Menu.Item><b>Service Easier</b></Menu.Item>
        <Menu.Item onClick={()=> handleroute('/home')}><b>Home</b></Menu.Item>
        <Menu.Item onClick={()=> handleroute('/addservice')}><b>Lançar serviços</b></Menu.Item>
        <Menu.Item onClick={()=> handleroute('/serviceList')}><b>Consultar serviços</b></Menu.Item>
        <Menu.Item onClick={()=> handleroute('/useraccount')}><b>Conta</b></Menu.Item>
        <Menu.Item onClick={logout} position='right'><b>Sair</b></Menu.Item>
        </Menu>
        <div className={styles.container}>
            <div className={styles.backgroung}/>
        </div>
    </div>)
}