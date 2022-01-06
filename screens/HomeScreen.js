import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

const window = Dimensions.get('window').width;

export default function HomeScreen({navigation}) {
    const [width, setWidth] = useState(window);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getEvents = async () => {
        try {
         const response = await fetch('https://app.ticketmaster.com/discovery/v2/events.json?apikey=');
         const json = await response.json();
         setData(json._embedded.events);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', (change) => {
            setWidth(change.window.width);
        });
        getEvents();
        return () => subscription?.remove();
    }, []);

    return (
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
        <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({item}) => 
                <Card style={{ width: width}}>
                    <Card.Cover source={{ uri: item.images[0].url }} />
                    <Card.Content>
                        <Title>{item.name}</Title>
                        <Paragraph>{item.info}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={ () => navigation.navigate("Details", {eventId: item.id}) }>More</Button>
                    </Card.Actions>
                </Card>
            }
        />
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight
    }
  });