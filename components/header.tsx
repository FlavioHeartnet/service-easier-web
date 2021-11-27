import { Menu, Dropdown} from 'semantic-ui-react'
import styles from './../styles/Header.module.scss'
import {useRouter} from 'next/router'
import { signOut  } from "firebase/auth";
import {auth} from './../firebase'
export default function Header(props){
    const router = useRouter()
    function handleroute(url){
        router.push(url)
    }

    function logout(){
        signOut(auth).then(()=>{

        }).catch(error => {
            console.log(error)
        })
    }
    return (<div className={styles.container}>
        <Menu fixed='top' secondary>
        <Menu.Item><b>Service Easier</b></Menu.Item>
        <Menu.Item onClick={()=> handleroute('/home')}><b>Home</b></Menu.Item>
        <Menu.Item onClick={logout} position='right'><b>Sair</b></Menu.Item>
        </Menu>
    </div>)
}