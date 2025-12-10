import { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/contexts/auth";
import Toast from "react-native-toast-message";

// Import screens
import HomeScreen from "../mobile/src/routes/HomeScreen";
import SignInScreen from "../mobile/src/navigation/SignInForm";
import ForgotPasswordScreen from "../mobile/src/pages/forgot-password";
import ResetPasswordScreen from "../mobile/src/pages/reset-password";
import UserRegisterScreen from "../mobile/src/pages/user-register";

const Stack = createNativeStackNavigator();

export default function App() {
  const [render, setRender] = useState(false);

  useEffect(() => setRender(true), []);

  if (!render) return null;

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <AppStack />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
}

// Component to handle public vs private routes
function AppStack() {
  const { user } = useAuth(); // your auth state
  const PUBLIC_ROUTES = [
    "SignIn",
    "ForgotPassword",
    "ResetPassword",
    "UserRegister",
  ];

  if (!user) {
    // Public routes
    return (
      <>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
      </>
    );
  }

  // Private route
  return <Stack.Screen name="Home" component={HomeScreen} />;
}
