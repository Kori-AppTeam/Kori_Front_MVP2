//채팅방 검색 화면
import Icon from '@/components/common/Icon';
import { MyChatList } from '@/src/features/chat/list/components/MyChatList';
import { SearchInput } from '@/src/features/chat/search/components/SearchInput';
import { useSearchGroupChatRooms } from '@/src/features/chat/search/hooks/useSearchGroupChatRooms';
import { useSearchMyChatRooms } from '@/src/features/chat/search/hooks/useSearchMyChatRooms';
import { AllSpaceItem } from '@/src/features/linked-space/list/components/AllSpaceItem';
import { theme } from '@/src/styles/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const SearchChatRoom = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const { isGroupChat } = useLocalSearchParams<{ isGroupChat?: string }>();

  // 문자열 → boolean 변환
  const isGroupChatBool = isGroupChat === 'true';

  // 검색 훅 사용
  const { chatRooms: myChatRooms } = useSearchMyChatRooms(searchText);
  const { chatRooms: groupChatRooms } = useSearchGroupChatRooms(searchText);

  return (
    <Safe>
      <StatusBar barStyle="light-content" />
      <Container>
        <Header>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon type="previous" size={24} color={theme.colors.primary.white} />
          </TouchableOpacity>
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={isGroupChatBool ? 'Search linked space' : 'Search my chat'}
          />
        </Header>

        <SearchScreen>
          {searchText &&
            (isGroupChatBool ? (
              <FlatList
                data={groupChatRooms}
                keyExtractor={(item) => item.roomId.toString()}
                renderItem={({ item }) => <AllSpaceItem data={item} />}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                data={myChatRooms}
                keyExtractor={(item) => item.roomId.toString()}
                renderItem={({ item }) => <MyChatList data={item} />}
                showsVerticalScrollIndicator={false}
              />
            ))}
        </SearchScreen>
      </Container>
    </Safe>
  );
};

export default SearchChatRoom;

const Safe = styled.SafeAreaView`
  flex: 1;
  background-color: #1d1e1f;
`;
const Container = styled.View`
  flex: 1;
  padding: 0px 20px;
`;
const Header = styled.View`
  height: 70px;
  flex-direction: row;
  align-items: center;
`;

const SearchScreen = styled.View`
  flex: 1;
`;
