import { theme } from '@/src/styles/theme';
import { useState } from 'react';
import styled from 'styled-components/native';
import Icon from './common/Icon';

type Props = {
  onHandleWritePress: () => void;
  onHandleVotePress: () => void;
  disabled?: boolean;
};

export default function WriteFab({ onHandleWritePress, onHandleVotePress, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && <FabOverlay onPress={handlePress} />}

      <FabGroup>
        {isOpen && (
          <OptionContainer>
            <SubButton>
              <Label>Vote</Label>
              <SubFab
                onPress={() => {
                  onHandleVotePress();
                  setIsOpen(false);
                }}
              >
                <Icon type="vote" size={24} color={theme.colors.primary.black} />
              </SubFab>
            </SubButton>

            <SubButton>
              <Label>Post</Label>
              <SubFab
                onPress={() => {
                  onHandleWritePress();
                  setIsOpen(false);
                }}
              >
                <Icon type="write" size={20} />
              </SubFab>
            </SubButton>
          </OptionContainer>
        )}

        <MainFab onPress={handlePress} disabled={disabled} color={theme.colors.primary.mint}>
          {isOpen ? (
            <Icon type="close" size={24} color={theme.colors.gray.darkGray_1} />
          ) : (
            <Icon type="plus" size={24} color={theme.colors.gray.darkGray_1} />
          )}
        </MainFab>
      </FabGroup>
    </>
  );
}

const FabGroup = styled.View`
  position: absolute;
  right: 20px;
  bottom: 20px;
  align-items: flex-end;
  z-index: 999;
`;

const FabStyle = styled.Pressable<{ color?: string }>`
  width: 54px;
  height: 54px;
  padding: 15px;
  border-radius: 100px;
  background: ${({ color, theme }) => color || theme.colors.primary.white};
  align-items: center;
  justify-content: center;
`;

const MainFab = styled(FabStyle)<{ color?: string }>`
  /* iOS 그림자 */
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 8px;

  /* Android 그림자 */
  elevation: 8;
`;

const OptionContainer = styled.View`
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
`;

const SubButton = styled.View<{ color?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const SubFab = styled(FabStyle)``;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  background-color: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  ${({ theme }) => theme.fonts.body.B4_M};
  overflow: hidden;
`;

const FabOverlay = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
`;
