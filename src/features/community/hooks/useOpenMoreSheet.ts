import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import useGetVisitor from './useGetVisitor';

// 게시글 더보기 모달 열기 훅
export const useOpenMoreSheet = () => {
  const [selectedPost, setSelectedPost] = useState<null | number>(null);
  const [isMine, setIsMine] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { data } = useGetVisitor(); // 내 id 가져오기

  const openModal = useCallback(
    (postId: number, authorId: number) => {
      setSelectedPost(postId);

      // 내 게시글인지 확인
      if (data) {
        setIsMine(data.userId === authorId);
      }

      bottomSheetRef.current?.present();
    },
    [data],
  );

  const closeModal = () => {
    setSelectedPost(null);
    bottomSheetRef.current?.dismiss();
  };

  return {
    selectedPost,
    isMine,
    openModal,
    closeModal,
    bottomSheetRef,
  };
};
