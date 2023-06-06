import React, {useContext} from 'react'

import {BillContext} from '../contexts/BillContext'
import {DrawerContentScrollView, createDrawerNavigator, DrawerItemList, DrawerItem} from '@react-navigation/drawer'
import {IconButton} from 'react-native-paper'
import {AuthContext} from '../contexts/AuthContext'

import Bills from '../bills/Bills'

const Drawer = createDrawerNavigator()

const DrawerContent = props => {
    const authContext = useContext(AuthContext)

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Log Out" onPress={authContext.logout} />
        </DrawerContentScrollView>
    )
}

export default function Home() {
    const billContext = useContext(BillContext)

    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} >
            <Drawer.Screen name="Bills" right={() => <IconButton icon='refresh' onPress={() => billContext.fetchBills()} />} component={Bills} />
        </Drawer.Navigator>
    )
}


