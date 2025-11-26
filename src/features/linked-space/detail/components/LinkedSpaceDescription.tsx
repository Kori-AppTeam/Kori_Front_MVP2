import React from 'react';
import {
  DescriptionContainer,
  DescriptionContentContainer,
  DescriptionContentText,
  DescriptionTitleContainer,
  DescriptionTitleText,
} from '../styles';

type LinkedSpaceDescriptionProps = {
  description: string;
};

export const LinkedSpaceDescription = ({ description }: LinkedSpaceDescriptionProps) => {
  return (
    <DescriptionContainer>
      <DescriptionTitleContainer>
        <DescriptionTitleText>Space Introduction</DescriptionTitleText>
      </DescriptionTitleContainer>
      <DescriptionContentContainer>
        <DescriptionContentText>{description}</DescriptionContentText>
      </DescriptionContentContainer>
    </DescriptionContainer>
  );
};
