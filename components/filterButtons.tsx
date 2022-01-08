import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Dropdown, Input } from "semantic-ui-react";
import Service from "../model/service";
import { calcComission } from "../Utils/validations";
import { useAuth } from "./contexts/authContext";

export default function FilterButtons(props){

    const {uid, updateRent, comission, updateServiceList, updateCurrentList, currentDayFilter} = useAuth()
    const [isFilter7, setFilter7] = useState(true)
    const [isFilter15, setFilter15] = useState(true)
    const [isFilter30, setFilter30] = useState(true)
    const [isFilterLoad7, setFilterLoad7] = useState(false)
    const [isFilterLoad15, setFilterLoad15] = useState(false)
    const [isFilterLoad30, setFilterLoad30] = useState(false)
    const [dateFilterInitial, setdateFilterInitial] = useState("")
    const [dateFilterFinal, setdateFilterFinal] = useState("")
    const [isFilterOpen, setisFilterOpen] = useState(false)
    async function filter(days:number){ 
        setFilter7(true)
        setFilter15(true)
        setFilter30(true)
        updateCurrentList(days,props.firebaseServiceList)
        if(days === 7){
            setFilter7(false)
            setFilterLoad7(true)
        }else if(days === 15 ){
            setFilter15(false)
            setFilterLoad15(true)
        }else if(days === 30){
            setFilter30(false)
            setFilterLoad30(true)
        }
        setFilterLoad7(false)
        setFilterLoad15(false)
        setFilterLoad30(false)
        
    }
    async function searchServices(){
        setisFilterOpen(!isFilterOpen)
        if(dateFilterInitial != "" && dateFilterFinal != ""){
        const services = await new Service().getDocumentByDate(dateFilterInitial, dateFilterFinal, uid)
        let rent = calcComission(services, comission == null ? 100 : comission)
        updateRent(rent[1], rent[0])
        updateServiceList(services)
        setFilter7(true)
        setFilter15(true)
        setFilter30(true)
        }
    }

    useEffect(() => {
        if(currentDayFilter === 7){
            setFilter7(false)
        }else if(currentDayFilter === 15 ){
            setFilter15(false)
        }else if(currentDayFilter === 30){
            setFilter30(false)
        }
    }, [currentDayFilter])

    return (
        <>
        <Button loading={isFilterLoad7} onClick={() =>filter(7)}  basic={isFilter7} color='pink'>7 dias</Button>
                <Button loading={isFilterLoad15} onClick={() =>filter(15)} basic={isFilter15}  color='pink'>15 dias</Button>
                <Button loading={isFilterLoad30} onClick={() =>filter(30)} basic={isFilter30}  color='pink'>30 dias</Button><p></p>
                <Dropdown onOpen={()=> setisFilterOpen(!isFilterOpen)} open={isFilterOpen} text='Busca personalizada' icon='filter' floating button>
                    <Dropdown.Menu >
                        <Dropdown.Item>
                            <Input action={{
                                color: 'pink',
                                labelPosition: 'left',
                                icon: 'filter',
                                content: 'Data incial',
                                }} actionPosition='left' onChange={(e)=> setdateFilterInitial(e.target.value)} placeholder='Data inicial' type='date'/>
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item><Input action={{
                            color: 'pink',
                            labelPosition: 'left',
                            icon: 'filter',
                            content: 'Data final',
                            }} actionPosition='left' onChange={(e)=> setdateFilterFinal(e.target.value)} placeholder='Data final' type='date'/></Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item><Button onClick={()=> searchServices()} fluid color='pink'>Buscar</Button></Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
        </>
    )
}