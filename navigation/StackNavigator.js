import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BrowserScreen from "../screens/BrowserScreen";
import constants from "../constants";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerMode: "screen",
          headerTintColor: "white",
          headerStyle: { backgroundColor: constants.THEME.PRIMARY_COLOR },
        }}
      >
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen
          name="Browser"
          component={BrowserScreen}
          options={{ title: "Browser" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
