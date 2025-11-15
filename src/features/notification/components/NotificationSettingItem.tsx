import { View } from 'react-native';
import styled from 'styled-components/native';

import { textStyle } from '@/src/styles/theme';
import Toggle from '@/components/common/Toggle';
import { NotificationSetting, NotificationType } from '@/src/features/notification/types/notification.types';

type NotificationSettingListText = {
  title: string;
  subtitle?: string;
};

export const NOTIFICATION_SETTING_LIST_TEXT: Record<NotificationType | 'all', NotificationSettingListText> = {
  all: {
    title: 'All notifications',
    subtitle: 'Enable all push notifications',
  },
  newuser: {
    title: 'New member join notifications',
    subtitle: 'Get notified when new users join Kori',
  },
  receive: {
    title: 'Follow Request Accepted',
  },
  follow: {
    title: 'New Follower Request',
  },
  followuserpost: {
    title: 'Post notifications from followed users',
  },
  post: {
    title: 'Comment on Your Post',
  },
  comment: {
    title: 'Reply to your comment',
  },
  chat: {
    title: 'Allow Chat Notifications',
  },
};

interface NotificationSettingListProps {
  notificationType: NotificationType | 'all';
  isBorderBottom?: boolean;
  disabled?: boolean;
  isTogglePressed: (type: NotificationType | 'all') => boolean;
  handleToggle: ({ notificationType, enabled }: NotificationSetting) => void;
  handleAllToggle: (next: boolean) => Promise<void>;
}

const NotificationSettingItem = ({
  notificationType,
  isBorderBottom,
  disabled = false,
  isTogglePressed,
  handleToggle,
  handleAllToggle,
}: NotificationSettingListProps) => {
  const title = NOTIFICATION_SETTING_LIST_TEXT[notificationType].title;
  const subtitle = NOTIFICATION_SETTING_LIST_TEXT[notificationType]?.subtitle;
  const isAllToggle = notificationType === 'all';
  return (
    <ListItem isBorderBottom={isBorderBottom}>
      <View>
        <ListTitle>{title}</ListTitle>
        {subtitle && <ListSubTitle>{subtitle}</ListSubTitle>}
      </View>
      <Toggle
        isPressed={isTogglePressed(notificationType)}
        onPress={(enabled) => {
          isAllToggle ? handleAllToggle(enabled) : handleToggle({ notificationType, enabled });
        }}
        disabled={!isAllToggle && disabled}
      />
    </ListItem>
  );
};

const ListItem = styled.View<{ isBorderBottom?: boolean }>`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 20px 0;
  border-bottom-width: ${({ isBorderBottom }) => (isBorderBottom ? 1 : 0)}px;
  border-bottom-color: ${({ theme, isBorderBottom }) =>
    isBorderBottom ? theme.colors.gray.darkGray_1 : 'transparent'};
`;

const ListTitle = styled.Text`
  margin-bottom: 4px;
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
  color: ${({ theme }) => theme.colors.primary.white}
`;

const ListSubTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)}
  color: ${({ theme }) => theme.colors.primary.white}
`;

export default NotificationSettingItem;
