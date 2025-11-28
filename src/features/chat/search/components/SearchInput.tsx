import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export const SearchInput = ({ value, onChangeText, placeholder }: SearchInputProps) => {
  return (
    <SearchContainer>
      <Icon type="search" size={24} color={theme.colors.primary.white} />
      <SearchInputText
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#616262"
      />
      {value && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <AntDesign name="closecircle" size={23} color="#CCCFD0" style={{ marginRight: 8 }} />
        </TouchableOpacity>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.View`
  width: 85%;
  height: 45px;
  background-color: #353637;
  flex-direction: row;
  margin-left: 10px;
  align-items: center;
  justify-content: center;
  padding: 0px 3px;
  border-radius: 8px;
`;

const SearchInputText = styled.TextInput`
  background-color: #353637;
  height: 45px;
  flex: 1;
  padding-left: 10px;
  color: #ffffff;
  font-size: 14px;
  font-family: PlusJakartaSans_400Regular;
`;
