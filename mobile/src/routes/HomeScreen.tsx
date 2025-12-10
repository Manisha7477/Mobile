import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../contexts/auth";

const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user?.username || "User"} 🎉</Text>
      <Text style={styles.subtitle}>You are now logged in.</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, opacity: 0.7 },
});
