import { Dimensions, Platform, PixelRatio } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  return Platform.OS === 'ios'
    ? Math.round(PixelRatio.roundToNearestPixel(newSize))
    : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const responsiveWidth = (percentage: number) => RFPercentage(percentage);
const responsiveHeight = (percentage: number) => RFPercentage(percentage);

export { normalize, responsiveWidth, responsiveHeight, RFValue };
