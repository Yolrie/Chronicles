import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>LoginScreen</Text>
            <Button 
                onPress={() =>{
                    console.log('You tapped the button Home screen!');
                }}
                title="Aller à Home Screen"
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});


export default LoginScreen;
