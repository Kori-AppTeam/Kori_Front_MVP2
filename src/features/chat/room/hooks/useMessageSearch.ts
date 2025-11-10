// src/features/chat/room/hooks/useMessageSearch.ts (수정된 버전)
import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { searchMessagesAPI } from '../api/messages';
import { ChatMessage } from '../types/chat.types';

interface SearchState {
  isActive: boolean;
  isSearching: boolean;
  searchText: string;
  searchResults: ChatMessage[];
  currentIndex: number;
  totalCount: number;
  error: Error | null;
}

interface MessageSearchHook {
  state: SearchState;
  flatListRef: React.RefObject<FlatList | null>;
  toggleSearch: () => void;
  setSearchText: (text: string) => void;
  performSearch: () => Promise<void>;
  navigateToUp: () => void;
  navigateToDown: () => void;
  clearSearch: () => void;
  isCurrentMessage: (messageId: number) => boolean;
  getSearchResultText: () => string;
}

export const useMessageSearch = (roomId: string, messages: ChatMessage[]): MessageSearchHook => {
  const [state, setState] = useState<SearchState>({
    isActive: false,
    isSearching: false,
    searchText: '',
    searchResults: [],
    currentIndex: 0,
    totalCount: 0,
    error: null,
  });

  const flatListRef = useRef<FlatList>(null);
  const pointerRef = useRef(0);

  /** 
   * 메시지로 스크롤하는 내부 함수
   * @param messageId 스크롤할 메시지 ID
   */
  const scrollToMessage = useCallback((messageId: number) => {
    const index = messages.findIndex(msg => msg.id === messageId);
    if (flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      } catch (error) {
        console.warn('스크롤 실패:', error);
      }
    }
  }, [messages]);

  /** 검색 수행 후 첫 번째 결과로 스크롤 */
  const performSearch = useCallback(async () => {
    if (!state.searchText.trim()) return;

    try {
      const searchResults = await searchMessagesAPI(roomId, state.searchText);
      setState(prev => ({
        ...prev,
        searchResults,
        totalCount: searchResults.length,
        currentIndex: 0,
        isSearching: true,
      }));

      pointerRef.current = 0;

      // 첫 번째 검색 결과로 스크롤
      if (searchResults.length > 0) {
        scrollToMessage(searchResults[0].id);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isSearching: false,
      }));
    }
  }, [state.searchText, roomId, scrollToMessage]);

  /** 다음 검색 결과(상단) 이동 */
  const navigateToUp = useCallback(() => {
    if (!state.isSearching || state.searchResults.length === 0) return;
    if (pointerRef.current + 1 >= state.searchResults.length) return;

    pointerRef.current += 1;
    const messageId = state.searchResults[pointerRef.current].id;

    setState(prev => ({
      ...prev,
      currentIndex: pointerRef.current,
    }));

    scrollToMessage(messageId);
  }, [state.isSearching, state.searchResults, scrollToMessage]);

  /** 이전 검색 결과(하단) 이동 */
  const navigateToDown = useCallback(() => {
    if (!state.isSearching || state.searchResults.length === 0) return;
    if (pointerRef.current - 1 < 0) return;

    pointerRef.current -= 1;
    const messageId = state.searchResults[pointerRef.current].id;

    setState(prev => ({
      ...prev,
      currentIndex: pointerRef.current,
    }));

    scrollToMessage(messageId);
  }, [state.isSearching, state.searchResults, scrollToMessage]);

  /** 검색 활성화 */
  const activateSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      searchText: '',
      searchResults: [],
      currentIndex: 0,
      totalCount: 0,
      isSearching: false,
    }));
    pointerRef.current = 0;
  }, []);

  /** 검색 비활성화 */
  const deactivateSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isSearching: false,
      searchText: '',
      searchResults: [],
      currentIndex: 0,
      totalCount: 0,
    }));
    pointerRef.current = 0;
  }, []);

  /** 검색 상태 토글 */
  const toggleSearch = useCallback(() => {
    if (state.isActive) {
      deactivateSearch();
    } else {
      activateSearch();
    }
  }, [state.isActive, deactivateSearch, activateSearch]);

  /** 검색어 설정
   * @param text 검색어
   */
  const setSearchText = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      searchText: text,
      isSearching: false,
    }));
  }, []);

  /** 검색 초기화 */
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchText: '',
      isSearching: false,
      searchResults: [],
      currentIndex: 0,
      totalCount: 0,
    }));
    pointerRef.current = 0;
  }, []);

  /** 현재 메시지가 검색 결과인지 확인
   * @param messageId 메시지 ID
   */
  const isCurrentMessage = useCallback((messageId: number) => {
    if (!state.isSearching || state.searchResults.length === 0) return false;
    return state.searchResults[pointerRef.current]?.id === messageId;
  }, [state.isSearching, state.searchResults]);

  /** 검색 결과 텍스트 반환
   * @return 검색 결과 텍스트 (예: "2/5")
   */
  const getSearchResultText = useCallback(() => {
    if (!state.isSearching || state.totalCount === 0) return '';
    return `${pointerRef.current + 1}/${state.totalCount}`;
  }, [state.isSearching, state.totalCount]);

  return {
    state,
    flatListRef,
    toggleSearch,
    setSearchText,
    performSearch,
    navigateToUp,
    navigateToDown,
    clearSearch,
    isCurrentMessage,
    getSearchResultText,
  };
};