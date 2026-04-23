import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

function CompassIcon({ color }: { color: string }) {
  return (
    <View style={[tabStyles.iconContainer]}>
      <View style={[tabStyles.compassOuter, { borderColor: color }]}>
        <View style={[tabStyles.compassInner, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function BriefcaseIcon({ color }: { color: string }) {
  return (
    <View style={tabStyles.iconContainer}>
      <View style={[tabStyles.briefcaseBody, { borderColor: color }]}>
        <View style={[tabStyles.briefcaseHandle, { borderColor: color }]} />
      </View>
    </View>
  );
}

function ChatIcon({ color }: { color: string }) {
  return (
    <View style={tabStyles.iconContainer}>
      <View style={[tabStyles.chatBubble, { borderColor: color, backgroundColor: 'transparent' }]}>
        <View style={[tabStyles.chatTail, { borderTopColor: color }]} />
      </View>
    </View>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <View style={tabStyles.iconContainer}>
      <View style={[tabStyles.personHead, { backgroundColor: color }]} />
      <View style={[tabStyles.personBody, { borderColor: color }]} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  briefcaseBody: {
    width: 20,
    height: 14,
    borderRadius: 3,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  briefcaseHandle: {
    position: 'absolute',
    top: -6,
    width: 10,
    height: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  chatBubble: {
    width: 20,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
  },
  chatTail: {
    position: 'absolute',
    bottom: -5,
    left: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  personHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 1,
  },
  personBody: {
    width: 16,
    height: 9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
});

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: 'rgba(0,0,0,0.06)',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.inkMute,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <CompassIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="pipeline"
        options={{
          title: 'Pipeline',
          tabBarIcon: ({ color }) => <BriefcaseIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <ChatIcon color={color} />,
          href: '/(main)/messages',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <PersonIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
