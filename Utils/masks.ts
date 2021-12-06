
const maskPriceBr = (value:string) => {
    let maskoptions={
        mask: 'R$ 9999,99',
        value: value
    }
    if(value.length === 8){          
        maskoptions.mask = 'R$ 99,999'
    }else if(value.length === 9){
        maskoptions.mask = 'R$ 999,999'
    }else if(value.length === 6){
        maskoptions.mask = 'R$ 9,999'
    }
    return maskoptions
}
export default maskPriceBr
