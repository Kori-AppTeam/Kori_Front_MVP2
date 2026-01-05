import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import { Portal } from '@gorhom/portal';
import React, { useRef, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { styled } from 'styled-components/native';
import { NEWS_SORT_MAPPER } from '../constants/categoryMapper';
import { NewsSortType } from '../types';

type SortDropDownProps = {
  value: NewsSortType;
  onPress: (value: NewsSortType) => void;
};

const SortDropDown = ({ value, onPress }: SortDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(
    null,
  );
  const buttonRef = useRef<View>(null);

  const toggleDropDown = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setButtonPosition({ x: px, y: py, width: width, height: height });
      setIsOpen(true);
    });
  };

  const handleSelect = (selectedValue: NewsSortType) => {
    onPress(selectedValue);
    setIsOpen(false);
  };

  return (
    <>
      <SortContainer onPress={toggleDropDown} ref={buttonRef} collapsable={false}>
        <SortText>{NEWS_SORT_MAPPER[value]}</SortText>
        <Icon type="dropDown" size={16} color={theme.colors.primary.mint} />
      </SortContainer>

      {isOpen && (
        <Portal>
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <Overlay />
          </TouchableWithoutFeedback>
          <DropDownList
            style={{
              position: 'absolute',
              top: buttonPosition ? buttonPosition.y + buttonPosition.height + 4 : 0,
              left: buttonPosition ? buttonPosition.x + 20 : 0,
            }}
          >
            <DropDownItem isLast={false} onPress={() => handleSelect('TRENDING')}>
              <SortText>Trending</SortText>
            </DropDownItem>
            <DropDownItem isLast={true} onPress={() => handleSelect('NEW')}>
              <SortText>New</SortText>
            </DropDownItem>
          </DropDownList>
        </Portal>
      )}
    </>
  );
};

export default SortDropDown;

const SortContainer = styled.Pressable`
  width: 100%;
  padding: 0 20px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;

const SortText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
`;

const DropDownList = styled.View`
  width: 120px;
  background-color: ${({ theme }) => theme.colors.primary.black};
  border: 1px solid ${({ theme }) => theme.colors.gray.darkGray_1_5};
  border-radius: 8px;
`;

const DropDownItem = styled.Pressable<{ isLast: boolean }>`
  width: 100%;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1_5};
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
