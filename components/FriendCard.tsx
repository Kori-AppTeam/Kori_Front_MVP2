import Icon from '@/components/common/Icon';
import ProfileImage from '@/components/common/ProfileImage';
import Tag from '@/components/Tag';
import { getEmojiFor } from '@/src/lib/interests';
import CustomButton from '@/src/shared/components/CustomButton';
import { Config } from '@/src/shared/constants/config';
import { theme } from '@/src/styles/theme';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';

type FollowStatus = 'SELF' | 'PENDING' | 'ACCEPTED' | 'NOT_FOLLOWING';
type RequestMode = 'friend' | 'received' | 'sent';

type Props = {
  userId: number;
  name: string;
  country: string;
  birth?: number;
  gender?: 'Male' | 'Female' | string;
  purpose: string;
  languages: string[];
  personalities: string[];
  bio?: string;

  imageUrl?: string;
  imageKey?: string;

  personalityEmojis?: string[];
  followStatus?: FollowStatus; // 👈 [추가]
  isLoadingFollow?: boolean; // 👈 [추가]
  isLoadingChat?: boolean; // 👈 [추가]
  onFollow?: () => void; // 👈 [수정] (userId: number) 제거
  onUnfollow?: () => void; // 👈 [수정] (userId: number) 제거

  mode?: RequestMode;
  onAccept?: (userId: number) => void;
  onCancel?: (userId: number) => void;

  onChat?: () => void;
  footerSlot?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
};

const CARD_RADIUS = 22;
const CARD_MAX_W = 388;
const P_H = 20;
const P_TOP = 22;
const P_BOTTOM = 18;

const NAME_MT = 14;
const META_MT = 6;
const BIO_MT = 14;
const BIO_MB = 18;

const DIVIDER_COLOR = '#EAEAEA';
const CHEVRON = { size: 28, ring: 1, lift: 13 };

const SECTION_GAP_TOP = 16;
const COL_GAP = 18;

const BTN_GAP = 14;
const CARD_OUTER_GAP = 16;

const genderIconType: Record<NonNullable<Props['gender']>, import('@/components/common/Icon').IconType> = {
  Male: 'maleColored',
  Female: 'femaleColored',
  unspecified: 'nogender',
};
const toUrl = (u?: string) => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  const base =
    (Config as any).EXPO_PUBLIC_NCP_PUBLIC_BASE_URL ||
    (Config as any).NCP_PUBLIC_BASE_URL ||
    (Config as any).EXPO_PUBLIC_IMAGE_BASE_URL ||
    (Config as any).IMAGE_BASE_URL ||
    '';
  return base ? `${String(base).replace(/\/+$/, '')}/${String(u).replace(/^\/+/, '')}` : undefined;
};

export default function FriendCard(props: Props) {
  const {
    userId,
    name,
    country,
    birth,
    gender,
    purpose,
    languages = [],
    personalities = [],
    personalityEmojis = [],
    bio = 'Hello~ I came to Korea from\nthe U.S. as an exchange student',
    imageUrl,
    imageKey,
    followStatus,
    isLoadingFollow = false, // 👈 [추가]
    isLoadingChat = false, // 👈 [추가]
    onFollow,
    onUnfollow,

    mode = 'friend',
    onAccept,
    onCancel,

    collapsible = true,
    onChat,
    footerSlot,
    defaultExpanded = true,
  } = props;

  //gender가 Male 또는 Female이 아닌 경우 'unspecified'로 처리
  const effectiveGender = gender === 'Male' || gender === 'Female' ? gender : 'unspecified';

  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));
  const finalAvatarUrl = imageUrl ?? imageKey ?? null;

  const effectiveStatus: FollowStatus =
    (followStatus as FollowStatus) ?? (mode === 'received' || mode === 'sent' ? 'PENDING' : 'NOT_FOLLOWING');

  const handlePrimaryPress = () => {
    if (mode === 'received') {
      onAccept?.(userId);
      return;
    }
    if (mode === 'sent') {
      onCancel?.(userId);
      return;
    }
    // 'friend' 모드일 때 (이 코드는 현재 사용되지 않지만, 만약을 위해 수정)
    if (effectiveStatus === 'ACCEPTED') onUnfollow?.();
    else if (effectiveStatus === 'NOT_FOLLOWING') onFollow?.();
  };

  return (
    <CardWrap>
      <CardInner
        style={Platform.select({
          ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
          android: { elevation: 2 },
        })}
      >
        <Top>
          <AvatarImg imageUrl={finalAvatarUrl} isVisitor={!finalAvatarUrl} />

          <Name>{name}</Name>

          <MetaLine>
            <MetaRow>
              <MetaDim>Birth </MetaDim>
              <MetaStrong>{birth ? String(birth) : '-'}</MetaStrong>

              <GenderIconSpacer>
                <Icon type={genderIconType[effectiveGender]} size={16} color={theme.colors.gray.gray_1} />
              </GenderIconSpacer>
            </MetaRow>

            <MetaDim>From </MetaDim>
            <MetaStrong>{country}</MetaStrong>
          </MetaLine>

          <Bio numberOfLines={expanded ? 4 : 2}>{bio}</Bio>
        </Top>

        <DividerWrap>
          <Divider />
          {collapsible && (
            <ChevronButton onPress={() => setExpanded(!expanded)}>
              <Icon type={expanded ? 'arrowUp' : 'arrowDown'} size={24} />
            </ChevronButton>
          )}
        </DividerWrap>

        {expanded && (
          <>
            <RowTop>
              <Col>
                <LabelRow>
                  <SmallIconWrap>
                    <Icon type="purpose" size={16} color={theme.colors.gray.gray_1} />
                  </SmallIconWrap>
                  <Label>Purpose</Label>
                </LabelRow>
                <CategoryValue>{purpose}</CategoryValue>
              </Col>

              <ColRight>
                <LabelRow>
                  <SmallIconWrap>
                    <Icon type="global" size={16} color={theme.colors.gray.gray_1} />
                  </SmallIconWrap>
                  <Label>Language</Label>
                </LabelRow>
                <LangWrap>
                  {languages?.map((lg, i) => {
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
              {personalities.map((p, i) => {
                const emoji = personalityEmojis[i] ?? getEmojiFor(p);
                const label = emoji ? `${emoji} ${p}` : p;
                return <Tag key={`${p}-${i}`} label={label} />;
              })}
            </TagsWrap>
          </>
        )}

        <Actions>
          {mode === 'received' ? (
            <>
              <CustomButton label="Accept" tone="mint" filled leftIcon="add" onPress={() => onAccept?.(userId)} />
              <CustomButton label="Decline" tone="danger" filled leftIcon="close" onPress={() => onCancel?.(userId)} />
            </>
          ) : mode === 'sent' ? (
            <>
              {/* 'sent' 모드에서는 PENDING과 동일한 버튼을 보여줌 */}
              <CustomButton label="Pending" tone="muted" filled={false} leftIcon="check" disabled={true} />
              <CustomButton
                label="Chat"
                tone="black"
                filled
                leftIcon="chat-bubble-outline"
                onPress={onChat}
                disabled={isLoadingChat}
              />
            </>
          ) : (
            // 'friend' 모드 (PostDetailScreen에서 사용)
            <>
              {/* --- Follow/Unfollow/Pending 버튼 --- */}
              {effectiveStatus === 'ACCEPTED' && (
                <CustomButton
                  label="Following"
                  tone="black"
                  filled={false}
                  leftIcon="check"
                  borderColor="#949899"
                  labelColor="#949899"
                  onPress={onUnfollow} // 👈 (userId) 제거
                  disabled={isLoadingFollow} // 👈 로딩 상태 적용
                  isLoading={isLoadingFollow} // 👈 로딩 인디케이터 (CustomButton이 지원한다면)
                />
              )}
              {effectiveStatus === 'NOT_FOLLOWING' && (
                <CustomButton
                  label="Follow"
                  tone="mint"
                  filled
                  leftIcon="add"
                  onPress={onFollow} // 👈 (userId) 제거
                  disabled={isLoadingFollow} // 👈 로딩 상태 적용
                  isLoading={isLoadingFollow} // 👈 로딩 인디케이터
                />
              )}
              {effectiveStatus === 'PENDING' && (
                <CustomButton
                  label="Pending"
                  tone="muted"
                  filled={false}
                  leftIcon="check"
                  disabled={true} // 👈 PENDING은 항상 비활성화
                />
              )}
              {/* followStatus === 'SELF'일 경우, 위 3개 버튼 모두 렌더링 안 됨 */}

              {/* --- Chat 버튼 --- */}
              {effectiveStatus !== 'SELF' && ( // 👈 'SELF'가 아닐 때만 채팅 버튼 표시
                <CustomButton
                  label="Chat"
                  tone="black"
                  filled
                  leftIcon="chat-bubble-outline"
                  onPress={onChat}
                  disabled={isLoadingChat} // 👈 로딩 상태 적용
                  isLoading={isLoadingChat} // 👈 로딩 인디케이터
                />
              )}
            </>
          )}
        </Actions>

        {footerSlot}
      </CardInner>
    </CardWrap>
  );
}

/* ===== 스타일 그대로 ===== */
const CardWrap = styled.View`
  width: 100%;
  align-self: stretch;
  padding: 0 ${P_H}px;
  margin: ${CARD_OUTER_GAP / 2}px 0;
`;
const CardInner = styled.View`
  align-self: center;
  width: 100%;
  max-width: ${CARD_MAX_W}px;
  background-color: #ffffff;
  border-radius: ${CARD_RADIUS}px;
  padding: ${P_TOP}px ${P_H}px ${P_BOTTOM}px ${P_H}px;
`;
const Top = styled.View`
  align-items: center;
`;
const Name = styled.Text`
  margin-top: ${NAME_MT}px;
  font-size: 18px;
  line-height: 24px;
  font-family: 'PlusJakartaSans_600SemiBold';
  color: #111;
  letter-spacing: 0.1px;
`;
const MetaLine = styled.View`
  margin-top: ${META_MT}px;
  flex-direction: row;
  align-items: flex-start; /* ⬅︎ 세로 가운데 말고 위 기준 */
  flex-wrap: nowrap; /* ⬅︎ 줄바꿈 허용 */
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GenderIconSpacer = styled.View`
  width: 16px; /* 아이콘 12~14 추천 */
  height: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray.lightGray_2};
  align-items: center;
  justify-content: center;
  margin: 0 6px; /* 텍스트 사이 간격 */
`;
const MetaDim = styled.Text`
  font-family: 'PlusJakartaSans_400Regular';
  color: #9a9a9a;
  font-size: 13px;
  line-height: 18px;
`;
const MetaStrong = styled.Text`
  font-family: 'PlusJakartaSans_500SemiBold';
  color: #111;
  font-size: 13px;
  line-height: 18px;
`;
const Bio = styled.Text`
  margin-top: ${BIO_MT}px;
  margin-bottom: ${BIO_MB}px;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
  text-align: center;
  font-family: 'PlusJakartaSans_300Light';
`;
const DividerWrap = styled.View`
  position: relative;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  margin-top: 9px;
  margin-bottom: 18px;
`;
const Divider = styled.View`
  height: 1px;
  align-self: stretch;
  background-color: ${DIVIDER_COLOR};
`;
const ChevronButton = styled.Pressable`
  position: absolute;
  top: 50%;
  margin-top: -${CHEVRON.lift}px;
  width: ${CHEVRON.size}px;
  height: ${CHEVRON.size}px;
  border-radius: ${CHEVRON.size / 2}px;
  border-width: ${CHEVRON.ring}px;
  border-color: #dcdcdc;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;
const Row = styled.View`
  flex-direction: row;
  align-self: stretch;
`;
const RowTop = styled(Row)`
  margin-top: ${SECTION_GAP_TOP}px;
`;
const Col = styled.View`
  flex: 1;
`;
const ColRight = styled(Col)`
  margin-left: ${COL_GAP}px;
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
const TagsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
`;
const Actions = styled.View`
  margin-top: 16px;
  flex-direction: row;
  gap: ${BTN_GAP}px;
`;
const InterestHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 8px;
`;
const AvatarImg = styled(ProfileImage)`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  background: #f3f4f5;
`;

const SmallIconWrap = styled.View`
  width: 16px;
  height: 16px;
`;
