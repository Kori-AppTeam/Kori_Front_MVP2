import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/useChatStore';

export const useTranslateTooltip = (roomName: string) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isTranslating = useChatStore((state) => state.isTranslating);
  const setIsTranslating = useChatStore((state) => state.setIsTranslating);

  // 방 입장 시 툴팁 표시 여부 확인
  useEffect(() => {
    checkTooltipShown();
  }, [roomName]);

  const checkTooltipShown = async () => {
    try {
      const key = `tooltip_shown_${roomName}`;
      const hasShown = await AsyncStorage.getItem(key);
      if (!hasShown) {
        setShowTooltip(true);
      }
    } catch (error) {
      console.error('Failed to check tooltip:', error);
    }
  };

  const markTooltipAsShown = async () => {
    try {
      const key = `tooltip_shown_${roomName}`;
      await AsyncStorage.setItem(key, 'true');
    } catch (error) {
      console.error('Failed to save tooltip state:', error);
    }
  };

  const handleConfirm = async () => {
    setIsTranslating(true);
    setShowTooltip(false);
    await markTooltipAsShown();
  };

  const handleCancel = async () => {
    setShowTooltip(false);
    await markTooltipAsShown();
  };

  const toggleTranslate = () => {
    setIsTranslating(!isTranslating);
  };

  return {
    showTooltip,
    isTranslating,
    handleConfirm,
    handleCancel,
    toggleTranslate,
  };
};
