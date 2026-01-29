import Icon from '@/components/common/Icon';
import { categoryToClient } from '@/src/features/community/shared/utils/categoryMapper';
import { AnonymousToggle } from '@/src/features/community/write/components/AnonymousToggle';
import { CategoryBottomSheetContent } from '@/src/features/community/write/components/CategoryBottomSheetContent';
import { CategorySelector } from '@/src/features/community/write/components/CategoryPicker';
import { ImagePreviewList } from '@/src/features/community/write/components/ImagePreviewList';
import WriteCommonLayout, {
  BarIcon,
  BarLeft,
  BarRight,
  BottomBar,
} from '@/src/features/community/write/components/WriteCommonLayout';
import WritePolicy from '@/src/features/community/write/components/WritePolicy';
import { useBoardWriteOptions } from '@/src/features/community/write/hooks/useBoardWriteOptions';
import { useImagePicker } from '@/src/features/community/write/hooks/useImagePicker';
import { useWriteForm } from '@/src/features/community/write/hooks/useWriteForm';
import { InitialEditData } from '@/src/features/community/write/types';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { textStyle, theme } from '@/src/styles/theme';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { TextInput as RNTextInput, ScrollView } from 'react-native';
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

  // 작성 옵션 조회
  const { isFetching: loadingOpt } = useBoardWriteOptions(boardId);

  const onSave = () => handleSave(images);
  const headerTitle = isEdit ? 'Edit Post' : 'Write';
  const disabled = !canSave || saving || isUpdating || isCreating;
  const saveText = isEdit ? (isUpdating ? 'Saving...' : 'Save') : isCreating ? 'Saving...' : 'Save';

  const openCategorySheet = () => {
    categoryBottomSheetRef.current?.present();
  };

  const closeCategorySheet = () => {
    categoryBottomSheetRef.current?.dismiss();
  };

  const bottomBar = (
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
  );

  return (
    <>
      <WriteCommonLayout
        headerTitle={headerTitle}
        onSave={onSave}
        disabled={disabled}
        saveText={saveText}
        bottomBar={bottomBar}
      >
        <CategorySelector category={category} onPress={() => !isEdit && openCategorySheet()} disabled={isEdit} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 30,
          }}
        >
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

          <ImagePreviewList images={images} onRemove={removeImage} />
          {isFocused === false ? <WritePolicy /> : null}
        </ScrollView>
      </WriteCommonLayout>

      <CustomBottomSheet ref={categoryBottomSheetRef} backgroundColor="transparent">
        <CategoryBottomSheetContent selectedCategory={category} onSelect={setCategory} onClose={closeCategorySheet} />
      </CustomBottomSheet>
    </>
  );
}

const BodyWrap = styled.Pressable`
  margin: 24px 20px;
`;

const StyledRNInput = styled(RNTextInput)`
  min-height: 200px;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
  padding: 0;
`;

const Input = React.forwardRef<RNTextInput, any>((p, ref) => <StyledRNInput ref={ref} {...p} />);
Input.displayName = 'Input';
