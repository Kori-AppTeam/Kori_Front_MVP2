import Icon from '@/components/common/Icon';
import { initNotificationsSettingStatus, putOSPushAgreement } from '@/src/features/notification/api/notifications';
import NotificationPermissionModal from '@/src/features/notification/components/NotificationPermissionModal';
import useNotificationPermission from '@/src/features/notification/hooks/useNotificationPermission';
import { useTabFocusTracker } from '@/src/shared/hooks/useTabFocusTracker';
import { textStyle, theme } from '@/src/styles/theme';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { styled } from 'styled-components/native';

const TAB_BAR_HEIGHT = SCREEN_WIDTH * (86 / 375);

export const unstable_settings = {
  initialRouteName: 'k-culture',
};

export default function TabLayout() {
  const { permissionSetupRequired, setPermissionSetupRequired, requestOSPermission } = useNotificationPermission();
  const pathname = usePathname();
  useTabFocusTracker();

  return (
    <>
      <Tabs
        initialRouteName="k-culture"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1D1E1F', // 원하는 배경색
            borderTopWidth: 1,
            borderColor: '#353637',
            width: SCREEN_WIDTH,
            height: TAB_BAR_HEIGHT,
            paddingTop: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>Find</TabText>,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Icon type="tabFindClick" size={28} />
              ) : (
                <Icon type="tabFind" color={theme.colors.gray.darkGray_2} size={28} />
              ),
          }}
          listeners={{
            tabPress: () => {
              if (pathname === '/') {
                DeviceEventEmitter.emit('FIND_TAB_PRESSED');
              }
            },
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>Chat</TabText>,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Icon type="tabChatClick" size={28} />
              ) : (
                <Icon type="tabChat" color={theme.colors.gray.darkGray_2} size={28} />
              ),
          }}
        />
        <Tabs.Screen
          name="k-culture"
          options={{
            title: 'K-Culture',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>K-Culture</TabText>,
            tabBarIcon: ({ focused }) => (
              <Icon
                type="kCulture"
                color={focused ? theme.colors.primary.mint : theme.colors.gray.darkGray_2}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>Community</TabText>,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Icon type="tabCommunityClick" size={28} />
              ) : (
                <Icon type="tabCommunity" color={theme.colors.gray.darkGray_2} size={28} />
              ),
          }}
        />
        <Tabs.Screen
          name="mypage"
          options={{
            title: 'MyPage',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>My page</TabText>,
            tabBarIcon: ({ focused }) => (
              <Icon
                type="mypage"
                color={focused ? theme.colors.primary.mint : theme.colors.gray.darkGray_2}
                size={28}
              />
            ),
          }}
        />
      </Tabs>
      {/* 알림 권한 모달 */}
      <NotificationPermissionModal
        visible={permissionSetupRequired}
        onClose={() => setPermissionSetupRequired(false)}
        onYesPress={async () => {
          await requestOSPermission();
        }}
        onLaterPress={async () => {
          await putOSPushAgreement(false);
          await initNotificationsSettingStatus(false);
        }}
      />
    </>
  );
}

const TabText = styled.Text<{ focused: boolean }>`
  color: ${({ focused }) => (focused ? theme.colors.primary.white : theme.colors.gray.gray_2)};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;
