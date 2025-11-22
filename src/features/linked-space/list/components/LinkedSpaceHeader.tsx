import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import { LinkedSpace } from '../types';
import { BuzzingSpaceItem } from './BuzzingSpaceItem';

export const LinkedSpaceHeader = ({ buzzingSpaces }: { buzzingSpaces: LinkedSpace[] }) => (
  <View>
    <GroupTitleContainer>
      <GroupTitleText>Buzzing Spaces</GroupTitleText>
    </GroupTitleContainer>

    <BuzzingContainer>
      <FlatList
        data={buzzingSpaces}
        renderItem={({ item }) => <BuzzingSpaceItem data={item} />}
        keyExtractor={(item) => item.roomId.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </BuzzingContainer>

    <GroupTitleContainer>
      <GroupTitleText>All Spaces</GroupTitleText>
    </GroupTitleContainer>
  </View>
);

const GroupTitleContainer = styled.View`
  justify-content: center;
  height: 70px;
`;

const GroupTitleText = styled.Text`
  font-family: PlusJakartaSans_700Bold;
  font-size: 18px;
  color: #ffffff;
`;

const BuzzingContainer = styled.View`
  height: 236px;
`;
