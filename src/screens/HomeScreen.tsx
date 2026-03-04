import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>HomeScreen</Text>
            <Button 
                onPress={() =>{
                    console.log('You tapped the button login screen!');
                }}
                title="Aller à Login Screen"
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


export default HomeScreen;
