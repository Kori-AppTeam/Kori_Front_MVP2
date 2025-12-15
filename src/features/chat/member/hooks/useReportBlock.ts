import { useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { blockUser, checkIsGroupChat } from '../api/report';
import type { LeaveChatCallback } from '../types';

interface UseReportBlockParams {
  roomId: string | number;
  onLeaveChat: LeaveChatCallback;
}

interface UseReportBlockReturn {
  // 모달 상태
  isModalVisible: boolean;
  isReportMenuVisible: boolean;
  isReportVisible: boolean;

  // 선택된 사용자 정보
  selectedMemberName: string | null;
  targetUserId: number | null;

  // 신고 내용
  reportDetails: string;
  setReportDetails: (text: string) => void;

  // 모달 제어
  openReportBlockMenu: (userId: number, memberName: string) => void;
  closeModal: () => void;
  openReportMenu: () => void;
  closeReportMenuModal: () => void;
  openReportDetailModal: () => void;
  closeReportDetailModal: () => void;

  // 액션
  handleBlockUser: () => void;
  handleSubmitReport: () => Promise<void>;
}

/**
 * 신고/차단 및 관련 모달 관리 Hook
 */
export const useReportBlock = ({ roomId, onLeaveChat }: UseReportBlockParams): UseReportBlockReturn => {
  // 모달 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReportMenuVisible, setReportMenuVisible] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);

  // 선택된 사용자 정보
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);

  // 신고 내용
  const [reportDetails, setReportDetails] = useState('');

  // 신고/차단 메뉴 열기
  const openReportBlockMenu = (userId: number, memberName: string) => {
    setSelectedMemberName(memberName);
    setTargetUserId(userId);
    setModalVisible(true);
  };

  // 신고/차단 메뉴 닫기
  const closeModal = () => {
    setModalVisible(false);
  };

  // 신고 사유 선택 메뉴 열기
  const openReportMenu = () => {
    setModalVisible(false);
    setReportMenuVisible(true);
  };

  // 신고 사유 선택 메뉴 닫기
  const closeReportMenuModal = () => {
    setReportMenuVisible(false);
    setModalVisible(false);
  };

  // 신고 상세 입력 모달 열기
  const openReportDetailModal = () => {
    setModalVisible(false);
    setReportMenuVisible(false);
    setIsReportVisible(true);
  };

  // 신고 상세 입력 모달 닫기
  const closeReportDetailModal = () => {
    setIsReportVisible(false);
    setReportDetails('');
  };

  // 차단하기
  const handleBlockUser = () => {
    setModalVisible(false);

    Alert.alert(
      'Block User',
      'If you block this user in a 1-on-1 chat, you will leave the chat room.\n\nIn a group chat, you will no longer see messages from the blocked user.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block User',
          onPress: async () => {
            if (!targetUserId) return;

            try {
              // 그룹 채팅 여부 확인
              const isGroup = await checkIsGroupChat(roomId);

              // 사용자 차단
              await blockUser(targetUserId);

              // 1:1 채팅이면 채팅방 나가기
              if (!isGroup) {
                await onLeaveChat();
              }

              Toast.show({
                type: 'success',
                text1: 'Blocking this user success',
              });

              // 상태 초기화
              setTargetUserId(null);
              setSelectedMemberName(null);
            } catch (error) {
              console.error('block error', error);
              Toast.show({
                type: 'error',
                text1: 'Blocking this user fail',
              });
            }
          },
        },
      ],
    );
  };

  // 신고 제출
  const handleSubmitReport = async () => {
    if (!targetUserId) return;

    try {
      // TODO: API 스펙 확인 후 주석 해제
      // await reportUser(targetUserId, reportDetails);

      Toast.show({
        type: 'success',
        text1: 'Your report has been received',
        text2: 'It takes up to 24 hours to review',
      });

      closeReportDetailModal();
      setTargetUserId(null);
      setSelectedMemberName(null);
    } catch (error) {
      console.error('신고 실패', error);
      Toast.show({
        type: 'error',
        text1: 'Report Fail',
      });
      closeReportDetailModal();
    }
  };

  return {
    // 모달 상태
    isModalVisible,
    isReportMenuVisible,
    isReportVisible,

    // 선택된 사용자 정보
    selectedMemberName,
    targetUserId,

    // 신고 내용
    reportDetails,
    setReportDetails,

    // 모달 제어
    openReportBlockMenu,
    closeModal,
    openReportMenu,
    closeReportMenuModal,
    openReportDetailModal,
    closeReportDetailModal,

    // 액션
    handleBlockUser,
    handleSubmitReport,
  };
};
