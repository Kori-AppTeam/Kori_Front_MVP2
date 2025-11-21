// 상대의 메시지 버블 컴포넌트(단일 메시지)
import RawProfileImage from '@/components/common/ProfileImage';
import React from 'react';
import styled from 'styled-components/native';
import { OtherMessageBubbleProps } from '../../types';
import HighlightText from './HighlightText';

const OtherMessageBubble: React.FC<OtherMessageBubbleProps> = ({
  content,
  time,
  senderName,
  senderImageUrl,
  showTime,
  showProfile,
  isFirst,
  searchKeyword,
  onProfilePress,
}) => {
  return (
    <MessageContainer showProfile={showProfile}>
      <ProfileContainer>
        {showProfile && (
          <ProfileBox>
            <ProfileButton onPress={onProfilePress}>
              <ProfileImg source={{ uri: senderImageUrl }} />
            </ProfileButton>
          </ProfileBox>
        )}
      </ProfileContainer>

      <ContentContainer>
        {showProfile && <SenderNameText>{senderName}</SenderNameText>}
        <MessageBox>
          <BubbleContainer isFirst={isFirst}>
            <HighlightText
              text={content}
              keyword={searchKeyword || ''}
              textType="other"
            />
          </BubbleContainer>
          {showTime && <TimeText>{time}</TimeText>}
        </MessageBox>
      </ContentContainer>
    </MessageContainer>
  );
};

export default OtherMessageBubble;

// ============= Constants =============
const OTHER_MESSAGE_CONFIG = {
  MAX_WIDTH: 280,
  BUBBLE_MAX_WIDTH: 210,
  CONTENT_MAX_WIDTH: 242,
  PROFILE_SIZE: 38,
  PROFILE_MARGIN_RIGHT: 7,
  CONTENT_PADDING_LEFT: 7,
  PADDING_VERTICAL: 8,
  PADDING_HORIZONTAL: 12,
  BORDER_RADIUS: 16,
  BACKGROUND_COLOR: '#414142',
  TIME_COLOR: '#848687',
  NAME_COLOR: '#ffffff',
  MARGIN_TOP_FIRST: 20,
  MARGIN_TOP_REGULAR: 1,
  MESSAGE_BOX_MARGIN_TOP: 5,
  TIME_MARGIN_LEFT: 3,
  TIME_FONT_SIZE: 10,
  NAME_FONT_SIZE: 13,
} as const;

// ============= Base Styled Components =============
const BaseContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  align-self: flex-start;
  max-width: ${OTHER_MESSAGE_CONFIG.MAX_WIDTH}px;
  flex-direction: row;
`;

const BaseBubble = styled.View`
  background-color: ${OTHER_MESSAGE_CONFIG.BACKGROUND_COLOR};
  padding: ${OTHER_MESSAGE_CONFIG.PADDING_VERTICAL}px ${OTHER_MESSAGE_CONFIG.PADDING_HORIZONTAL}px;
  max-width: ${OTHER_MESSAGE_CONFIG.BUBBLE_MAX_WIDTH}px;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
`;

// ============= Styled Components =============
const MessageContainer = styled(BaseContainer) <{ showProfile?: boolean }>`
  margin-top: ${({ showProfile }) =>
    showProfile ? OTHER_MESSAGE_CONFIG.MARGIN_TOP_FIRST : OTHER_MESSAGE_CONFIG.MARGIN_TOP_REGULAR
  }px;
`;

const ProfileContainer = styled.View`
  width: ${OTHER_MESSAGE_CONFIG.PROFILE_SIZE}px;
  margin-right: ${OTHER_MESSAGE_CONFIG.PROFILE_MARGIN_RIGHT}px;
`;

const ProfileBox = styled.View`
  width: ${OTHER_MESSAGE_CONFIG.PROFILE_SIZE}px;
  height: ${OTHER_MESSAGE_CONFIG.PROFILE_SIZE}px;
  border-radius: 100px;
  overflow: hidden;
  background-color: #353637;
`;

const ProfileButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
`;

const ProfileImg = styled(RawProfileImage)`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.View`
  max-width: ${OTHER_MESSAGE_CONFIG.CONTENT_MAX_WIDTH}px;
  padding-left: ${OTHER_MESSAGE_CONFIG.CONTENT_PADDING_LEFT}px;
`;

const SenderNameText = styled.Text`
  color: ${OTHER_MESSAGE_CONFIG.NAME_COLOR};
  font-family: PlusJakartaSans_600SemiBold;
  font-size: ${OTHER_MESSAGE_CONFIG.NAME_FONT_SIZE}px;
`;

const MessageBox = styled.View`
  max-width: 250px;
  margin-top: ${OTHER_MESSAGE_CONFIG.MESSAGE_BOX_MARGIN_TOP}px;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
`;

const BubbleContainer = styled(BaseBubble) <{ isFirst: boolean }>`
  border-radius: ${OTHER_MESSAGE_CONFIG.BORDER_RADIUS}px;
  border-top-left-radius: ${({ isFirst }) => isFirst ? 0 : OTHER_MESSAGE_CONFIG.BORDER_RADIUS}px;
`;

const TimeText = styled.Text`
  color: ${OTHER_MESSAGE_CONFIG.TIME_COLOR};
  font-size: ${OTHER_MESSAGE_CONFIG.TIME_FONT_SIZE}px;
  font-family: PlusJakartaSans_300Light;
  margin-left: ${OTHER_MESSAGE_CONFIG.TIME_MARGIN_LEFT}px;
`;