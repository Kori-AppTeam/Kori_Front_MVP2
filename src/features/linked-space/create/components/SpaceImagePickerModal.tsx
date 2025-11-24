import Icon from '@/components/common/Icon';
import CustomButton from '@/src/shared/components/CustomButton';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import { DEFAULT_AVATARS } from '../constants';

interface SpaceImagePickerModalProps {
  visible: boolean;
  selectedAvatarIdx: number;
  customPhotoUri?: string;
  onClose: () => void;
  onSave: () => void;
  onSelectDefaultAvatar: (index: number) => void;
  onPickCustomPhoto: () => void;
}

/**
 * 스페이스 이미지 선택 모달
 */
export const SpaceImagePickerModal: React.FC<SpaceImagePickerModalProps> = ({
  visible,
  selectedAvatarIdx,
  customPhotoUri,
  onClose,
  onSave,
  onSelectDefaultAvatar,
  onPickCustomPhoto,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <SheetOverlay onPress={onClose} activeOpacity={1}>
        <Sheet onStartShouldSetResponder={() => true}>
          <Handle />
          <SheetTitle>Select Space Image</SheetTitle>

          <AvatarRow>
            {/* 기본 아바타 선택 */}
            {DEFAULT_AVATARS.map((avatar, idx) => {
              const selected = idx === selectedAvatarIdx && !customPhotoUri;
              return (
                <AvatarItem key={idx} onPress={() => onSelectDefaultAvatar(idx)}>
                  <AvatarCircle selected={selected}>
                    <AvatarImg source={avatar.source} />
                    {selected && (
                      <CheckBadge>
                        <Icon type="check" size={16} color={theme.colors.primary.black} />
                      </CheckBadge>
                    )}
                  </AvatarCircle>
                </AvatarItem>
              );
            })}

            {/* 커스텀 사진 선택 */}
            <AvatarItem onPress={onPickCustomPhoto}>
              <AvatarCircle selected={!!customPhotoUri}>
                {customPhotoUri ? (
                  <AvatarImg source={{ uri: customPhotoUri }} />
                ) : (
                  <CameraCircleInner>
                    <Icon type="cameraColored" size={32} color={theme.colors.gray.lightGray_1} />
                  </CameraCircleInner>
                )}
                {!!customPhotoUri && (
                  <CheckBadge>
                    <Icon type="check" size={16} color={theme.colors.primary.black} />
                  </CheckBadge>
                )}
              </AvatarCircle>
            </AvatarItem>
          </AvatarRow>

          <ButtonRow>
            <CustomButton label="Cancel" filled={false} onPress={onClose} />
            <Gap />
            <CustomButton label="Save" tone="mint" filled onPress={onSave} />
          </ButtonRow>
        </Sheet>
      </SheetOverlay>
    </Modal>
  );
};

const SheetOverlay = styled.TouchableOpacity`
  flex: 1;
  background: rgba(0, 0, 0, 0.55);
  justify-content: flex-end;
`;

const Sheet = styled.View`
  background: #353637;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  padding: 16px 16px 20px 16px;
`;

const Handle = styled.View`
  align-self: center;
  width: 54px;
  height: 4px;
  border-radius: 2px;
  background: #9aa0a6;
  margin-bottom: 10px;
`;

const SheetTitle = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-family: 'PlusJakartaSans_700Bold';
  text-align: center;
  margin-bottom: 16px;
`;

const AvatarRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  margin-bottom: 18px;
`;

const AvatarItem = styled.Pressable``;

const AvatarCircle = styled.View<{ selected: boolean }>`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  background: #1f2021;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ selected }) => (selected ? '#30F59B' : 'transparent')};
  position: relative;
`;

const AvatarImg = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 32px;
`;

const CheckBadge = styled.View`
  position: absolute;
  right: -2px;
  top: -2px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #30f59b;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #353637;
`;

const CameraCircleInner = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  background: #1f2021;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 28px;
`;

const Gap = styled.View`
  width: 12px;
`;
