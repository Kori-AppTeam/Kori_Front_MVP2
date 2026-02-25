import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { patchLocation } from '@/api/member/location';
import Icon from '@/components/common/Icon';
import { useConfirmTerms } from '@/src/features/auth/hooks/useConfirmTerms';
import { requestLocationPermission } from '@/src/features/auth/lib/requestLocationPermission';
import Checkbox, { CheckboxProps } from '@/src/shared/components/Checkbox';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import CustomButton from '@/src/shared/components/CustomButton';
import {
  PROFILE_SETUP_ROUTE,
  SIGNUP_PRIVACY_POLICY_ROUTE,
  SIGNUP_TERMS_AND_CONDITIONS_ROUTE,
} from '@/src/shared/constants/route';
import { textStyle, theme } from '@/src/styles/theme';

interface ConfirmTermsBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  bottomSheetClose: () => void;
  loginProvider: 'apple' | 'google' | 'email';
  onPress?: () => void;
  isLoading?: boolean;
}

const ConfirmTermsBottomSheet = ({
  bottomSheetRef,
  bottomSheetClose,
  loginProvider,
  onPress: handleEmailProvider,
  isLoading,
}: ConfirmTermsBottomSheetProps) => {
  const { confirms, isConfirmedAll, toggleConfirmed, toggleConfirmedAll } = useConfirmTerms();

  const handleAuthProvider = async () => {
    console.log('[ConfirmTerms] handleAuthProvider start', { loginProvider });

    // 위치 획득/저장은 에뮬레이터에서 GPS fix 때문에 오래 걸릴 수 있어 네비게이션을 막지 않습니다.
    // (실패해도 서비스 이용이 가능하도록 설계되어 있음)
    void (async () => {
      try {
        const { latitude, longitude } = await requestLocationPermission();
        console.log('[ConfirmTerms] location result', { latitude, longitude });
        await patchLocation(latitude, longitude);
        console.log('[ConfirmTerms] patchLocation done');
      } catch (error) {
        console.error('Error obtaining location or patching location:', error);
      }
    })();

    const nextRoute = PROFILE_SETUP_ROUTE.BASIC_INFO;
    console.log('[ConfirmTerms] closing sheet then navigating', nextRoute);
    bottomSheetClose();
    // BottomSheet dismiss 애니메이션 중 즉시 push가 무시되는 케이스가 있어 약간 지연합니다.
    setTimeout(() => {
      console.log('[ConfirmTerms] navigate now', nextRoute);
      router.push(nextRoute);
    }, 350);
  };

  const handleButtonPress = () => {
    console.log('[ConfirmTerms] Confirm pressed', {
      loginProvider,
      isConfirmedAll,
      isLoading,
    });
    if (loginProvider === 'email' && handleEmailProvider) {
      handleEmailProvider();
      return;
    }
    handleAuthProvider();
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
        <CustomButton label="Confirm" disabled={!isConfirmedAll} onPress={handleButtonPress} isLoading={isLoading} />
      </BottomSheetContent>
    </CustomBottomSheet>
  );
};

export default ConfirmTermsBottomSheet;

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
