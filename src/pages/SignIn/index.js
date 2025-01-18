import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import auth from '@react-native-firebase/auth';

export default function SignIn() {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(false);

  function handleLogin() {
    if(type){

      if( name === '' || email === '' || password === '' ){
        alert('Preencha todos os campos');
        return;
      }

      auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user.updateProfile({
          displayName: name
        })
        .then( () => {
          navigation.goBack();
        })
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Email já está em uso!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('Email invalido!');
        }
      })
    }else {

      if( email === '' || password === '' ){
        alert('Preencha todos os campos');
        return;
      }

      auth()
      .signInWithEmailAndPassword(email, password)
      .then( () => {
        navigation.goBack();
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('Email já está em uso!');
        }
    
        if (error.code === 'auth/invalid-email') {
          alert('Email invalido!');
        }
      })
    }
  }

 return (
   <SafeAreaView style={styles.container}>

    <Text style={styles.logo}>HeyGrupos</Text>
    <Text style={{ marginBottom: 20}}>Ajude, colabore e faça networking</Text>

    { type && ( //Renderiza o inout apenas se type for verdadeiro
      <TextInput
      style={styles.input}
      placeholder='Qual o seu nome?'
      placeholderTextColor="#99999B"
      value={name}
      onChangeText={ (text) => setName(text) }
    />
    )}

    <TextInput
      style={styles.input}
      placeholder='Digite seu e-mail'
      placeholderTextColor="#99999B"
      value={email}
      onChangeText={ (text) => setEmail(text) }
    />

    <TextInput
      style={styles.input}
      placeholder='Digite sua senha'
      placeholderTextColor="#99999B"
      value={password}
      onChangeText={ (text) => setPassword(text) }
      secureTextEntry={true}
    />

    <TouchableOpacity 
      style={[styles.buttonLogin, {backgroundColor: type ? '#F53745' : '#57DD86'} ]}
      onPress={handleLogin}    
    >
      <Text style={styles.buttonText}>
        { type ? "Cadastrar" : "Acessar" }
      </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setType(!type)}>
      <Text>
        { type ? "Já possuo uma conta" : "Criar uma nova conta" }
      </Text>
    </TouchableOpacity>

   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    marginTop: Platform.OS === "android" ? 55 : 80,
    fontSize: 28,
    fontWeight: "bold",
  },
  input: {
    color: '#121212',
    backgroundColor: '#ebebeb',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttonLogin: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  }
});