//링크드 스페이스 생성 페이지
import Icon from '@/components/common/Icon';
import { CreateSpaceSuccess } from '@/src/features/chat/create/components/CreateSpaceSuccess';
import { SpaceFormInputs } from '@/src/features/chat/create/components/SpaceFormInputs';
import { SpaceImagePickerModal } from '@/src/features/chat/create/components/SpaceImagePickerModal';
import { useCreateSpace } from '@/src/features/chat/create/hooks/useCreateSpace';
import { useSpaceImagePicker } from '@/src/features/chat/create/hooks/useSpaceImagePicker';
import { CreateSpaceFormData } from '@/src/features/chat/create/types';
import { theme } from '@/src/styles/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

const CreateSpaceScreen = () => {
  const [spaceName, setSpaceName] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string>();
  const router = useRouter();

  // 이미지 선택 Hook
  const imagePicker = useSpaceImagePicker();

  // 스페이스 생성 Mutation
  const createSpaceMutation = useCreateSpace();

  const handleSave = () => {
    const formData: CreateSpaceFormData = {
      spaceName,
      description,
      imageUrl: imagePicker.avatarUrl,
      imageUri: imagePicker.customPhotoUri,
      isCustomImage: imagePicker.selectedAvatarIdx === -1,
      avatarIndex: imagePicker.selectedAvatarIdx,
    };

    createSpaceMutation.mutate(formData, {
      onSuccess: (data) => {
        setFinalImageUrl(data.finalImageUrl);
        setShowSuccess(true);
      },
    });
  };

  const handleDone = () => {
    router.replace('/(tabs)/chat');
  };

  // 성공 화면 렌더링
  if (showSuccess) {
    return (
      <CreateSpaceSuccess
        spaceImageUrl={finalImageUrl}
        onDone={handleDone}
      />
    );
  }

  // 폼 화면 렌더링
  return (
    <SafeArea>
      <StatusBar barStyle="light-content" />
      <Container>
        <HeaderContainer>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon type="previous" size={24} color={theme.colors.primary.white} />
          </TouchableOpacity>
          <HeaderTitleText>Create Space</HeaderTitleText>
          <TouchableOpacity onPress={handleSave} disabled={createSpaceMutation.isPending}>
            <SaveText>Save</SaveText>
          </TouchableOpacity>
        </HeaderContainer>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <SpaceFormInputs
            spaceName={spaceName}
            description={description}
            avatarUrl={imagePicker.avatarUrl}
            onSpaceNameChange={setSpaceName}
            onDescriptionChange={setDescription}
            onAvatarPress={imagePicker.openAvatarSheet}
          />
        </KeyboardAvoidingView>

        <SpaceImagePickerModal
          visible={imagePicker.showAvatarSheet}
          selectedAvatarIdx={imagePicker.selectedAvatarIdx}
          customPhotoUri={imagePicker.customPhotoUri}
          onClose={imagePicker.closeAvatarSheet}
          onSave={imagePicker.saveAvatar}
          onSelectDefaultAvatar={imagePicker.selectDefaultAvatar}
          onPickCustomPhoto={imagePicker.pickFromCameraOrGallery}
        />
      </Container>
    </SafeArea>
  );
};

export default CreateSpaceScreen;

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: #1d1e1f;
  padding: 0px 15px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  height: 70px;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitleText = styled.Text`
  color: #ffffff;
  font-family: PlusJakartaSans_500Medium;
  font-size: 16px;
`;

const SaveText = styled.Text`
  color: #02f59b;
  font-family: PlusJakartaSans_500Medium;
  font-size: 15px;
`;
