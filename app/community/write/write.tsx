import Icon from '@/components/common/Icon';

import { categoryToClient } from '@/src/features/community/shared/utils/categoryMapper';
import { AnonymousToggle } from '@/src/features/community/write/components/AnonymousToggle';
import { CategoryBottomSheetContent } from '@/src/features/community/write/components/CategoryBottomSheetContent';
import { CategorySelector } from '@/src/features/community/write/components/CategoryPicker';
import { ImagePreviewList } from '@/src/features/community/write/components/ImagePreviewList';
import WritePolicy from '@/src/features/community/write/components/WritePolicy';
import { useBoardWriteOptions } from '@/src/features/community/write/hooks/useBoardWriteOptions';
import { useImagePicker } from '@/src/features/community/write/hooks/useImagePicker';
import { useWriteForm } from '@/src/features/community/write/hooks/useWriteForm';
import { InitialEditData } from '@/src/features/community/write/types';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { textStyle, theme } from '@/src/styles/theme';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { KeyboardAvoidingView, Platform, TextInput as RNTextInput, ScrollView } from 'react-native';
import styled from 'styled-components/native';

export default function WriteScreen() {
  const params = useLocalSearchParams<{ mode?: string; postId?: string; initialData?: string }>();
  const isEdit = params.mode === 'edit';
  const postIdNum = params.postId ? Number(params.postId) : undefined;

  const inputRef = useRef<RNTextInput>(null);
  const categoryBottomSheetRef = useRef<BottomSheetModal>(null);

  // 수정 모드일 때 initialData 파싱
  const parsedEditData = useMemo(() => {
    if (!isEdit || !params.initialData) return null;
    try {
      return JSON.parse(params.initialData) as InitialEditData;
    } catch (e) {
      console.error('[write:parse-initial-data:error]', e);
      return null;
    }
  }, [isEdit, params.initialData]);

  // 이미지 피커 훅
  const { images, pickImage, removeImage, setImages } = useImagePicker();

  // 폼 상태 및 로직 훅
  const {
    category,
    setCategory,
    body,
    setBody,
    anonymous,
    canSave,
    canToggleAnon,
    saving,
    isCreating,
    isUpdating,
    isFocused,
    setIsFocused,
    handleSave,
    handleToggleAnonymous,
    boardId,
  } = useWriteForm({
    isEdit,
    postId: postIdNum,
    initialCategory: parsedEditData ? categoryToClient(parsedEditData.boardCategory) : 'Activity',
    initialContent: parsedEditData?.content ?? '',
    initialImages: parsedEditData?.contentImageUrls ?? [],
    initialAnonymous: parsedEditData?.isAnonymous ?? false,
  });

  // 수정 모드일 때 초기 이미지 설정
  useEffect(() => {
    if (parsedEditData?.contentImageUrls) {
      setImages(parsedEditData.contentImageUrls.map((uri: string) => ({ uri })));
    }
  }, [parsedEditData]);

  console.log(parsedEditData);

  // 작성 옵션 조회
  const { data: writeOpt, isFetching: loadingOpt, isError, error } = useBoardWriteOptions(boardId);

  useEffect(() => console.log('[write-options:request]', { boardId }), [boardId]);
  useEffect(() => {
    if (loadingOpt) {
      console.log('[write-options:loading]', { boardId });
    }
  }, [loadingOpt, boardId]);

  useEffect(() => {
    if (writeOpt)
      console.log('[write-options:success]', {
        boardId,
        response: writeOpt,
        serverAnonymousAllowed: writeOpt.anonymousWritable,
      });
  }, [writeOpt, boardId]);

  useEffect(() => {
    if (isError) {
      const err: any = error;
      console.log('[write-options:error]', {
        boardId,
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
    }
  }, [isError, error, boardId]);

  const onSave = () => handleSave(images);

  const openCategorySheet = () => {
    categoryBottomSheetRef.current?.present();
  };

  const closeCategorySheet = () => {
    categoryBottomSheetRef.current?.dismiss();
  };

  return (
    <Safe>
      <Header>
        <IconBtn onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </IconBtn>
        <HeaderTitle>{isEdit ? 'Edit Post' : 'Write'}</HeaderTitle>
        <SaveBtn onPress={onSave} disabled={!canSave || saving || isUpdating || isCreating}>
          <SaveText $enabled={canSave && !isUpdating && !isCreating}>
            {isEdit ? (isUpdating ? 'Saving...' : 'Save') : isCreating ? 'Saving...' : 'Save'}
          </SaveText>
        </SaveBtn>
      </Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          <CategorySelector category={category} onPress={() => !isEdit && openCategorySheet()} disabled={isEdit} />

          <BodyWrap onPress={() => inputRef.current?.focus()}>
            <Input
              ref={inputRef}
              pointerEvents={isFocused ? 'auto' : 'none'}
              value={body}
              onChangeText={setBody}
              multiline
              scrollEnabled={false}
              textAlignVertical="top"
              placeholder="Feel free to talk about anything you’d like to share with the community."
              placeholderTextColor={theme.colors.gray.gray_1}
              returnKeyType="default"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </BodyWrap>

          {!isFocused && <WritePolicy />}
        </ScrollView>

        <ImagePreviewList images={images} onRemove={removeImage} />

        <BottomBar pointerEvents="box-none">
          <BarLeft pointerEvents="box-only">
            <BarIcon onPress={pickImage}>
              <Icon type="photo" size={24} color={theme.colors.gray.lightGray_1} />
            </BarIcon>
          </BarLeft>

          <BarRight pointerEvents="box-only">
            <AnonymousToggle
              active={anonymous}
              canToggle={canToggleAnon}
              loading={loadingOpt}
              onPress={handleToggleAnonymous}
            />
          </BarRight>
        </BottomBar>
      </KeyboardAvoidingView>

      <CustomBottomSheet ref={categoryBottomSheetRef} backgroundColor="transparent">
        <CategoryBottomSheetContent selectedCategory={category} onSelect={setCategory} onClose={closeCategorySheet} />
      </CustomBottomSheet>
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary.black};
`;
const Header = styled.View`
  height: 48px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const IconBtn = styled.Pressable`
  padding: 6px;
`;
const HeaderTitle = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
`;
const SaveBtn = styled.Pressable<{ disabled?: boolean }>`
  padding: 6px;
`;
const SaveText = styled.Text<{ $enabled: boolean }>`
  color: ${({ theme, $enabled }) => ($enabled ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;
const BodyWrap = styled.Pressable`
  flex: 1;
  margin: 24px 20px;
`;
const StyledRNInput = styled(RNTextInput)`
  flex: 1;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
  padding: 0;
`;
const Input = React.forwardRef<RNTextInput, any>((p, ref) => <StyledRNInput ref={ref} {...p} />);
Input.displayName = 'Input';

const BottomBar = styled.View`
  padding: 16px 20px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BarLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;
const BarRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
const BarIcon = styled.Pressable`
  align-items: center;
  justify-content: center;
`;
