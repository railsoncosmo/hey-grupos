import React, { useState, useEffect } from 'react';
import {
View, 
Text, 
StyleSheet, 
FlatList, 
SafeAreaView, 
KeyboardAvoidingView, 
Platform, 
TextInput ,
TouchableOpacity,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Feather from 'react-native-vector-icons/Feather';

import ChatMessage from '../ChatMessage';

export default function Messages({ route }) {

  const { threads } = route.params; //Recebe o parametro da rota com os dados do objeto
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const user = auth().currentUser.toJSON();

  useEffect(() => {

    const unSubscribeListener = firestore().collection('MESSAGES_THREADS')
    .doc(threads._id)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .onSnapshot( querySnapshot => {
      const messages = querySnapshot.docs.map( doc => {
        const firebaseData = doc.data()

        const data = {
          _id: doc.id,
          text: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...firebaseData
        }

        if(!firebaseData.system){ //Se for um sistema, não mostra na tela.
          data.user= {
            ...firebaseData.user,
            name: firebaseData.user.displayName
          }
        }

        return data;

      })

      setMessages(messages);


    })

    return () => unSubscribeListener();

  }, []);

  async function handleSend() {

    if(input === '') return;

    await firestore()
    .collection('MESSAGES_THREADS')
    .doc(threads._id)
    .collection('MESSAGES')
    .add({
      text: input,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: user.uid,
        displayName: user.displayName
      }
    })
    
    await firestore()
    .collection('MESSAGES_THREADS')
    .doc(threads._id)
    .set(
      { //Valores que serão atualizados
      lastMessage: {
        text: input,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }
    },
    { merge: true } //Habilita a atualização parcial do documento, sem sobreescrever o documento completo.
  )
  .then(() => {
    setInput('');
  })
}

 return (
   <SafeAreaView style={styles.container}>
    <FlatList
      style={{width: '100%'}}
      data={messages}
      keyExtractor={ item => item._id}
      renderItem={ ({item}) => <ChatMessage data={item} />}
      inverted={true}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ width: '100%' }}
      keyboardVerticalOffset={100}
    >

      <View style={styles.containerInput}>
        <View style={styles.mainContainerInput}>
          <TextInput
            placeholder='Sua mensagem...'
            style={styles.textInput}
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline={true} //Permite que o texto seja digitado em várias linhas
            autoCorrect={false} //Desativa a correção automática do teclado do dispositivo
          />
        </View>
        <TouchableOpacity onPress={handleSend} >
          <View style={styles.buttonContainer}>
          <Feather name="send" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>

   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInput: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end',
  },
  mainContainerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 130, //Define a altura máxima do campo de digitação do input
    minHeight: 48, //Define a altura mínima do campo de digitação do input
  },
  buttonContainer: {
    backgroundColor: '#51c880',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    borderRadius: 25,
  }
});