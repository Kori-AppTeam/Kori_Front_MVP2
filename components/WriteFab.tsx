import useGetVisitor from '@/src/features/community/hooks/useGetVisitor';
import { router } from 'expo-router';
import React, { Dispatch, SetStateAction } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from './common/Icon';

export default function WriteFab({ onSetProfileModal }: { onSetProfileModal: Dispatch<SetStateAction<boolean>> }) {
  const { data: profileCompleted, isLoading, isError } = useGetVisitor();

  const handleWritePress = () => {
    if (isLoading) {
      return;
    }

    if (isError) {
      console.error('[write:check] error');
      Alert.alert('Error', 'Failed to check profile status. Please try again.');
      return;
    }

    if (profileCompleted === false) {
      onSetProfileModal(true);
      return;
    }
    router.push('/community/write');
  };

  return (
    <Fab onPress={handleWritePress}>
      <Icon type="write" size={16} />
    </Fab>
  );
}

const Fab = styled.Pressable`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 54px;
  padding: 15px;
  height: 54px;
  border-radius: 100px;
  background: #02f59b;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 8;
  elevation: 8;
`;
