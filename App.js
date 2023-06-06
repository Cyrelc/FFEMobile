import React from 'react'
import 'intl'
import 'intl/locale-data/jsonp/en'

import {NavigationContainer} from '@react-navigation/native'

import {AuthProvider} from './components/contexts/AuthContext'
import {BillProvider} from './components/contexts/BillContext'
import NavContainer from './components/partials/NavContainer'

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BillProvider>
          <NavContainer/>
        </BillProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

