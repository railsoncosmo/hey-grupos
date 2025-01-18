import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

export default function ModalNewRoom({ setVisible }) {
  const [roomName, setRoomName] = useState("");

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisible}>
        <View style={styles.modal}></View>
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Criar um novo grupo</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do grupo"
          value={roomName}
          onChangeText={(text) => setRoomName(text)}
        />

        <TouchableOpacity style={styles.buttonCreate}>
          <Text style={styles.buttonCreateText}>Criar Sala</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(34, 34, 34, 0.4)",
  },
  modal: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
  },
  title: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderRadius: 4,
    height: 45,
    backgroundColor: "#DDD",
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  buttonCreate: {
    backgroundColor: "#2e54d4",
    height: 45,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCreateText: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "bold",
  }
});
