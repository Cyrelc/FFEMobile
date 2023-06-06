import React, {createContext, useContext, useEffect, useState} from 'react'
import axios from 'axios'
import {DateTime} from 'luxon'
import {Animated} from 'react-native'

import {AuthContext} from './AuthContext' 

export const BillContext = createContext()

export const durationToHumanString = duration => {
    duration = duration.shiftToAll()
    const weeks = duration.weeks
    const days = duration.days
    const hours = duration.hours
    const minutes = duration.minutes

    let result = '';
    if (weeks != 0) {
        result += `${weeks} week${weeks != 1 ? 's' : ''}, `;
    }
    if (days != 0) {
      result += `${days} day${days != 1 ? 's' : ''}, `;
    }
    if (hours != 0) {
      result += `${hours} hour${hours != 1 ? 's' : ''}, `;
    }
    if (minutes != 0) {
      result += `${minutes} minute${minutes != 1 ? 's' : ''}`;
    }

    // Trim the last comma and space if present
    if (result.endsWith(', ')) {
      result = result.substring(0, result.length - 2);
    }

    return result;
}

const animationValue = new Animated.Value(0)

export const getBillTimeStyles = timeUntil => {
    timeUntil = timeUntil.as('minutes')

    if(timeUntil > 240)
        return {
            backgroundColor: 'green'
        }
    else if (timeUntil > 60)
        return {
            backgroundColor: 'yellow'
        }
    else if (timeUntil > 0)
        return {
            backgroundColor: 'orange'
        }
    else
        return {
            backgroundColor: 'tomato'
        }
}

export const BillProvider = ({children}) => {
    const authContext = useContext(AuthContext)

    const [bills, setBills] = useState([])

    const processBills = billsToProcess => {
        console.log(billsToProcess[0])
        const processedBills = billsToProcess.map(bill => {
            const timeUntilDelivery = DateTime.fromISO(bill.time_delivery_scheduled?.replace(' ', 'T')).diffNow()
            const timeUntilPickup = DateTime.fromISO(bill.time_pickup_scheduled?.replace(' ', 'T')).diffNow()
            const timeSinceDispatch = DateTime.fromISO(bill.time_dispatched?.replace(' ', 'T')).plus({minutes: 30}).diffNow()

            return {
                ...bill,
                time_since_dispatch: timeSinceDispatch,
                time_until_delivery: timeUntilDelivery,
                time_until_pickup: timeUntilPickup
            }
        })

        setBills(processedBills)
    }

    useEffect(() => {
        if(authContext.isAuthenticated)
            fetchBills()
        else
            setBills([])
    }, [authContext.isAuthenticated])

    const fetchBills = () => {
        // console.log("attempting to fetch bills")

        const getBills = async () => {
            try {
                const response = await axios.get(`/getBillsByDriver`)

                if(response.data.bills)
                    processBills(response.data.bills)
            } catch (error) {
                console.error(error)
                console.error(error.message)
                console.error(error.name)
                console.error(error.response)
            }
        }

        getBills()
    }

    const updateBill = async (bill) => {
        try {
            console.log(bill)

            const response = await axios.post(`/bills/setTime`, bill)
            console.log(response.data.bills.length)

            if(response.status == 200)
                processBills(response.data.bills)

        } catch (error) {
            console.log(bill.bill_id)
            console.error(error)
            console.error(error.message)
            console.error(error.name)
            console.error(error.response)
        }
    }

    return (
        <BillContext.Provider
            value={{
                bills,
                fetchBills,
                getBillTimeStyles,
                updateBill
            }}
        >
            {children}
        </BillContext.Provider>
    )
}

