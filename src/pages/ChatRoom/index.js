import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import Icon from "react-native-vector-icons/MaterialIcons";

import FabButton from "../../components/FabButton";
import ModalNewRoom from "../../components/ModalNewRoom";
import ChatList from "../../components/ChatList";

export default function ChatRoom() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);


  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null; 

    setUser(hasUser);

  }, [isFocused]);

  useEffect(() => {
    let isActive = true;

    function getChats() {
    firestore()
    .collection('MESSAGES_THREADS')
    .orderBy('lastMessage.createdAt', 'desc')
    .limit(10)
    .get()
    .then((snapshot) => {
      const threads = snapshot.docs.map((docSnapshot) => {
        return {
          _id: docSnapshot.id,
          name: '',
          lastMessage: { text: ''},
          ...docSnapshot.data()
          }
        })

        if (isActive) {
          setThreads(threads);
          setLoading(false);
        }
      })
    }

    getChats();

    return () => {
      isActive = false;
    }

  }, [isFocused, updateScreen]) //Toda mudança de estado do componente "UpdareScreen" irá disparar o useEffect e recarregar os dados
  function handleSignOut() {

    auth()
    .signOut()
    .then(() => {
      setUser(null);
      navigation.navigate('SignIn');
    })
    .catch(() => {
      console.log('Nenhum usuário logado');
    })
  }

   function deleteRoom(ownerId, roomId) {
    if(ownerId !== user.uid) return;

    Alert.alert(
      "Atenção!",
      "Tem certeza que deseja excluir essa sala?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => handleDeleteRoom(roomId)
        }
      ]
    )
  }

  async function handleDeleteRoom(roomId) {
    await firestore()
    .collection('MESSAGES_THREADS')
    .doc(roomId)
    .delete()
    .then(() => {
      setUpdateScreen(!updateScreen); //Atualizando a tela
    })
    .catch((error) => {
      alert('Ocorreu um erro ao excluir a sala', error);
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>

          { user &&(
            <TouchableOpacity onPress={handleSignOut}>
            <Icon name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          )}

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity>
          <Icon name="search" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FabButton
        setVisible={ () => setModalVisible(true)}
        userStatus={user}
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom 
          setVisible={() => setModalVisible(false)}
          setUpdateScreen={() => setUpdateScreen(!updateScreen)}
        />
      </Modal>

      <FlatList
        data={threads}
        keyExtractor={ item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={ ({ item }) => (
          <ChatList data={item} deleteRoom={() => deleteRoom(item.owner, item._id)} userStatus={user} />
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
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2e54d4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    paddingLeft: 10,
  }
});
