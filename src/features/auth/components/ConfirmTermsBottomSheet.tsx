import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import Icon from '@/components/common/Icon';
import { useConfirmTerms } from '@/src/features/auth/hooks/useConfirmTerms';
import { textStyle, theme } from '@/src/styles/theme';
import { SIGNUP_PRIVACY_POLICY_ROUTE, SIGNUP_TERMS_AND_CONDITIONS_ROUTE } from '@/src/shared/constants/route';
import CustomButton from '@/src/shared/components/CustomButton';
import Checkbox, { CheckboxProps } from '@/src/shared/components/Checkbox';
import { requestLocationPermission } from '@/lib/location/requestLocationPermission';
import { patchLocation } from '@/api/member/location';

interface ConfirmTermsBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  bottomSheetClose: () => void;
  loginProvider?: 'apple' | 'google' | 'email';
}

const ConfirmTermsBottomSheet = ({ bottomSheetRef, bottomSheetClose, loginProvider }: ConfirmTermsBottomSheetProps) => {
  const { confirms, isConfirmedAll, toggleConfirmed, toggleConfirmedAll } = useConfirmTerms();

  const handleButtonPress = async () => {
    try {
      const { latitude, longitude } = await requestLocationPermission();
      await patchLocation(latitude, longitude);

      bottomSheetClose();
      if (loginProvider === 'apple') {
        router.push('/screens/makeprofile/GenderStepScreen');
      } else {
        router.push('/screens/makeprofile/NameStepScreen');
      }
    } catch (error) {
      console.error('Error obtaining location or patching location:', error);
    }
  };

  const showTermsAndConditions = () => {
    bottomSheetClose();
    setTimeout(() => {
      router.push(SIGNUP_TERMS_AND_CONDITIONS_ROUTE);
    }, 300);
  };

  const showPrivacyPolicy = () => {
    bottomSheetClose();
    setTimeout(() => {
      router.push(SIGNUP_PRIVACY_POLICY_ROUTE);
    }, 300);
  };

  interface LabelCheckboxProps extends CheckboxProps {
    label: string;
    isLabelBold?: boolean;
    onNextPress?: () => void;
  }

  // 라벨 체크박스
  const LabelCheckbox = ({ isChecked, onPress, label, isLabelBold = false, onNextPress }: LabelCheckboxProps) => {
    return (
      <CheckBoxContainer>
        <Checkbox isChecked={isChecked} onPress={() => onPress()} />
        <CheckText isChecked={isChecked} isBold={isLabelBold}>
          {label}
        </CheckText>
        {onNextPress && (
          <TouchableOpacity onPress={() => onNextPress()}>
            <Icon type="next" size={20} color={theme.colors.gray.gray_1} />
          </TouchableOpacity>
        )}
      </CheckBoxContainer>
    );
  };

  // loginProvider가 없는 경우 바텀시트를 렌더링하지 않음
  if (!loginProvider) {
    return null;
  }

  return (
    <CustomBottomSheet ref={bottomSheetRef}>
      <BottomSheetContent>
        <BottomSheetTitle>Please agree to the terms to continue.</BottomSheetTitle>
        <CheckboxWrapper>
          <LabelCheckbox
            isChecked={isConfirmedAll}
            onPress={() => toggleConfirmedAll()}
            label="I agree to all."
            isLabelBold
          />
          <Divider />
          <LabelCheckbox
            isChecked={confirms.age}
            onPress={() => toggleConfirmed('age')}
            label="(Required) I am over 14 years old."
          />
          <LabelCheckbox
            isChecked={confirms.terms}
            onPress={() => toggleConfirmed('terms')}
            label="(Required) Terms & Conditions"
            onNextPress={showTermsAndConditions}
          />
          <LabelCheckbox
            isChecked={confirms.privacy}
            onPress={() => toggleConfirmed('privacy')}
            label="(Required) Privacy Policy"
            onNextPress={showPrivacyPolicy}
          />
        </CheckboxWrapper>
        <CustomButton label="Confirm" disabled={!isConfirmedAll} onPress={handleButtonPress} />
      </BottomSheetContent>
    </CustomBottomSheet>
  );
};

export default ConfirmTermsBottomSheet;

const BottomSheetContent = styled.View`
  width: 100%;
  height: 100%;
  padding: 24px;
  padding-bottom: 48px;
`;

const BottomSheetTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_SB)}
  color: ${({ theme }) => theme.colors.primary.white};
`;

const CheckboxWrapper = styled.View`
  margin-top: 16px;
  margin-bottom: 32px;
`;

const Divider = styled.View`
  width: 100%;
  align-self: center;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_2};
  margin-bottom: 10px;
`;

const CheckBoxContainer = styled.View`
  height: 50px;
  margin: 5px;
  flex-direction: row;
  align-items: center;
`;

const CheckText = styled.Text<{ isChecked: boolean; isBold: boolean }>`
  ${({ theme, isBold }) => textStyle(isBold ? theme.fonts.body.B4_SB : theme.fonts.body.B5_M)}
  color: ${({ theme, isChecked }) => (isChecked ? theme.colors.primary.white : theme.colors.gray.lightGray_1)};
  margin-left: 16px;
  flex: 1;
`;
