import React, {Fragment, useContext, useState} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {Badge, Chip, IconButton, List, Text} from 'react-native-paper'
import {DateTime} from 'luxon'


import {BillContext, durationToHumanString, getBillTimeStyles} from '../contexts/BillContext'
import PressAndHoldButton from '../partials/PressAndHoldButton'
import { useNavigation } from '@react-navigation/native'

const BillListItemTitle = ({bill}) => {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <Chip style={{backgroundColor: 'orange', marginRight: 15, flex: 1}} elevated={true}>B{bill.bill_id}</Chip>
            <Chip style={{backgroundColor: 'orange', flex: 1, marginRight: 15}}>{bill.delivery_type}</Chip>
            {(bill.description || bill.internal_comment) && (
                <Chip icon='clipboard-text-outline' iconStyle={{color: 'black'}} closeIcon={() => null} style={{backgroundColor: 'orange', color: 'black', flex: 1, marginRight: 15}} ></Chip>
            )}
        </View>
    )
}

export default function Bills(props) {
    const billContext = useContext(BillContext)
    const navigation = useNavigation()

    const [expandPickup, setExpandPickup] = useState(true)
    const [expandDelivery, setExpandDelivery] = useState(true)

    const { bills } = billContext

    const unacknowledged = bills.filter(bill => bill.time_ten_foured == null).sort((a, b) => a.time_since_dispatch > b.time_since_dispatch)
    const awaitingPickup = bills.filter(bill => bill.time_ten_foured != null && bill.time_picked_up == null).sort((a, b) => a.time_until_pickup > b.time_until_pickup)
    const awaitingDelivery = bills.filter(bill => bill.time_ten_foured != null && bill.time_picked_up != null && bill.time_delivered == null).sort((a, b) => a.time_until_delivery > b.time_until_delivery)

    console.log(unacknowledged?.length, awaitingPickup?.length, awaitingDelivery?.length)

    return (
        <ScrollView>
            <List.Accordion
                left={() =>
                    <Fragment>
                        <List.Icon icon='radio-handheld' />
                        <Badge style={styles.countBadge}>{unacknowledged.length}</Badge>
                    </Fragment>
                }
                title='Unacknowledged'
                expanded={true}
                titleStyle={{ textAlign: 'center' }}
                right={() => null}
            >
                {unacknowledged.map(bill => {
                    return (
                        <List.Item
                            key={bill.bill_id}
                            title={<BillListItemTitle bill={bill} />}
                            description={() =>
                                <Text variant='bodyMedium'>
                                    <Text variant='labelLarge'>Time to 10-4: </Text>
                                    <Text style={{...getBillTimeStyles(bill.time_since_dispatch)}}>{durationToHumanString(bill.time_since_dispatch) + '\n'}</Text>
                                    <Text variant='labelLarge'>Pickup Name: </Text>{bill.pickup_address_name + '\n'}
                                    <Text variant='labelLarge'>Pickup Address: </Text>{bill.pickup_address_formatted + '\n'}
                                    <Text variant='labelLarge'>Pickup By: </Text>{bill.time_pickup_scheduled + '\n'}
                                    <Text variant='labelLarge'>Delivery Name: </Text>{bill.delivery_address_name + '\n'}
                                    <Text variant='labelLarge'>Delivery Address: </Text>{bill.delivery_address_formatted + '\n'}
                                    <Text variant='labelLarge'>Deliver By: </Text>{bill.time_delivery_scheduled + '\n'}
                                </Text>
                            }
                            right={() =>
                                <View>
                                    <PressAndHoldButton
                                        onPress={() => billContext.updateBill({bill_id: bill.bill_id, time_ten_foured: DateTime.now().toSQL()})}
                                        icon='package-variant'
                                    />
                                </View>
                            }
                            style={styles.listItem}
                            onPress={() => navigation.navigate('Bill', {bill_id: bill.bill_id })}
                        />
                    )
                })}
            </List.Accordion>
            <List.Accordion
                left={() =>
                    <Fragment>
                        <List.Icon icon='package-up' />
                        <Badge style={styles.countBadge}>{awaitingPickup.length}</Badge>
                    </Fragment>
                }
                title='Awaiting Pickup'
                expanded={expandPickup}
                onPress={() => setExpandPickup(!expandPickup)}
                titleStyle={{ textAlign: 'center' }}
            >
                {awaitingPickup.map(bill => (
                    <List.Item
                        key={bill.bill_id}
                        title={<BillListItemTitle bill={bill} />}
                        description={
                            <Fragment>
                                <Text variant='bodyMedium'>
                                    <Text variant='labelLarge'>Name: </Text>{bill.pickup_address_name + '\n'}
                                    <Text variant='labelLarge'>Pickup: </Text>{bill.pickup_address_formatted + '\n'}
                                    <Text variant='labelLarge'>Time Until: </Text>
                                    <Text style={{...getBillTimeStyles(bill.time_until_pickup)}}>{durationToHumanString(bill.time_until_pickup) + '\n'}</Text>
                                </Text>
                            </Fragment>
                        }
                        descriptionNumberOfLines={5}
                        right={() =>
                            <PressAndHoldButton
                                icon='truck-plus-outline'
                                onPress={() => billContext.updateBill({bill_id: bill.bill_id, time_picked_up: DateTime.now().toSQL()})}
                            />
                        }
                        style={styles.listItem}
                        onPress={() => navigation.navigate('Bill', {bill_id: bill.bill_id })}
                    />
                ))}
            </List.Accordion>
            <List.Accordion
                left={() =>
                    <Fragment>
                        <List.Icon icon='package-down' />
                        <Badge style={styles.countBadge}>{awaitingDelivery.length}</Badge>
                    </Fragment>
                }
                title='Awaiting Delivery'
                expanded={expandDelivery}
                onPress={() => setExpandDelivery(!expandDelivery)}
                titleStyle={{ textAlign: 'center' }}
            >
                {awaitingDelivery.map(bill => (
                    <List.Item
                        key={bill.bill_id}
                        title={<BillListItemTitle bill={bill} />}
                        description={
                            <Fragment>
                                <Text variant='bodyMedium'>
                                    <Text variant='labelLarge'>Name: </Text>{bill.delivery_address_name + '\n'}
                                    <Text variant='labelLarge'>Pickup: </Text>{bill.delivery_address_formatted + '\n'}
                                    <Text variant='labelLarge'>Time Until: </Text>
                                    <Text style={{...getBillTimeStyles(bill.time_until_delivery)}}>{durationToHumanString(bill.time_until_delivery) + '\n'}</Text>
                                </Text>
                            </Fragment>
                        }
                        right={() =>
                            <PressAndHoldButton
                                icon='truck-check-outline'
                                onPress={() => billContext.updateBill({bill_id: bill.bill_id, time_delivered: DateTime.now().toSQL()})}
                            />
                        }
                        style={styles.listItem}
                        onPress={() => navigation.navigate('Bill', {bill_id: bill.bill_id })}
                    />
                ))}
            </List.Accordion>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    billIdBadge: {
        borderRadius: 16,
        backgroundColor: 'cornflowerblue',
        fontSize: 16,
        marginRight: 20
    },
    countBadge: {
        position: 'relative',
        top: -8,
        left: 5
    },
    deliveryTypeBadge: {
        borderRadius: 16,
        backgroundColor: 'cornflowerblue',
        fontSize: 16,
        marginRight: 20,
        // backgroundColor: theme.colors.primary,
        // marginHorizontal: 30
    },
    hasDescriptionBadge: {
        borderRadius: 16,
        fontSize: 16,
        marginRight: 20,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 5,
        right: 5
    },
    listItem: {
        backgroundColor: 'gray',
        textColor: 'white',
        border: 'black',
        borderWidth: 1
    },
    whiteText: {
    },
    whiteTitle: {
        fontWeight: 'bold',
        paddingBottom: 5,
        fontSize: 14,
    }
})

