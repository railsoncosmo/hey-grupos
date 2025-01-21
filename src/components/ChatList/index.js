import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatList({ data, deleteRoom, userStatus }) {
  const navigation = useNavigation();

  function openChat(){
    if(userStatus){ //Se houver usuário logado, tem acesso aos chats.
      navigation.navigate("Messages", { threads: data });
    }else { //Se não houver usuário logado, volta para a tela de login.
      navigation.navigate("SignIn");
    }
  }

  return (
    <TouchableOpacity onLongPress={deleteRoom} onPress={() => {openChat()}}>
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.nameText} numberOfLines={1}>
              {data.name}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.contentText}>
            {data.lastMessage.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgba(241, 240, 245, 0.9)',
    marginVertical: 4,
  },
  content: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
  },
  contentText: {
    color: '#c1c1c1',
    fontSize: 16,
    marginTop: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  }
});
