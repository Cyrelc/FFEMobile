import React, {Fragment, useContext, useState} from 'react'
import {Card, Title} from 'react-native-paper'
import {Text, ScrollView} from 'react-native'
import {BillContext, durationToHumanString, getBillTimeStyles} from '../contexts/BillContext'

export default function Bill({ navigation, route }) {
    const [expanded, setExpanded] = useState(false)
    const billContext = useContext(BillContext)

    const bill = billContext.bills.find(bill => bill.bill_id = route.params.bill_id)
    console.log(route.params.bill_id, bill)

    return (
        <ScrollView>
            <Card>
                <Card.Content style={{ alignItems: 'center'}}>
                    <Title style={{fontWeight: 'bold'}}>Pickup</Title>
                </Card.Content>
                <Card.Content style={{borderBottomColor: 'dimgray', borderBottomWidth: 2}}>
                    <Text><Text style={{fontWeight: 'bold'}}>Name: </Text>{bill.pickup_address_name}</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>Address: </Text>{bill.pickup_address_formatted}</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>Scheduled: </Text>{bill.time_pickup_scheduled}</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>Picked Up: </Text>{bill.time_picked_up}</Text>
                    {!bill.time_picked_up &&
                        <Text style={{...getBillTimeStyles(bill.time_until_pickup)}}>
                            <Text style={{fontWeight: 'bold'}}>Time Until Pickup: </Text>{durationToHumanString(bill.time_until_pickup)}
                        </Text>
                    }
                    <Text><Text style={{fontWeight: 'bold'}}>Driver: </Text>{bill.pickup_driver_id}</Text>
                </Card.Content>
                <Card.Content style={{ alignItems: 'center'}}>
                    <Title style={{fontWeight: 'bold'}}>Delivery</Title>
                </Card.Content>
                <Card.Content style={{borderBottomColor: 'dimgray', borderBottomWidth: 2}}>
                    <Text><Text style={{fontWeight: 'bold'}}>Name: </Text>{bill.delivery_address_name}</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>Address: </Text>{bill.delivery_address_formatted}</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>Scheduled: </Text>{bill.time_pickup_scheduled}</Text>
                    <Text><Text style={{fontWeight: 'bold'}}>Delivered: </Text>{bill.time_picked_up}</Text>
                    {!bill.time_delivered &&
                        <Text style={{...getBillTimeStyles(bill.time_until_delivery)}}>
                            <Text style={{fontWeight: 'bold'}}>Time Until Delivery: </Text>{durationToHumanString(bill.time_until_delivery)}
                        </Text>
                    }
                    <Text><Text style={{fontWeight: 'bold'}}>Driver: </Text>{bill.delivery_driver_id}</Text>
                </Card.Content>
                {bill.description &&
                    <Fragment>
                        <Card.Content style={{ alignItems: 'center'}}>
                            <Title style={{fontWeight: 'bold'}}>Notes: </Title>
                        </Card.Content>
                        <Card.Content style={{borderBottomColor: 'dimgray', borderBottomWidth: 2}}>
                            <Text>{bill.description}</Text>
                        </Card.Content>
                    </Fragment>
                }
                {bill.internal_comments &&
                    <Fragment>
                        <Card.Content style={{ alignItems: 'center'}}>
                            <Title style={{fontWeight: 'bold'}}>Internal Comments: </Title>
                        </Card.Content>
                        <Card.Content style={{borderBottomColor: 'dimgray', borderBottomWidth: 2}}>
                            <Text>{bill.internal_comments}</Text>
                        </Card.Content>
                    </Fragment>
                }
            </Card>
        </ScrollView>
    )
}



