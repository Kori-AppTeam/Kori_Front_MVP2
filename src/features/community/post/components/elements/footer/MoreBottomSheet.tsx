import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import useVisitor from '../../../hooks/useVisitor';
import { useMoreSheetStore } from '../../../store/useMoreSheetStore';
import MyPostModal from './MyPostModal';
import OthersPostModal from './OthersPostModal';

const MoreBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { data } = useVisitor();
  const { selectedPostId, authorId, isMoreSheetVisible, resetData } = useMoreSheetStore();

  const isMine = data?.userId === authorId;

  useEffect(() => {
    if (isMoreSheetVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isMoreSheetVisible]);

  return (
    <CustomBottomSheet
      ref={bottomSheetRef}
      backgroundColor="transparent"
      onChange={(index) => {
        if (index === -1) {
          resetData();
        }
      }}
    >
      {selectedPostId && authorId ? isMine ? <MyPostModal /> : <OthersPostModal /> : <></>}
    </CustomBottomSheet>
  );
};

export default MoreBottomSheet;
