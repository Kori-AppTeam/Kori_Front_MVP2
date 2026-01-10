// components/UserProfileCard/UserProfileCardDetails.tsx

import Icon from '@/components/common/Icon';
import Tag from '@/src/shared/components/Tag';
import { getEmojiFor } from '@/src/lib/interests';
import { theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { COLUMN_GAP, SECTION_GAP_TOP } from './constants';

interface Props {
  purpose?: string;
  languages?: string[];
  interests?: string[];
}

export function UserProfileCardDetails({ purpose, languages = [], interests = [] }: Props) {
  return (
    <>
      <RowTop>
        <Col>
          <LabelRow>
            <SmallIconWrap>
              <Icon type="purpose" size={16} color={theme.colors.gray.gray_1} />
            </SmallIconWrap>
            <Label>Purpose</Label>
          </LabelRow>
          <CategoryValue>{purpose || '-'}</CategoryValue>
        </Col>

        <ColRight>
          <LabelRow>
            <SmallIconWrap>
              <Icon type="global" size={16} color={theme.colors.gray.gray_1} />
            </SmallIconWrap>
            <Label>Language</Label>
          </LabelRow>
          <LangWrap>
            {languages.map((lg, i) => {
              const match = lg.match(/\[(.*?)\]/);
              const code = match ? match[1].toUpperCase() : lg.toUpperCase();
              return (
                <React.Fragment key={`${lg}-${i}`}>
                  {i > 0 && <LangDot>•</LangDot>}
                  <LangText>{code}</LangText>
                </React.Fragment>
              );
            })}
          </LangWrap>
        </ColRight>
      </RowTop>

      <InterestHeader>
        <SmallIconWrap style={{ marginRight: 4 }}>
          <Icon type="heartNonSelected" size={16} color={theme.colors.gray.gray_1} />
        </SmallIconWrap>
        <Label>Interest</Label>
      </InterestHeader>

      <TagsWrap>
        {interests.map((interest, i) => {
          const emoji = getEmojiFor(interest);
          const label = emoji ? `${emoji} ${interest}` : interest;
          return <Tag key={`${interest}-${i}`} label={label} />;
        })}
      </TagsWrap>
    </>
  );
}

const RowTop = styled.View`
  flex-direction: row;
  align-self: stretch;
  margin-top: ${SECTION_GAP_TOP}px;
`;

const Col = styled.View`
  flex: 1;
`;

const ColRight = styled(Col)`
  margin-left: ${COLUMN_GAP}px;
`;

const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Label = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: #808080;
  font-family: 'PlusJakartaSans_400Regular';
  margin-left: 6px;
`;

const CategoryValue = styled.Text`
  margin-top: 4px;
  font-size: 14px;
  line-height: 18px;
  font-family: 'PlusJakartaSans_400Regular';
  color: #000000;
`;

const LangWrap = styled.View`
  margin-top: 4px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const LangText = styled.Text`
  font-size: 13px;
  line-height: 18px;
  font-family: 'PlusJakartaSans_400Regular';
  color: #000000;
`;

const LangDot = styled.Text`
  font-size: 8px;
  color: #9e9e9e;
  margin: 0 6px;
`;

const InterestHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 8px;
`;

const TagsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
`;

const SmallIconWrap = styled.View`
  width: 16px;
  height: 16px;
`;
