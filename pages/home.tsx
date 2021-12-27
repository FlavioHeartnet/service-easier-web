import Header from './../components/header'
import {Container} from 'semantic-ui-react'
import Cards from './../components/cards'
import HomeChart from './../components/homechart'
import styles from './../styles/Home.module.scss'
export default function Home(){
    return (
        <>
        <Header >
        <Container>
        <br/><br/>
                <Cards/>
                <br/><br/>
                <HomeChart/>
            </Container>
            <br/>
        </Header>
        
        </>
    )
}