import { AnonymousToggle } from '@/src/features/community/write/components/AnonymousToggle';
import CreateVoteBox from '@/src/features/community/write/components/CreateVoteBox';
import WriteCommonLayout, {
  BarLeft,
  BarRight,
  BodyWrap,
  BottomBar,
} from '@/src/features/community/write/components/WriteCommonLayout';
import WriteContentInput from '@/src/features/community/write/components/WriteContentInput';
import WritePolicy from '@/src/features/community/write/components/WritePolicy';
import { useWriteVoteForm } from '@/src/features/community/write/hooks/useWriteVoteForm';
import { InitialVoteEditData } from '@/src/features/community/write/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { TextInput as RNTextInput, ScrollView } from 'react-native';

const Index = () => {
  const params = useLocalSearchParams<{ mode?: string; postId?: string; initialData?: string }>();
  const isEdit = params.mode === 'edit';
  const postIdNum = params.postId ? Number(params.postId) : undefined;
  const inputRef = useRef<RNTextInput>(null);

  // 수정 모드일 때 initialData 파싱
  const parsedEditData = useMemo(() => {
    if (!isEdit || !params.initialData) return null;
    try {
      return JSON.parse(params.initialData) as InitialVoteEditData;
    } catch (e) {
      console.error('[write:parse-initial-data:error]', e);
      return null;
    }
  }, [isEdit, params.initialData]);

  // 폼 상태 및 로직 훅
  const {
    body,
    setBody,
    anonymous,
    isFocused,
    setIsFocused,
    canSave,
    isCreating,
    isUpdating,
    handleSave,
    handleToggleAnonymous,
    title,
    setTitle,
    description,
    setDescription,
    options,
    setOptions,
  } = useWriteVoteForm({
    isEdit,
    postId: postIdNum,
    initialTitle: parsedEditData?.title ?? '',
    initialDescription: parsedEditData?.description ?? '',
    initialContent: parsedEditData?.content ?? '',
    initialAnonymous: parsedEditData?.isAnonymous ?? false,
    initialOptions: parsedEditData?.options ?? ['', ''],
  });

  const headerTitle = isEdit ? 'Edit Vote' : 'Vote';
  const disabled = !canSave || isCreating || isUpdating;
  const saveText = isEdit ? (isUpdating ? 'Saving...' : 'Save') : isCreating ? 'Saving...' : 'Save';

  const bottomBar = (
    <BottomBar pointerEvents="box-none">
      <BarLeft></BarLeft>
      <BarRight pointerEvents="box-only">
        <AnonymousToggle active={anonymous} canToggle={!isEdit} onPress={handleToggleAnonymous} />
      </BarRight>
    </BottomBar>
  );

  return (
    <WriteCommonLayout
      headerTitle={headerTitle}
      onSave={handleSave}
      disabled={disabled}
      saveText={saveText}
      bottomBar={bottomBar}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 30,
        }}
      >
        <BodyWrap onPress={() => inputRef.current?.focus()}>
          <WriteContentInput
            ref={inputRef}
            pointerEvents={isFocused ? 'auto' : 'none'}
            value={body}
            onChangeText={setBody}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Feel free to talk about anything you’d like to share with the community."
          />
          <CreateVoteBox
            isEditMode={isEdit}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            options={options}
            setOptions={setOptions}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </BodyWrap>
        {isFocused === false ? <WritePolicy /> : null}
      </ScrollView>
    </WriteCommonLayout>
  );
};

export default Index;
