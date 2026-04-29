import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen       from '../screens/HomeScreen';
import WeeklyPlanScreen from '../screens/WeeklyPlanScreen';
import CravingScreen    from '../screens/CravingScreen';
import ProfileScreen    from '../screens/ProfileScreen';
import FoodLogScreen    from '../screens/FoodLogScreen';
import { COLORS } from '../utils/colors';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { borderTopColor: COLORS.border, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: 4 },
        tabBarIcon: ({ focused }) => {
          const icons = { Home: '🏠', Plan: '📋', Craving: '🍔', Profile: '👤' };
          return <Text style={{ fontSize: focused ? 22 : 18 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Plan"    component={WeeklyPlanScreen} />
      <Tab.Screen name="Craving" component={CravingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => {
      setInitialRoute(id ? 'Main' : 'Onboarding');
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main"       component={MainTabs} />
        <Stack.Screen name="WeeklyPlan" component={WeeklyPlanScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Craving"    component={CravingScreen}    options={{ presentation: 'modal' }} />
        <Stack.Screen name="FoodLog"    component={FoodLogScreen}    options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
