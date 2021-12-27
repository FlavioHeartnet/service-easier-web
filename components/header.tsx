import {
    Button,
    Container,
    Divider,
    Grid,
    Icon,
    Image,
    List,
    Menu,
    Segment,
    Sidebar,
    Visibility,
  } from 'semantic-ui-react'
  import { createMedia } from '@artsy/fresnel'
import styles from './../styles/Header.module.scss'
import {useRouter} from 'next/router'
import { signOut,onAuthStateChanged  } from "firebase/auth";
import {auth } from './../firebase'
import { useAuth } from './contexts/authContext';
import { useEffect, useState } from 'react';
const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })

const DesktopContainer=(props)=>{
    const [fixed , setFixed] = useState(false)
    
    const showFixedMenu = () => {
        setFixed(true)
    }
    const hideFixedMenu = () => {
        setFixed(false)
    }
    return (
        <>
            <Media greaterThan='mobile'>
                   <Visibility
                once={false}
                onBottomPassed={showFixedMenu}
                onBottomPassedReverse={hideFixedMenu}
                >
                <Segment
                    textAlign='center'
                    style={{ minHeight: 700, padding: '1em 0em' }}
                    vertical
                >
                    <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
        <Menu.Item><b>Service Easier</b></Menu.Item>
        <Menu.Item onClick={()=> props.handleroute('/home')}><b>Home</b></Menu.Item>
        <Menu.Item onClick={()=> props.handleroute('/addservice')}><b>Lançar serviços</b></Menu.Item>
        <Menu.Item onClick={()=> props.handleroute('/serviceList')}><b>Consultar serviços</b></Menu.Item>
        <Menu.Item onClick={()=> props.handleroute('/useraccount')}><b>Conta</b></Menu.Item>
        <Menu.Item onClick={props.logout()} position='right'><Button as='a' inverted={!fixed}>
                    Log out
                  </Button></Menu.Item>
        </Menu>
                </Segment>
                </Visibility>
            </Media>
        </>
    )
}  

const MobileContainer = (props)=>{
    const [sidebarOpened , setSideBar] = useState(false)
    const handleSidebarHide = () => setSideBar(false)
    const handleToggle = () => setSideBar(true)
    return (
        <>
        <Media at='mobile'>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item active><h2>Service Easier</h2></Menu.Item>
            <Menu.Item onClick={()=> props.handleroute('/home')}><b>Home</b></Menu.Item>
            <Menu.Item onClick={()=> props.handleroute('/addservice')}><b>Lançar serviços</b></Menu.Item>
            <Menu.Item onClick={()=> props.handleroute('/serviceList')}><b>Consultar serviços</b></Menu.Item>
            <Menu.Item onClick={()=> props.handleroute('/useraccount')}><b>Conta</b></Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 350, padding: '1em 0em' }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={handleToggle}>
                    <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item onClick={props.logout()} position='right'><Button as='a'>
                    Log out
                  </Button></Menu.Item>
                </Menu>
              </Container>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
        </>
    )
}
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
        <MediaContextProvider>
            <DesktopContainer logout={logout} handleroute={handleroute}/>
            <MobileContainer  logout={logout} handleroute={handleroute}/>
        </MediaContextProvider>
        <div className={styles.container}>
            <div className={styles.backgroung}/>
        </div>
    </div>)
}