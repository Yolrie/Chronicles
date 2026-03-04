import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const LoginScreen = () => {
    return (
        <View
        style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text>LoginScreen</Text>
            <Button 
                onPress={() =>{
                    console.log('You tapped the button home screen!');
                }}
                title="Aller à Home Screen"
            />
        </View>
    )
}

export default LoginScreen();
