import React from "react";
import {
View, 
Text, 
TouchableOpacity, 
StyleSheet,
} from "react-native";

export default function FabButton({ setVisible }) {
  function handleNavigateButton() {
    setVisible();
  }

  return (
    <TouchableOpacity
      style={styles.fabButton}
      activeOpacity={0.9}
      onPress={handleNavigateButton}
    >
      <View>
        <Text style={styles.fabButtonText}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    width: 60,
    height: 60,
    backgroundColor: "#2e54d4",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    right: "6%",
    zIndex: 99,
  },
  fabButtonText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },
});
