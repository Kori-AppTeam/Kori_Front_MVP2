import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';
import { AllowedCategory } from '../../../types';

type PostCommentInputProps = {
  inputRef?: React.Ref<RNTextInput | null>;
  text: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  isAnonymous: boolean;
  setAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
  category?: AllowedCategory;
};

const PostCommentInput = ({
  inputRef,
  text,
  onChangeText,
  onSubmit,
  isAnonymous,
  setAnonymous,
  category,
}: PostCommentInputProps) => {
  console.log(category);
  const canSend = text.trim().length > 0;
  return (
    <InputBar>
      <Composer>
        <BottomInput
          ref={inputRef}
          value={text}
          onChangeText={onChangeText}
          placeholder="Write Your Text"
          placeholderTextColor={theme.colors.gray.darkGray_2}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
          contextMenuHidden={false}
          selectTextOnFocus={false}
          editable={true}
        />

        {/* FREE_TALK, QNA 카테고리 글에서만 익명 댓글 작성 가능 */}
        {(category === 'FREE_TALK' || category === 'QNA') && (
          <AnonToggle
            onPress={() => {
              setAnonymous((prev) => !prev);
            }}
          >
            <AnonLabel>Anonymous</AnonLabel>
            <Check $active={isAnonymous}>
              {isAnonymous && <Icon type="check" size={16} color={theme.colors.primary.white} />}
            </Check>
          </AnonToggle>
        )}
      </Composer>

      <SendBtn onPress={onSubmit} disabled={!canSend} hitSlop={8}>
        <Icon type="send" size={24} color={canSend ? theme.colors.primary.mint : theme.colors.gray.lightGray_1} />
      </SendBtn>
    </InputBar>
  );
};

export default PostCommentInput;

const InputBar = styled.View`
  padding: 10px 12px 14px 12px;
  background: #1d1e1f;
  border-top-width: 1px;
  border-top-color: #222426;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
`;
const Composer = styled.View`
  flex: 1;
  background: #414142;
  border-radius: 8px;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
`;
const BottomInput = styled(RNTextInput)`
  flex: 1;
  color: #ffffff;
  font-size: 14px;
  padding: 0;
  background: transparent;
`;
const AnonToggle = styled.Pressable`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;
const AnonLabel = styled.Text`
  color: #cccfd5;
  font-size: 14px;
  margin-right: 8px;
  font-family: 'PlusJakartaSans_Light';
`;
const Check = styled.View<{ $active?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border-width: 1.1px;
  border-color: #cccfd5;
  background: ${({ $active }) => ($active ? '#30f59b' : 'transparent')};
  align-items: center;
  justify-content: center;
`;

const SendBtn = styled.Pressable<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
