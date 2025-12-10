import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../routes/HomeScreen";
import SignInScreen from "../navigation/SignInForm";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isLoggedIn = false; // Replace with your AuthProvider state

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
