import ProfileImage from '@/components/common/ProfileImage';
import styled from 'styled-components/native';

type AvatarProps = {
  uri?: string;
  size?: number;
  bg?: string;
  showVisitorOnEmpty?: boolean; // ← 추가: 값 없을 때 방문자 처리 여부
};

export default function Avatar({ uri, size = 120, bg = '#2a2f33', showVisitorOnEmpty = true }: AvatarProps) {
  const isEmpty = !uri || String(uri).trim().length === 0;

  return (
    <Frame $size={size} $bg={bg}>
      <Img imageUrl={uri} isVisitor={showVisitorOnEmpty && isEmpty} resizeMode="cover" />
    </Frame>
  );
}

const Frame = styled.View<{ $size: number; $bg: string }>`
  margin: 15px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size / 2}px;
  overflow: hidden;
  background-color: ${({ $bg }) => $bg};
`;

const Img = styled(ProfileImage)`
  width: 100%;
  height: 100%;
`;
