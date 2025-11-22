import styled from 'styled-components/native';

// Container
export const Container = styled.View`
  flex: 1;
  background-color: #1d1e1f;
`;

// Header Styles
export const HeaderBackgroundContainer = styled.View`
  flex: 1.2;
`;

export const HeaderBackground = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const HeaderBackButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 16px;
  z-index: 10;
`;

export const HeaderProfileBox = styled.View`
  width: 150px;
  height: 150px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// Detail Container
export const DetailContainer = styled.View`
  flex: 2;
`;

// Info Section (Top Container)
export const InfoContainer = styled.View`
  flex: 1.7;
  margin-left: 10px;
`;

export const InfoTitleContainer = styled.View`
  height: 25%;
  justify-content: center;
`;

export const InfoTitleText = styled.Text`
  font-family: PlusJakartaSans_600SemiBold;
  color: #ffffff;
  font-size: 24px;
  margin-left: 10px;
`;

export const InfoMembersTextContainer = styled.View`
  height: 20%;
  justify-content: center;
`;

export const InfoMembersText = styled.Text`
  margin-left: 10px;
  font-family: PlusJakartaSans_500Medium;
  font-size: 13px;
  color: #848687;
`;

// Host Info Styles
export const HostContainer = styled.View`
  height: 30%;
  flex-direction: row;
  align-items: center;
`;

export const HostImageBox = styled.View`
  border-radius: 50px;
  width: 50px;
  height: 50px;
  overflow: hidden;
`;

export const HostNameText = styled.Text`
  font-size: 15px;
  margin-left: 12px;
  font-family: PlusJakartaSans_500Medium;
  color: #ffffff;
`;

export const HostBadgeBox = styled.View`
  background-color: #02f59b40;
  margin-left: 15px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;

export const HostBadgeText = styled.Text`
  font-family: PlusJakartaSans_500Medium;
  color: #ffffff;
  padding: 6px 5px 6px 5px;
  font-size: 11px;
`;

// Participants Info Styles
export const ParticipantsContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const ParticipantsCountContainer = styled.View`
  margin-left: 10px;
  width: 30%;
  align-items: center;
  flex-direction: row;
`;

export const ParticipantsCountText = styled.Text`
  margin-left: 3px;
  color: #949899;
  font-family: PlusJakartaSans_600SemiBold;
  font-size: 11px;
`;

export const ParticipantsDivider = styled.View`
  height: 12px;
  width: 1px;
  background-color: #616262;
  margin-left: 11px;
`;

export const ParticipantsImageContainer = styled.View`
  width: 50%;
  flex-direction: row;
  align-items: center;
`;

export const ParticipantsImagesBox = styled.View`
  height: 30px;
  flex-direction: row;
  overflow: hidden;
  border-radius: 50px;
`;

export const ParticipantsImageBox = styled.View`
  width: 30px;
  height: 30px;
  flex-direction: row;
`;

export const ParticipantsTotalText = styled.Text`
  color: #cccfd0;
  font-size: 11px;
  font-family: PlusJakartaSans_600SemiBold;
  margin-left: 5px;
`;

// Divider
export const SectionDivider = styled.View`
  height: 4px;
  background-color: #353637;
  margin: 10px 0px;
`;

// Description Section (Bottom Container)
export const DescriptionContainer = styled.View`
  flex: 2;
  margin-left: 10px;
`;

export const DescriptionTitleContainer = styled.View`
  height: 40px;
  justify-content: center;
`;

export const DescriptionTitleText = styled.Text`
  color: #848687;
  font-family: PlusJakartaSans_500Medium;
  font-size: 13px;
`;

export const DescriptionContentContainer = styled.View`
  height: 100%;
`;

export const DescriptionContentText = styled.Text`
  color: #ffffff;
  font-family: PlusJakartaSans_300Light;
  font-size: 15px;
`;

// Join Button Styles
export const JoinButton = styled.TouchableOpacity`
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: #02f59b;
  margin: 10px;
`;

export const JoinButtonText = styled.Text`
  color: #1d1e1f;
  font-size: 15px;
  font-weight: 500;
  font-family: 'PlusJakartaSans-Medium';
`;

export const BottomSpacer = styled.View`
  height: 25px;
`;
