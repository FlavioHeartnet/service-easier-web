import HeaderMenu from './../components/header'
import {Container, Dimmer, Header, Icon, Segment} from 'semantic-ui-react'
import Cards from './../components/cards'
import HomeChart from './../components/homechart'
import { useAuth } from '../components/contexts/authContext'
export default function Home(){
    const { name ,updateTitlePage} = useAuth()
    updateTitlePage("Olá, " + name + " ;)")
    return (
        <>
        <HeaderMenu >    
            <Container>
            <br/><br/>
            <Cards/>
            <br/><br/>
            <HomeChart/>
            </Container>
            <br/>
        </HeaderMenu>
        
        </>
    )
}