import { Card } from "semantic-ui-react";
export default function Cards(){

    const items = [
        {
          header: 'Numero de Serviços feitos no mês',
          description:
            '25',
          meta: 'Números de serviços prestados a clientes.',
          color: 'pink',
          fluid: true
        },
        {
          header: 'Rentabilidade do mês',
          description:
            'R$ 500,00',
          meta: 'Valores atualizados sem o desconto de comissão.',
          color: 'pink',
          fluid: true
        },
        {
          header: 'Lucro previsto do mês',
          description:
            'R$ 250,00',
          meta: 'Valores a serem recebidos no dia 15/12/2021',
          color: 'pink',
          fluid: true
        },
      ]


    return(
        <div>
            <Card.Group doubling itemsPerRow='3' centered items={items} />
        </div>
    )
}