import Icon from '@/components/common/Icon';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Image as RNImage,
  TextInput as RNTextInput,
  ScrollView,
  View,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';

import { Category } from '@/components/CategoryChips';
import { usePresignedUpload } from '@/hooks/mutations/useImageUpload';
import { useUpdatePost } from '@/hooks/mutations/useUpdatePost';
import { useBoardWriteOptions } from '@/hooks/queries/useBoardWriteOptions';
import useCreatePost from '@/hooks/queries/useCreatePost';
import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import { theme } from '@/src/styles/theme';
import { uploadImageToPresignedUrl } from '@/utils/uploadImageToPresignedUrl';
import { router, useLocalSearchParams } from 'expo-router';

const LOCAL_ALLOW_ANON = new Set<Category>(['Free talk', 'Q&A']);
const CATS: Category[] = ['News', 'Tip', 'Q&A', 'Event', 'Free talk', 'Activity'];
const GREEN = '#30F59B';

export default function WriteScreen() {
  const savingRef = useRef<{ current: boolean }>({ current: false });
  const [saving, setSaving] = useState(false);

  const params = useLocalSearchParams<{ mode?: string; postId?: string; initial?: string }>();
  const isEdit = params.mode === 'edit';
  const postIdNum = params.postId ? Number(params.postId) : undefined;

  const [category, setCategory] = useState<Category>('Activity');
  const boardId = useMemo(() => CATEGORY_TO_BOARD_ID[category], [category]);
  const [catOpen, setCatOpen] = useState(false);

  const { data: writeOpt, isFetching: loadingOpt, isError, error } = useBoardWriteOptions(boardId);
  const serverAnonymousAllowed = writeOpt?.anonymousWritable ?? false;

  useEffect(() => console.log('[write-options:request]', { boardId }), [boardId]);
  useEffect(() => {
    if (loadingOpt) {
      console.log('[write-options:loading]', { boardId });
    }
  }, [loadingOpt, boardId]);

  useEffect(() => {
    if (writeOpt) console.log('[write-options:success]', { boardId, response: writeOpt, serverAnonymousAllowed });
  }, [writeOpt, boardId, serverAnonymousAllowed]);
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

  const [body, setBody] = useState<string>(params.initial ?? '');
  const [anonymous, setAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const inputRef = useRef<RNTextInput>(null);
  const canSave = useMemo(() => body.trim().length > 0, [body]);
  const canToggleAnon = LOCAL_ALLOW_ANON.has(category);

  useEffect(() => {
    if (!canToggleAnon && anonymous) {
      console.log('[anon:auto-off:category-changed]', { fromCat: category, turnedOff: true });
      setAnonymous(false);
    }
  }, [canToggleAnon, category, anonymous]);

  const presignMutation = usePresignedUpload();
  const updateMutation = useUpdatePost();
  const createMutation = useCreatePost(boardId);

  async function confirmPurposeAndPick(setImages: React.Dispatch<React.SetStateAction<string[]>>) {
    const proceed = await new Promise<boolean>((resolve) => {
      Alert.alert('Pick photo', 'The selected photos will be used only to attach to your post. Continue?', [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Continue', onPress: () => resolve(true) },
      ]);
    });
    if (!proceed) return;

    const { status, granted, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      if (!canAskAgain)
        Alert.alert('Permission Required', 'Please allow Photos access in Settings > [App Name] > Photos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.9,
    });

    if (!res.canceled) {
      const uris = res.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  }

  const pickImage = async () => await confirmPurposeAndPick(setImages);
  const removeImage = (uri: string) => setImages((prev) => prev.filter((u) => u !== uri));

  const onSave = async () => {
    if (
      !canSave ||
      savingRef.current.current ||
      presignMutation.isPending ||
      createMutation.isPending ||
      updateMutation.isPending
    )
      return;

    savingRef.current.current = true;
    setSaving(true);
    const content = body.trim();

    try {
      let uploadedKeys: string[] = [];
      if (images.length > 0) {
        const uploadSessionId = `sess_${Date.now()}`;
        const files = images.map((uri, idx) => {
          const filename = uri.split('/').pop() ?? `IMG_${Date.now()}_${idx}.jpg`;
          return { filename, contentType: 'image/jpeg' as const };
        });

        const presignRes = await presignMutation.mutateAsync({ imageType: 'POST', uploadSessionId, files });
        await Promise.all(
          presignRes.map((p, i) =>
            uploadImageToPresignedUrl({ putUrl: p.putUrl, headers: p.headers ?? {}, fileUri: images[i] }),
          ),
        );
        uploadedKeys = presignRes.map((p) => p.key);
      }

      if (isEdit && postIdNum) {
        await updateMutation.mutateAsync({
          postId: postIdNum,
          body: { content, images: uploadedKeys, removedImages: [] },
        });
        Alert.alert('Saved', 'Post updated successfully.');
      } else {
        await createMutation.mutateAsync({ content, imageUrls: uploadedKeys, isAnonymous: anonymous });
        Alert.alert('Success', 'Post created successfully!');
      }

      router.back();
    } catch (e: any) {
      console.log('[write:save:error]', { status: e?.response?.status, data: e?.response?.data, message: e?.message });
      Alert.alert('Error', isEdit ? 'Failed to update post.' : 'Failed to create post.');
    } finally {
      savingRef.current.current = false;
      setSaving(false);
    }
  };

  return (
    <Safe>
      <Header>
        <IconBtn onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.primary.white} />
        </IconBtn>
        <HeaderTitle>{isEdit ? 'Edit Post' : 'Write'}</HeaderTitle>
        <SaveBtn onPress={onSave} disabled={!canSave || saving || updateMutation.isPending || createMutation.isPending}>
          <SaveText $enabled={canSave && !updateMutation.isPending && !createMutation.isPending}>
            {isEdit
              ? updateMutation.isPending
                ? 'Saving...'
                : 'Save'
              : createMutation.isPending
                ? 'Saving...'
                : 'Save'}
          </SaveText>
        </SaveBtn>
      </Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView style={{ flex: 1 }} scrollEnabled={false} onTouchStart={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }}>
            <CatRow onPress={() => !isEdit && setCatOpen(true)} disabled={isEdit} pointerEvents="box-only">
              <CatLabel>Category</CatLabel>
              <CatChip style={isEdit ? { opacity: 0.5 } : undefined}>
                <CatText>{category}</CatText>
                <RotatedIcon>
                  <Icon type="next" size={16} color={theme.colors.gray.gray_1} />
                </RotatedIcon>
              </CatChip>
            </CatRow>

            <Divider pointerEvents="none" />

            <BodyWrap pointerEvents="box-none">
              <Input
                ref={inputRef}
                value={body}
                onChangeText={setBody}
                multiline
                textAlignVertical="top"
                placeholder="If you write inappropriate posts, you may be reported or blocked."
                placeholderTextColor="#8a8a8a"
                returnKeyType="default"
              />
            </BodyWrap>

            {images.length > 0 && (
              <PreviewWrap pointerEvents="box-none">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {images.map((uri) => (
                    <Thumb key={uri}>
                      <ThumbImage source={{ uri }} />
                      <RemoveBtn onPress={() => removeImage(uri)}>
                        <Icon type="close" size={16} color={theme.colors.primary.white} />
                      </RemoveBtn>
                    </Thumb>
                  ))}
                </ScrollView>
              </PreviewWrap>
            )}

            <BottomBar pointerEvents="box-none">
              <BarLeft pointerEvents="box-only">
                <BarIcon onPress={pickImage}>
                  <Icon type="photo" size={20} color={theme.colors.gray.lightGray_1} />
                </BarIcon>
              </BarLeft>

              <BarRight pointerEvents="box-only">
                <Anon
                  $active={anonymous}
                  $disabled={!canToggleAnon}
                  onPress={() => {
                    if (!canToggleAnon) {
                      Alert.alert('Anonymous not available', 'Only Free talk and Q&A support anonymous posts.');
                      return;
                    }
                    setAnonymous(!anonymous);
                  }}
                >
                  <AnonText $active={anonymous}>
                    {loadingOpt
                      ? 'Anonymous (checking...)'
                      : canToggleAnon
                        ? 'Anonymous'
                        : 'Anonymous (only Free talk & Q&A)'}
                  </AnonText>
                  <AntDesign
                    name={anonymous ? 'checksquare' : 'checksquareo'}
                    size={16}
                    color={anonymous ? GREEN : '#8a8a8a'}
                    style={{ marginLeft: 6 }}
                  />
                </Anon>
              </BarRight>
            </BottomBar>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={catOpen} transparent animationType="slide" onRequestClose={() => setCatOpen(false)}>
        <Overlay activeOpacity={1} onPress={() => setCatOpen(false)}>
          <Sheet onStartShouldSetResponder={() => true}>
            <HandleWrap>
              <Handle />
            </HandleWrap>
            <FlatList
              data={CATS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <CatSheetItem
                  onPress={() => {
                    setCategory(item);
                    setCatOpen(false);
                  }}
                >
                  <CatSheetItemText active={item === category}>{item}</CatSheetItemText>
                  {item === category ? <AntDesign name="check" size={20} color="#30F59B" /> : null}
                </CatSheetItem>
              )}
              ItemSeparatorComponent={() => <Divider />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </Sheet>
        </Overlay>
      </Modal>
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
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
  color: #fff;
  font-size: 18px;
  font-family: 'PlusJakartaSans_500Bold';
`;
const SaveBtn = styled.Pressable<{ disabled?: boolean }>`
  padding: 6px;
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
`;
const SaveText = styled.Text<{ $enabled: boolean }>`
  color: ${(p) => (p.$enabled ? '#30F59B' : '#9aa0a6')};
  font-size: 16px;
  font-family: 'PlusJakartaSans_700Bold';
`;

const CatRow = styled.Pressable<{ disabled?: boolean }>`
  padding: 10px 12px 8px;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;
const CatLabel = styled.Text`
  color: #9aa0a6;
  font-size: 13px;
  font-family: 'PlusJakartaSans_400Regular';
`;
const CatChip = styled.View`
  height: 24px;
  padding: 0 10px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;
const CatText = styled.Text`
  color: #cfd4da;
  font-size: 16px;
  flex: 1;
`;
const RotatedIcon = styled.View`
  transform: rotate(90deg);
`;

const Divider = styled.View`
  height: 1px;
  background: #4a4b4c;
`;
const BodyWrap = styled.View`
  flex: 1;
  padding: 10px 12px 0;
`;
const StyledRNInput = styled(RNTextInput)`
  flex: 1;
  min-height: 150px;
  color: #e6e9ec;
  font-size: 14px;
  line-height: 20px;
  padding: 0;
`;
const Input = React.forwardRef<RNTextInput, any>((p, ref) => <StyledRNInput ref={ref} {...p} />);
Input.displayName = 'Input';
const PreviewWrap = styled.View`
  padding: 8px 12px 0;
`;
const Thumb = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 10px;
  overflow: hidden;
  background: #111213;
  margin-right: 8px;
`;
const ThumbImage = styled(RNImage)`
  width: 96px;
  height: 96px;
`;
const RemoveBtn = styled.Pressable`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
`;
const BottomBar = styled.View`
  padding: 8px 10px 12px;
  border-top-width: 1px;
  border-top-color: #222426;
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
  width: 32px;
  height: 32px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;
const Anon = styled.Pressable<{ $active?: boolean; $disabled?: boolean }>`
  height: 32px;
  padding: 0 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
`;
const AnonText = styled.Text<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? '#30F59B' : '#cfd4da')};
  font-family: 'PlusJakartaSans_600SemiBold';
  font-size: 12px;
`;

const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;
const Sheet = styled.View`
  background-color: #353637;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 70%;
  padding-bottom: 20px;
`;
const HandleWrap = styled.View`
  align-items: center;
  padding: 20px 20px 10px 20px;
`;
const Handle = styled.View`
  width: 40px;
  height: 4px;
  background-color: #949899;
  border-radius: 2px;
`;
const CatSheetItem = styled.Pressable<{ active?: boolean }>`
  padding: 16px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const CatSheetItemText = styled.Text<{ active?: boolean }>`
  color: ${(p) => (p.active ? '#e6e9ec' : '#cfd4da')};
  font-size: 16px;
  font-family: 'PlusJakartaSans-Regular';
  flex: 1;
`;
