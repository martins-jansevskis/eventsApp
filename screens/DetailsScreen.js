import * as React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Button, Title, Paragraph } from 'react-native-paper';


const window = Dimensions.get('window').width;

export default function DetailsScreen({route, navigation}) {
    const [width, setWidth] = useState(window);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState();
    const { eventId } = route.params;

    const getEvent = async () => {
        try {
            const response = await fetch('https://app.ticketmaster.com/discovery/v2/events/'+eventId+'?apikey=');
            const json = await response.json();
            setData(json);
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
        getEvent();
        return () => subscription?.remove();
    }, []);

    return (
      <SafeAreaView style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
          <ScrollView>
          <View style={{ width: width, minWidth: 350, paddingRight: 15, paddingLeft: 15}}>
            <FlatList
              data={data.images}
              style={{ flex: 1 }}
              pagingEnabled={true}
              horizontal={true}
              keyExtractor={({ url }, index) => url}
              renderItem={({ item }) => 
                <View
                    style={{
                      width: width,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: width, height: 200 }}
                    ></Image>
                  </View>
            }
            />
            <Title>{data.name}</Title>
            <Paragraph>{data.info}</Paragraph>
            <Button onPress={()=> { navigation.navigate("Ticket", {uri: data.url})}}>Buy ticket</Button>
          </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight
    },
    viewPager: {
      flex: 1,
    },
    page: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });