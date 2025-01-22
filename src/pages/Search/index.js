import React, { useState, useEffect } from 'react';
import {
View, 
Text, 
StyleSheet,
SafeAreaView,
TouchableOpacity,
TextInput, 
Keyboard,
FlatList,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatList from '../../components/ChatList';

export default function Search() {
  const isFocused = useIsFocused();

  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null; 
    setUser(hasUser);

  }, [isFocused]);

  async function handleSearch() {
    if(input === '') return;

    const responseSearch = await firestore()
    .collection('MESSAGES_THREADS')
    .where('name', '>=', input)
    .where('name', '<=', input + '\uf8ff')
    .get()
    .then((querySnapshot) => {
      
      const threads = querySnapshot.docs.map( docSnapshot => {
        return {
          _id: docSnapshot.id,
          name: '',
          lastMessage: { text: '' },
          ...docSnapshot.data()
        }
    })

    setChats(threads);
    setInput('');
    Keyboard.dismiss(); //Fecha o teclado
  })
}

 return (
   <SafeAreaView style={styles.container}>
    <View style={styles.containerInput}>
      <TextInput
        placeholder="Digite o nome da sala"
        onChangeText={(text) => setInput(text)}
        style={styles.input}
        autoCapitalize={"none"}
      />

      <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
        <MaterialIcons name="search" size={30} color="#FFF"/>
      </TouchableOpacity>
    </View>

    <FlatList
      showsVerticalScrollIndicator={false}
      data={chats}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ChatList data={item} userStatus={user} />
      )}
    />

   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  containerInput: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginVertical: 14,
  },
  input: {
    backgroundColor: "#ebebeb",
    marginLeft: 10,
    height: 50,
    width: "80%",
    borderRadius: 4,
    padding: 5,
  },
  buttonSearch: {
    backgroundColor: "#2e54d4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    width: '15%',
    marginLeft: 5,
    marginRight: 10
  },
});