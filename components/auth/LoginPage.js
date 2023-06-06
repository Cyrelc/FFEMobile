import React, {useContext, useState} from 'react'
import {View, Text, TextInput, Button, StyleSheet} from 'react-native'
import {AuthContext} from '../contexts/AuthContext'

export default function LoginPage(props) {
    const [username, setUsername] = useState('fastfex@telus.net')
    const [password, setPassword] = useState('charter3')
    const {authenticate} = useContext(AuthContext)

    const handleLogin = () => {
        authenticate(username, password)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <Button title="Log In" onPress={handleLogin} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,        
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    }
})
