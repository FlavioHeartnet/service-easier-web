import { useMemo } from 'react'
import { AxisOptions, Chart } from 'react-charts'
import ChartData from './../mocks/chatmockhome'
import {Button} from 'semantic-ui-react'
export default function HomeChart(){
    const { data } = ChartData({
        series: 1,
        dataType: "time",
      });
      const primaryAxis = useMemo<
      AxisOptions<typeof data[number]["data"][number]>
    >(
      () => ({
        getValue: (datum) => datum.primary as Date,
      }),
      []
    );
  
    const secondaryAxes = useMemo<
      AxisOptions<typeof data[number]["data"][number]>[]
    >(
      () => [
        {
          getValue: (datum) => datum.secondary,
          stacked: true,
          // OR
          // elementType: "area",
        },
      ],
      []
    );
  
    return (
        <div style={{height: '300px'}}>
            <h2>Clientes atendidos</h2>
            <Button  active color='pink' content='7d' />
            <Button basic color='pink' content='1m' />
            <Button basic color='pink' content='1aa' />
            <Button basic color='pink' content='3aa' />
            <Chart options={{data, primaryAxis,secondaryAxes, defaultColors:['#ea158d'] }}/>
        </div>
    )
}