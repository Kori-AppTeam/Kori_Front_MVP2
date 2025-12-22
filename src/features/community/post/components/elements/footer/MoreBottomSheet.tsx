import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { usePostActions } from '../../../hooks/usePostActions';
import useVisitor from '../../../hooks/useVisitor';
import { useMoreSheetStore } from '../../../store/useMoreSheetStore';
import MyPostModal from './MyPostModal';
import OthersPostModal from './OthersPostModal';

const MoreBottomSheet = () => {
  const pathname = usePathname();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { data } = useVisitor();
  const { selectedPostId, authorId, isMoreSheetVisible, hideMoreSheet } = useMoreSheetStore();

  // usePostActions 훅 호출
  const { handleDeletePost, handleRouterUpdatePost, handleReportPost, handleBlockUser } = usePostActions();

  const isMine = data?.userId === authorId;

  // 모달 열릴 때마다 현재 경로를 체크하기 위한 state
  const [currentPath, setCurrentPath] = React.useState(pathname);

  useEffect(() => {
    if (isMoreSheetVisible) {
      setCurrentPath(pathname);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isMoreSheetVisible, pathname]);

  const isDetailPage = currentPath.startsWith('/community/detail/');
  const onSuccessNavigate = isDetailPage ? () => router.back() : undefined;

  return (
    <CustomBottomSheet
      ref={bottomSheetRef}
      backgroundColor="transparent"
      onChange={(index) => {
        if (index === -1) {
          hideMoreSheet();
        }
      }}
    >
      {selectedPostId && authorId ? (
        isMine ? (
          <MyPostModal
            onSuccessNavigate={onSuccessNavigate}
            onDelete={handleDeletePost}
            onEdit={handleRouterUpdatePost}
            onClose={hideMoreSheet}
          />
        ) : (
          <OthersPostModal
            onSuccessNavigate={onSuccessNavigate}
            onReport={handleReportPost}
            onBlock={handleBlockUser}
            onClose={hideMoreSheet}
          />
        )
      ) : (
        <></>
      )}
    </CustomBottomSheet>
  );
};

export default MoreBottomSheet;
