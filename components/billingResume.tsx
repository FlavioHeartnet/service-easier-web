import { useState } from "react";
import { Item } from "semantic-ui-react";
import { priceFormat, validateComission, validatePayDay } from "../Utils/validations";
import { useAuth } from "./contexts/authContext";

export default function BillingResume(props){
    const {comission, payday}=useAuth()
    return (
        <Item.Group>
        <Item>
        <Item.Content>
            <Item.Meta>Comissão atual</Item.Meta>
            <Item.Header>{priceFormat(props.profit, props.currentCurrency)}</Item.Header>
            <Item.Description>
                Faturamento atual: <b>{priceFormat(props.rentability, props.currentCurrency)}</b>
            </Item.Description>
            <Item.Extra>% da comissão: <b>{validateComission(comission)}%</b></Item.Extra>
            <Item.Extra>Data de recebimento a cada: <b>{validatePayDay(payday)} dias</b></Item.Extra>
        </Item.Content>
        </Item>
        </Item.Group>
    )
}