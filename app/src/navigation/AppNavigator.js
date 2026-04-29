import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen  from '../screens/OnboardingScreen';
import HomeScreen        from '../screens/HomeScreen';
import WeeklyPlanScreen  from '../screens/WeeklyPlanScreen';
import CravingScreen     from '../screens/CravingScreen';
import ProfileScreen     from '../screens/ProfileScreen';
import FoodLogScreen     from '../screens/FoodLogScreen';
import MoreScreen        from '../screens/MoreScreen';
import { COLORS } from '../utils/colors';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: { icon: '⊞',  label: 'Dashboard' },
  Diary:     { icon: '📖', label: 'Diary' },
  Plan:      { icon: '📋', label: 'Plan' },
  More:      { icon: '•••', label: 'More' },
};

function TabIcon({ name, focused }) {
  const { icon } = TAB_ICONS[name];
  return (
    <Text style={{ fontSize: focused ? 20 : 17, opacity: focused ? 1 : 0.5 }}>
      {icon}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.text,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor:  COLORS.border,
          borderTopWidth:  1,
          height: 62,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Diary"     component={FoodLogScreen} />
      <Tab.Screen name="Plan"      component={WeeklyPlanScreen} />
      <Tab.Screen name="More"      component={MoreScreen} />
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
        <Stack.Screen name="Craving"    component={CravingScreen}    options={{ presentation: 'modal' }} />
        <Stack.Screen name="FoodLog"    component={FoodLogScreen}    options={{ presentation: 'modal' }} />
        <Stack.Screen name="Profile"    component={ProfileScreen}    options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
