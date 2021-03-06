import { useMemo } from 'react'
import { AxisOptions, Chart } from 'react-charts'
import ChartData from './../mocks/chatmockhome'
import FilterButtons from './filterButtons';
import { useEffect, useState } from 'react'
import Service from '../model/service'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import moment from 'moment'
import { useAuth } from './contexts/authContext';
import { Segment } from 'semantic-ui-react';

export default function HomeChart(){
    const { updateCurrentList, uid,db, currentDayFilter, chartdatabyDate} = useAuth()
    const [isLoading, setLoading] = useState(false)
    const { data } = ChartData({
      series: 1,
      dataType: "time",
      datums: chartdatabyDate.length == 0 ? 0: chartdatabyDate.length ,
      dataSet: chartdatabyDate
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
      },
    ],
    []
  );

    const [firebaseServiceList, setFirebaseServiceList] = useState([new Service()])
    useEffect(() => {
        let services: Service[] = []
        try{
            if(uid!= undefined && uid!= null){
              setLoading(true)
                const q = query(collection(db, Service.COLLECTION_NAME), where("uid", "==", uid),orderBy("serviceDate", "desc"),limit(250));
                const unsub = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const docService = change.doc.data()
                            services.push(new Service(
                                change.doc.id, uid.toString(),
                                docService.name,
                                docService.service,
                                docService.price,
                                moment.unix(docService.serviceDate.seconds).toDate()
                            ));                          
                        }
                        if (change.type === "modified") {
                            
                            const docService = change.doc.data()
                            const modifyService = new Service(
                                 change.doc.id, uid.toString(),
                                 docService.name,
                                 docService.service,
                                 docService.price,
                                 moment.unix(docService.serviceDate.seconds).toDate()
                             );
                             let serviceItemToModify = services.filter((a)=> a.id === modifyService.id)
                             services[services.indexOf(serviceItemToModify[0])] = modifyService
                        
                             
                        }
                        if (change.type === "removed") {
                            let serviceItemToRemove = services.filter((a)=> a.id === change.doc.id)
                            services.splice(services.indexOf(serviceItemToRemove[0]),1)
                        }
                        });
                        setLoading(false)
                        setFirebaseServiceList(services)
                        updateCurrentList(currentDayFilter,services)
                });
                }
            
        }catch(e){
            console.log(e)
        }
    },[currentDayFilter, db, uid])
  
    return (
        <Segment loading={isLoading} basic style={{'height': '300px', 'padding': '0'}}>
            <h2>Clientes atendidos</h2>
            <FilterButtons firebaseServiceList={firebaseServiceList}/>
            <Chart options={{data, primaryAxis,secondaryAxes, defaultColors:['#ea158d'] }}/>
        </Segment>
    )
}