import styled from 'styled-components/native';
import { responsiveWidth, responsiveHeight, normalize } from '../utils/responsive';

export const Container = styled.View`
  flex: 1;
  padding: ${responsiveWidth(4)}px;
  background-color: ${(props) => props.theme.colors.background};
`;

export const Title = styled.Text`
  font-size: ${(props) => normalize(props.theme.fontSizes.large)}px;
  color: ${(props) => props.theme.colors.text};
  font-weight: bold;
`;

export const Subtitle = styled.Text`
  font-size: ${(props) => normalize(props.theme.fontSizes.medium)}px;
  color: ${(props) => props.theme.colors.secondary};
`;
