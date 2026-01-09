import styled from 'styled-components/native';

interface CarouselIndicatorProps {
  total: number;
  current: number;
}

const CarouselIndicator = ({ total, current }: CarouselIndicatorProps) => (
  <IndicatorContainer>
    {Array.from({ length: total }).map((_, idx) => (
      <Dots key={idx} isSelected={idx === current} />
    ))}
  </IndicatorContainer>
);

export default CarouselIndicator;

const IndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
`;

const Dots = styled.View<{ isSelected: boolean }>`
  width: ${({ isSelected }) => (isSelected ? '12px' : '5px')};
  height: 5px;
  border-radius: 4px;
  margin: 0 2px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary.mint : theme.colors.gray.darkGray_2};
`;
