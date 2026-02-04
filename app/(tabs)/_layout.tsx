import Icon from '@/components/common/Icon';
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import { initNotificationsSettingStatus, putOSPushAgreement } from '@/src/features/notification/api/notifications';
import NotificationPermissionModal from '@/src/features/notification/components/NotificationPermissionModal';
import useNotificationPermission from '@/src/features/notification/hooks/useNotificationPermission';
import { useCheckProfileSetupCompleted } from '@/src/features/profile-setup/hooks/useCheckProfileSetupCompleted';
import { forceLogoutWithProfileSetupAlert } from '@/src/features/profile-setup/lib/forceLogoutWithProfileSetupAlert';
import { useTabFocusTracker } from '@/src/shared/hooks/useTabFocusTracker';
import { textStyle, theme } from '@/src/styles/theme';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Tabs, router, usePathname } from 'expo-router';
import React from 'react';
import { DeviceEventEmitter, Image } from 'react-native';
import { styled } from 'styled-components/native';

const TAB_BAR_HEIGHT = SCREEN_WIDTH * (86 / 375);

export default function TabLayout() {
  const { permissionSetupRequired, setPermissionSetupRequired, requestOSPermission } = useNotificationPermission();
  const { profileSetupModalVisible, goToProfileSetup } = useCheckProfileSetupCompleted();
  const pathname = usePathname();
  useTabFocusTracker();

  return (
    <>
      <Tabs
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
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused ? require('@/assets/images/tab_find_click.png') : require('@/assets/images/tab_find.png')
                }
                style={{ width: 32, height: 32 }} // 원하는 크기
                resizeMode="contain"
              />
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
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused ? require('@/assets/images/tab_chat_click.png') : require('@/assets/images/tab_chat.png')
                }
                style={{ width: 32, height: 32 }} // 원하는 크기
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="k-culture"
          options={{
            title: 'K-Culture',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>K-culture</TabText>,
            tabBarIcon: ({ focused }) => (
              <Icon
                type="kCulture"
                color={focused ? theme.colors.primary.mint : theme.colors.gray.darkGray_2}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>Community</TabText>,
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/tab_community_click.png')
                    : require('@/assets/images/tab_community.png')
                }
                style={{ width: 32, height: 32 }} // 원하는 크기
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="mypage"
          options={{
            title: 'MyPage',
            tabBarLabel: ({ focused }) => <TabText focused={focused}>My page</TabText>,
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused ? require('@/assets/images/tab_mypage_click.png') : require('@/assets/images/tab_mypage.png')
                }
                style={{ width: 32, height: 32 }} // 원하는 크기
                resizeMode="contain"
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

      {/* 프로필 셋업 안내 모달 */}
      <ProfileSetupModal
        visible={profileSetupModalVisible}
        onClose={forceLogoutWithProfileSetupAlert}
        onCancel={forceLogoutWithProfileSetupAlert}
        onConfirm={goToProfileSetup}
        confirmLabel="Go to Setup"
      />
    </>
  );
}

const TabText = styled.Text<{ focused: boolean }>`
  color: ${({ focused }) => (focused ? theme.colors.primary.white : theme.colors.gray.gray_2)};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;
