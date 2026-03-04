import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = () => {
    return (
        <View
        style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text>HomeScreen</Text>
            <Button 
                onPress={() =>{
                    console.log('You tapped the button login screen!');
                }}
                title="Aller à Login Screen"
            />
        </View>
    )
}

export default HomeScreen();
