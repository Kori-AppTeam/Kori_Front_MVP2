import React, { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import styled from 'styled-components/native';

import { putOSPushAgreement } from '@/src/features/notification/api/notifications';
import NotificationSettingItem from '@/src/features/notification/components/NotificationSettingItem';
import useUpdateNotificationSettings from '@/src/features/notification/hooks/mutations/useUpdateNotifications';
import { defaultSettings, useNotificationSettings } from '@/src/features/notification/hooks/queries/useNotifications';
import { showNotificationPermissionAlert } from '@/src/features/notification/lib/showNotificationPermissionAlert';
import { NotificationSetting, NotificationType } from '@/src/features/notification/types/notification.types';
import { textStyle } from '@/src/styles/theme';

const NotificationSettingList = () => {
  const { data } = useNotificationSettings();
  const notificationSettings = data ?? defaultSettings;
  const { mutate } = useUpdateNotificationSettings();
  const [isAllEnabled, setIsAllEnabled] = useState<boolean>(false);

  /* -------------- state에서 특정 type의 enabled를 찾음 -------------- */
  function findEnabled(type: NotificationType | 'all'): boolean {
    if (!Array.isArray(data)) return false;

    if (type === 'all') {
      return isAllEnabled;
    }
    return data.find((s) => s.notificationType === type)!.enabled;
  }

  /* -------------- 개별 알림 토글 핸들러 콜백 함수 -------------- */
  const handleToggle = useCallback(
    ({ notificationType, enabled }: NotificationSetting) => {
      if (!isAllEnabled) return;

      const updatedSettings = notificationSettings.map((s) =>
        s.notificationType === notificationType ? { ...s, enabled: enabled } : s,
      );

      mutate(updatedSettings);
    },
    [isAllEnabled, notificationSettings, mutate],
  );

  /* -------------- 전체 알림 토글 핸들러 콜백 함수 -------------- */
  const handleAllToggle = useCallback(
    async (next: boolean) => {
      const { status } = await Notifications.getPermissionsAsync();
      const needsSetupFromOS = status === 'undetermined' || status === 'denied';

      if (needsSetupFromOS) {
        const updatedosStatus = await showNotificationPermissionAlert();

        if (updatedosStatus !== 'granted') return;
        else await putOSPushAgreement(true);
      }

      setIsAllEnabled(next);
      const updatedSettings = notificationSettings.map((s) => ({ ...s, enabled: next }));
      mutate(updatedSettings);
    },
    [notificationSettings, mutate],
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      setIsAllEnabled(data.some((s) => s.enabled));
    }
  }, [data]);

  const commonProps = {
    disabled: !isAllEnabled,
    isTogglePressed: findEnabled,
    handleToggle: handleToggle,
    handleAllToggle: handleAllToggle,
  };

  return (
    <>
      <NotificationSettingItem notificationType="all" isBorderBottom {...commonProps} />
      <NotificationSettingItem notificationType="newuser" isBorderBottom {...commonProps} />

      <ListSection>
        <ListSectionLabel>Follow Received / Sent</ListSectionLabel>

        <NotificationSettingItem notificationType="receive" {...commonProps} />
        <NotificationSettingItem notificationType="follow" {...commonProps} />
      </ListSection>

      <ListSection>
        <ListSectionLabel>Community</ListSectionLabel>

        <NotificationSettingItem notificationType="followuserpost" {...commonProps} />
        <NotificationSettingItem notificationType="post" {...commonProps} />
        <NotificationSettingItem notificationType="comment" isBorderBottom {...commonProps} />
      </ListSection>

      <ListSection>
        <ListSectionLabel>Chat</ListSectionLabel>

        <NotificationSettingItem notificationType="chat" {...commonProps} />
      </ListSection>
    </>
  );
};

export default NotificationSettingList;

const ListSection = styled.View`
  margin-top: 20px;
`;

const ListSectionLabel = styled.Text`
  padding: 4px 0;
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)}
  color: ${({ theme }) => theme.colors.gray.gray_1}
`;
