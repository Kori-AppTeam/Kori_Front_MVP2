import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import useGetVisitor from './useGetVisitor';

// 게시글 더보기 모달 열기 훅
export const useOpenMoreSheet = () => {
  const [selectedPost, setSelectedPost] = useState<null | number>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { data } = useGetVisitor();

  const isMyPost = (authorId: number) => {
    return data?.userId === authorId ? true : false;
  };
  const openModal = (postId: number, authorId: number) => {
    if (selectedPost === postId) return; // 이미 열려있는 모달이면 무시
    setSelectedPost(postId);
    bottomSheetRef.current?.present();
  };
  const closeModal = () => {
    setSelectedPost(null);
    bottomSheetRef.current?.dismiss();
  };

  return {
    selectedPost,
    isMyPost,
    openModal,
    closeModal,
    bottomSheetRef,
  };
};
