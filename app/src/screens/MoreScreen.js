import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId, getUser } from '../services/api';
import { COLORS } from '../utils/colors';

const MENU = [
  { icon: '👤', label: 'My Profile',         screen: 'Profile' },
  { icon: '📋', label: 'Weekly Plan',         screen: 'Plan' },
  { icon: '🍔', label: 'Log a Craving',       screen: 'Craving' },
  { icon: '📊', label: 'Nutrition Targets',   screen: 'Profile' },
  { icon: '⚙️',  label: 'Goals & Settings',   screen: 'Profile' },
];

export default function MoreScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserId().then(uid => uid && getUser(uid).then(setUser).catch(() => {}));
    const unsub = navigation.addListener('focus', () => {
      getUserId().then(uid => uid && getUser(uid).then(setUser).catch(() => {}));
    });
    return unsub;
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert('Reset App', 'This will clear your data and return to onboarding.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Onboarding');
        },
      },
    ]);
  };

  const profile = user?.profile;

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.topBar}>
        <Text style={s.topTitle}>More</Text>
      </View>

      {/* Profile block */}
      <View style={s.profileCard}>
        <View style={s.bigAvatar}>
          <Text style={s.bigAvatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={s.profileName}>{user?.name || '—'}</Text>
        <View style={s.profileStats}>
          <View style={s.profileStat}>
            <Text style={s.profileStatValue}>{profile?.targetCalories?.toLocaleString() || '—'}</Text>
            <Text style={s.profileStatLabel}>Daily kcal</Text>
          </View>
          <View style={s.profileStatDivider} />
          <View style={s.profileStat}>
            <Text style={s.profileStatValue}>{profile?.macros?.proteinG || '—'}g</Text>
            <Text style={s.profileStatLabel}>Protein</Text>
          </View>
          <View style={s.profileStatDivider} />
          <View style={s.profileStat}>
            <Text style={s.profileStatValue}>{(user?.goal || '—').replace('_', ' ')}</Text>
            <Text style={s.profileStatLabel}>Goal</Text>
          </View>
        </View>
      </View>

      {/* Menu list */}
      <View style={s.menuCard}>
        {MENU.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[s.menuItem, i < MENU.length - 1 && s.menuItemBorder]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={s.menuIcon}>{item.icon}</Text>
            <Text style={s.menuLabel}>{item.label}</Text>
            <Text style={s.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* App info */}
      <View style={s.menuCard}>
        <View style={s.infoRow}>
          <Text style={s.infoLabel}>App</Text>
          <Text style={s.infoValue}>CraveFit</Text>
        </View>
        <View style={[s.infoRow, s.menuItemBorder]}>
          <Text style={s.infoLabel}>Version</Text>
          <Text style={s.infoValue}>Beta 0.1</Text>
        </View>
      </View>

      <TouchableOpacity style={s.resetBtn} onPress={handleLogout}>
        <Text style={s.resetText}>Reset / Re-onboard</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  topBar:   { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  topTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text },

  profileCard:  { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 12 },
  bigAvatar:    { width: 72, height: 72, borderRadius: 36, backgroundColor: '#4A4A7A', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  bigAvatarText:{ fontSize: 30, fontWeight: '700', color: COLORS.text },
  profileName:  { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  profileStats: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around' },
  profileStat:  { alignItems: 'center' },
  profileStatValue:{ fontSize: 16, fontWeight: '700', color: COLORS.text },
  profileStatLabel:{ fontSize: 11, color: COLORS.muted, marginTop: 2 },
  profileStatDivider:{ width: 1, height: 32, backgroundColor: COLORS.border },

  menuCard:   { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  menuItem:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  menuItemBorder:{ borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon:   { fontSize: 20, width: 32 },
  menuLabel:  { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  menuChevron:{ fontSize: 22, color: COLORS.muted },

  infoRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  infoLabel:  { fontSize: 14, color: COLORS.muted },
  infoValue:  { fontSize: 14, color: COLORS.text, fontWeight: '500' },

  resetBtn:   { marginHorizontal: 16, marginTop: 4, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger + '40' },
  resetText:  { color: COLORS.danger, fontWeight: '600', fontSize: 14 },
});
