/**
 * @deprecated
 * MembersBox는 src/features/chat/member/components/MemberItem.tsx로 이동되었습니다.
 * 기존 코드와의 호환성을 위해 이 파일을 유지하지만, 새 코드에서는 MemberItem을 사용하세요.
 */
import { MemberItem } from '@/src/features/chat/member/components';
import React from 'react';

interface MembersBoxProps {
  name: string;
  onPressMore: () => void;
  onPressProfile: () => void;
  isHost: boolean;
  imageUrl?: string;
}

const MembersBox: React.FC<MembersBoxProps> = ({ name, onPressMore, onPressProfile, isHost, imageUrl }) => {
  return (
    <MemberItem
      name={name}
      isHost={isHost}
      imageUrl={imageUrl}
      onPressProfile={onPressProfile}
      onPressMore={onPressMore}
    />
  );
};

export default MembersBox;
