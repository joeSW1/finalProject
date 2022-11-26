import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { onSnapshot, getFirestore, collection } from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';
import { useEffect, useState } from 'react';

let app;
const apps = getApps();

if (apps.length == 0) { 
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

function HomeScreen({navigation}) {
  const [displayName, setDisplayName] = useState('');
  const [currUserId, setCurrUserId] = useState(auth.currentUser?.uid);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    console.log(currUserId);
    onSnapshot(collection(db, 'users'), qSnap => {
      let newUsers = [];
      qSnap.forEach(docSnap => {
        let newUser = docSnap.data();
        newUser.key = docSnap.id;
        if (newUser.key === currUserId) {
          setDisplayName(newUser.displayName);
        }
        newUsers.push(newUser);
      });
      console.log('currUserId:', currUserId)
      console.log('updated users:', newUsers);
      setUsers(newUsers);
    })
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{paddingTop:'5%', fontWeight: '800', fontSize: '20'}}>
        Home Screen
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={users.filter(u=>u.uid==currUserId)}
          renderItem={({item}) => {
            return (
              <View>
                <Text style={{fontSize: 18}}>Current User: {item.displayName}</Text>
              </View>
            );
          }}
        />
        
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color="#000000"
          onPress={async () => {
            await signOut(auth);
            navigation.navigate('Login');
          }}
          style={{fontSize: 18}}

        >
          Sign out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'left',

    
  },
  listContainer: {
    flex: 0.05,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'left',
    alignItems: 'left',
    width: '100%'
  }
});

export default HomeScreen;