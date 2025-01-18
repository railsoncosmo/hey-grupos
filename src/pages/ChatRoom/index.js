import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialIcons";
import auth from "@react-native-firebase/auth";
import FabButton from "../../components/FabButton";
import ModalNewRoom from "../../components/ModalNewRoom";

export default function ChatRoom() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  function handleSignOut() {

    auth()
    .signOut()
    .then(() => {
      navigation.navigate('SignIn');
    })
    .catch(() => {
      console.log('Nenhum usuário logado');
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          <TouchableOpacity onPress={handleSignOut}>
            <Icon name="logout" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity>
          <Icon name="search" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FabButton
        setVisible={ () => setModalVisible(true) }
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom setVisible={ () => setModalVisible(false) }/>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
