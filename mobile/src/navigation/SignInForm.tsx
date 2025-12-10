import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../contexts/auth";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
type RootStackParamList = {
  SignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  UserRegister: undefined;
  Home: undefined;
};

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

interface Props {
  navigation: SignInScreenNavigationProp;
}
const SignInForm: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await login(email, password);

      if (result?.error) {
        Toast.show({ type: "error", text1: result.error });
        return;
      }

      Toast.show({ type: "success", text1: "Login successful" });
      navigation.replace("Home");
    } catch (err) {
      Toast.show({ type: "error", text1: "Unexpected error" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("UserRegister")}>
        <Text style={styles.link}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
};


export default SignInForm;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 30, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  link: { color: "#007bff", marginTop: 15, textAlign: "center" },
});
