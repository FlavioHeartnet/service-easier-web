import { Card, Grid, Icon, IconGroup } from "semantic-ui-react";
import  './../styles/Home.module.scss'
export default function Cards(){
    return(
        <div>
            <Grid>
                <Grid.Row>
                    <Icon color='pink' circular inverted size='big' name='add'/>
                    <Icon color='pink' circular inverted size='big' name='search'/>
                    <Icon color='pink' circular inverted size='big' name='user'/>
                </Grid.Row>
            </Grid>
        </div>
    )
}