import React, {createContext, useEffect, useState} from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import * as Device from 'expo-device'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [enableDevMode, setEnableDevMode] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')

    axios.interceptors.response.use(
        response => {
            return response
        },
        error => {
            if (error.response.status === 401) {
                //setIsAuthorized(false)
                setUsername('')
                console.log('401 error occurred')
            }
            return Promise.reject(error)
        }
    )

    useEffect(() => {
        if(enableDevMode)
            axios.defaults.baseURL = 'http://192.168.0.215:8000/api'
        else
            axios.defaults.baseURL = 'https://fastforwardexpress.ca/api'
    }, [enableDevMode])

    useEffect(() => {
        const bootstrapAsync = async () => {
            let sanctumToken;
            try {
                sanctumToken = await SecureStore.getItemAsync("sanctum_token");
            } catch (error) {
                console.log("No existing token found")
            }
    
            if (sanctumToken) {
                console.log("Found existing user token!")
                axios.defaults.headers.common['Authorization'] = `Bearer ${sanctumToken}`
                setIsAuthenticated(true)
            }
        }

        bootstrapAsync()
    }, [])

    const authenticate = async(email, password) => {
        try {
            const device_name = Device.deviceName ?? Device.modelName

            console.log("data", email, password, device_name)

            const response = await axios.post('/login', {
                email,
                password,
                device_name
            })

            await SecureStore.setItemAsync("sanctum_token", response.data.sanctum_token)

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.sanctum_token}`
            axios.defaults.headers.common['X-Device-Name'] = `${device_name}`

            setIsAuthenticated(true)
            setUsername(response.data.display_name)
        } catch (error) {
            console.error("Unhandled error in [authenticate]: ", error)
        }
    }

    const logout = async() => {
        try {
            await SecureStore.deleteItemAsync("sanctum_token")

            delete axios.defaults.headers.common['Authorization']

            setIsAuthenticated(false)
            setUsername('')
        } catch (error) {
            console.error("Unhandled exception in [logout]: ", error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                authenticate,
                isAuthenticated,
                logout,
                username,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

