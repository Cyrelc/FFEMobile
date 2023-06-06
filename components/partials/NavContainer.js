import React, {useContext} from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import {AuthContext} from '../contexts/AuthContext'
import Home from '../partials/Home'
import LoginPage from '../auth/LoginPage'
import Bill from '../bills/Bill'

const Stack = createStackNavigator()

export default function NavContainer(props) {
    const authContext = useContext(AuthContext)

    if(authContext.isAuthenticated)
        return (
            <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <Stack.Screen
                    component={Home}
                    name="Fast Forward Express Mobile"
                />
                <Stack.Screen
                    component={Bill}
                    name="Bill"
                    options={({route}) => ({
                        title:`Bill# ${route.params.bill_id}`
                    })}
                />
            </Stack.Navigator>
        )
    
    return (
        <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
            <Stack.Screen name="Log in page" component={LoginPage} />
        </Stack.Navigator>
    )
}

