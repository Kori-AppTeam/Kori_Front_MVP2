import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DetailHeader from '@/components/common/DetailHeader';
import NotificationSettingList from '@/src/features/notification/components/NotificationSettingList';

export default function NotificationSettingPage() {
  return (
    <Safe edges={[]}>
      <DetailHeader title="Notification" />
      <Body>
        <NotificationSettingList />
      </Body>
    </Safe>
  );
}

const Safe = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;

const Body = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 40,
  },
})`
  flex: 1;
`;
