import { useRouter } from "next/router";
import {Grid, Icon } from "semantic-ui-react";
import styles from './../styles/Home.module.scss'
export default function Cards(){
    const router = useRouter()
    return(
        <div>
            <Grid divided>
                <Grid.Row centered columns={3}>
                    <Grid.Column textAlign="center">
                        <div className={styles.homebutton} onClick={()=> router.push('/addservice')}>
                        <Icon color='grey' circular  size='big' name='add'/>
                        <p>Lançar serviços</p>
                        </div>
                    </Grid.Column>
                    
                    <Grid.Column textAlign="center">
                        <div className={styles.homebutton} onClick={()=> router.push('/serviceList')}>
                        <Icon color='grey' circular  size='big' name='search'/>
                        <p>Consultar Serviços</p>
                        </div>
                    </Grid.Column>
                    <Grid.Column textAlign="center">
                        <div className={styles.homebutton} onClick={()=> router.push('/useraccount')}>
                        <Icon color='grey' circular  size='big' name='user'/>
                        </div>
                        <p>Gerenciar Conta</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}