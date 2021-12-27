import HeaderMenu from './../components/header'
import {Container, Dimmer, Header, Icon, Segment} from 'semantic-ui-react'
import Cards from './../components/cards'
import HomeChart from './../components/homechart'
export default function Home(){
    return (
        <>
        <HeaderMenu >
        
            <Dimmer.Dimmable as={Segment} dimmed>
                <Dimmer active>
                <Header as='h2' icon inverted>
                <Icon name='heart' />
                    Esta pagina ainda esta em construção :) <br/> em breve ela estará disponivel
                </Header>
                </Dimmer>
                <Container>
                <br/><br/>
                <Cards/>
                <br/><br/>
                <HomeChart/>
                </Container>
                </Dimmer.Dimmable>
            
            <br/>
            
        </HeaderMenu>
        
        </>
    )
}