import { BoxContainer, Title, TitleRow } from '@/src/features/quizAndVote/components/PollBox';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import { styled } from 'styled-components/native';

interface CreateVoteBoxProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const CreateVoteBox = ({
  title,
  setTitle,
  description,
  setDescription,
  onFocus,
  onBlur,
  options,
  setOptions,
}: CreateVoteBoxProps) => {
  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  return (
    <BoxContainer>
      <TitleRow>
        <TitleInputContainer>
          <Title>Q.</Title>
          <TitleInput
            placeholder="Vote Title"
            placeholderTextColor={theme.colors.gray.gray_2}
            value={title}
            onChangeText={setTitle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </TitleInputContainer>

        <DescriptionInput
          placeholder="Add a description (optional)"
          placeholderTextColor={theme.colors.gray.gray_2}
          value={description}
          onChangeText={setDescription}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </TitleRow>

      <OptionRow>
        <OptionInput
          placeholder="Write down select1"
          placeholderTextColor={theme.colors.gray.gray_2}
          value={options[0]}
          onChangeText={(text) => handleOptionChange(text, 0)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <OptionInput
          placeholder="Write down select2"
          placeholderTextColor={theme.colors.gray.gray_2}
          value={options[1]}
          onChangeText={(text) => handleOptionChange(text, 1)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </OptionRow>
    </BoxContainer>
  );
};

export default CreateVoteBox;

const BaseInput = styled.TextInput.attrs({
  multiline: true,
  scrollEnabled: false,
  textAlignVertical: 'top',
})``;

const TitleInputContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
`;

const TitleInput = styled(BaseInput)`
  flex: 1;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_SB)};
  /* 부모인 BaseInput의 top 설정을 덮어씌움 */
  text-align-vertical: center;

  /* 안드로이드 패딩 이슈 제거를 위해 추가 권장 */
  padding-top: 0;
  padding-bottom: 0;
`;

const DescriptionInput = styled(BaseInput)`
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
`;

const OptionRow = styled.View`
  width: 100%;
  gap: 10px;
`;

const OptionInput = styled(BaseInput)`
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1_5};
  padding: 12px 20px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;
