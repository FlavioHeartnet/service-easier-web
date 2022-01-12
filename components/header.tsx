import {
    Button,
    Container,
    Grid,
    Icon,
    Menu,
    Sidebar,
    Visibility,
  } from 'semantic-ui-react'
  import { createMedia } from '@artsy/fresnel'
import styles from './../styles/Header.module.scss'
import {useRouter} from 'next/router'
import { signOut,onAuthStateChanged  } from "firebase/auth";
import { useAuth } from './contexts/authContext';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import User from '../model/user';
import { validateComission, validatePayDay } from '../Utils/validations';
const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })
const HeaderTitle = ()=>{
  const {titlePages} = useAuth()
  return (
    <Container >
      <Grid textAlign='center' style={{ height: '18vh' }}  verticalAlign='middle'>
        <Grid.Column>
        <h1 style={{ fontSize: '4vh', color: 'white' }}>{titlePages}</h1>
        </Grid.Column>
      </Grid>
    </Container>
  )
}
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
                <div className={styles.backgroung}>
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
                    <Menu.Item onClick={props.logout} position='right'><Button as='a' inverted={!fixed}>
                                Log out
                              </Button></Menu.Item>
                    </Menu>
                    <HeaderTitle/>
                    </div>
                </Visibility>
                {props.children}
            </Media>
            
        </>
    )
}  
DesktopContainer.propTypes = {
  children: PropTypes.node,
  logout: ()=>{},
  handleroute: ()=>{}
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
            <Menu.Item onClick={()=> props.handleroute('/addservice')}><b>Lançar serviços</b></Menu.Item>
            <Menu.Item onClick={()=> props.handleroute('/serviceList')}><b>Consultar serviços</b></Menu.Item>
            <Menu.Item onClick={()=> props.handleroute('/useraccount')}><b>Conta</b></Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
              <div className={styles.backgroung}>
              <Container>
                <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={handleToggle}>
                    <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item onClick={()=> props.handleroute('/home')} position='left'><Button as='a' inverted>
                    Home
                  </Button></Menu.Item>
                <Menu.Item onClick={props.logout} position='right'><Button as='a' inverted>
                    Log out
                  </Button></Menu.Item>
                </Menu>
                <HeaderTitle/>
              </Container>
              </div>
            
            {props.children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        
      </Media>
        </>
    )
}
MobileContainer.propTypes = {
  children: PropTypes.node,
  logout: ()=>{},
  handleroute: ()=>{}
}
export default function Header({ children }){
    const router = useRouter()
    const {userSession, auth} = useAuth()

    useEffect(() => {
        let mounted = true
        if(mounted){
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const currentUser = await new User().getUserbyUid(user.uid)
                userSession(user.uid,user.displayName,user.email,validateComission(currentUser.comission),validatePayDay(currentUser.payday))
            } else {  
              router.push('/')
            }
          });
        }
          return () =>{
            mounted = false
          }
    }, [auth, router, userSession])
      
    function handleroute(url){
        router.push({
            pathname: url
        })
    }

    function logout(){
        signOut(auth).then(()=>{
          router.push('/')
        }).catch(error => {
            console.log(error)
        })
    }
    return (<div className={styles.container}>
        <MediaContextProvider>
            <DesktopContainer logout={logout} handleroute={handleroute}>{ children }</DesktopContainer>
            <MobileContainer  logout={logout} handleroute={handleroute}>{ children }</MobileContainer>
        </MediaContextProvider>
    </div>)
}

Header.propTypes = {
  children: PropTypes.node,
}