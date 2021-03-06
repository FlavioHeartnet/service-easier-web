import HeaderMenu from './../components/header'
import {Container} from 'semantic-ui-react'
import Cards from './../components/cards'
import HomeChart from './../components/homechart'
import { useAuth } from '../components/contexts/authContext'
export default function Home(){
    const { name ,updateTitlePage} = useAuth()
    updateTitlePage("Olá, " + name + " ;)")
    
    return (
        <>
        <HeaderMenu>    
            <Container style={{'height': '650px'}}>
            <br/><br/>
            <Cards/>
            <br/>
            <HomeChart/>
            </Container>
        </HeaderMenu>
        </>
    )
}