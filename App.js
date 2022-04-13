import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,ScrollView, Text, View, FlatList, SafeAreaView, LogBox, Image } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';

import LoginScreen from './Login';

function renderCorona({item}){
    const icon = <Image style={{width: 30, height: 20}}
                        source={{uri: `https://covid19.who.int/countryFlags/${item.code}.png`}}/>;
    const desc = <View>
        <Text>{"ผู้ป่วยสะสม " + item.confirmed + " ราย"}</Text>
        <Text>{"เสียชีวิต " + item.death + " ราย"}</Text>
        <Text>{"รักษาหาย " + item.cure + " ราย"}</Text>
    </View>;
    return <List.Item title={item.name} description={desc} left={(props=>icon)}></List.Item>
}

function Loading(){
  return <View><Text>Loading</Text></View>
}


const FirebaseConfig = {
  apiKey: "AIzaSyBzekSs2A820ekuzBVZo5BBUAIVL_Ds0Kk",
  authDomain: "webapp-70c79.firebaseapp.com",
  databaseURL: "https://webapp-70c79-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webapp-70c79",
  storageBucket: "webapp-70c79.appspot.com",
  messagingSenderId: "196241390829",
  appId: "1:196241390829:web:99ef5fc3e4b905fd8fa0e4",
  measurementId: "G-9J6R4YF12F"
};
LogBox.ignoreAllLogs(true);

try {
  firebase.initializeApp(FirebaseConfig);
} catch (err) {   }

function dbListener(path,setData){
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot)=>{
    setData(snapshot.val());
  })
}

export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
      const auth = getAuth();
      auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
  }, []);

  if(user==null){
    return <LoginScreen/>;
  }

  if(corona.length==0){
    return <Loading/>;
  }

  return (
      <PaperProvider>
        <View style={styles.container}>
            <ScrollView>
              <Card>
                <Card.Cover source={{uri:"https://images.unsplash.com/photo-1584573062942-d46bb3aee3fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80"}}/>
                <Card.Title title={"Coronavirus Situation"+corona.length}/>
                <Card.Content>
                  <Text>Your Phone Number: {user.phoneNumber}</Text>
                  <FlatList data={corona} renderItem={renderCorona}/>
                </Card.Content>
              </Card>
            </ScrollView>
            <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
                Sign Out
            </Button>
            <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />
        </View>
      </PaperProvider>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
});
