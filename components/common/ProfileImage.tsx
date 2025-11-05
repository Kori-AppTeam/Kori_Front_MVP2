import React, { forwardRef, memo } from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  Image as RNImage,
  ImageProps as RNImageProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { SvgUri } from 'react-native-svg';

type ProfileImageProps = Omit<RNImageProps, 'source'> & {
  /** (선택) 직접 source를 넘길 때 사용. 보통은 imageUrl/isAnonymous/isVisitor로 판단 */
  source?: ImageSourcePropType;
  imageUrl?: string | null;
  isAnonymous?: boolean;
  isVisitor?: boolean;
};

const IMG_ANON = require('@/assets/images/character_04.svg');     // 익명 (SVG)
const IMG_VISITOR = require('@/assets/images/character_05.svg');  // 방문자 (SVG)

function getLocalSvgComponent(source: any) {
  if (source && typeof source === 'object' && typeof source.default === 'function') return source.default;
  if (typeof source === 'function') return source;
  return null;
}

function resolveSvg(source?: ImageSourcePropType): { uri?: string; isSvg: boolean } {
  if (!source) return { isSvg: false };

  if (typeof source === 'number') {
    const res = RNImage.resolveAssetSource(source);
    const uri = res?.uri;
    return { uri, isSvg: !!uri && /\.svg(\?|#|$)/i.test(uri) };
  }

  if (typeof source === 'object' && 'uri' in source && typeof (source as any).uri === 'string') {
    const uri = (source as any).uri as string;
    return { uri, isSvg: /\.svg(\?|#|$)/i.test(uri) };
  }

  return { isSvg: false };
}

function isUsableUrl(u?: string | null): u is string {
  if (typeof u !== 'string') return false;
  const s = u.trim();
  if (!s) return false;
  const low = s.toLowerCase();
  if (low === 'null' || low === 'undefined') return false;
  return /^https?:\/\//.test(s);
}

const ProfileImage = forwardRef<any, ProfileImageProps>(function ProfileImage(
  { source, imageUrl, isAnonymous, isVisitor, style, resizeMode = 'cover', onError, ...rest },
  ref
) {
  const [failed, setFailed] = React.useState(false);

  // ✅ 우선순위: 익명 → 이미지 URL → 방문자 → 명시적 source → 없음
  let policySource: ImageSourcePropType | undefined;

  if (isAnonymous) {
    policySource = IMG_ANON;                        // 1) 무조건 익명 우선
  } else if (!failed && isUsableUrl(imageUrl)) {
    policySource = { uri: imageUrl! };              // 2) 유효한 절대 URL이면 그 이미지
  } else if (isVisitor) {
    policySource = IMG_VISITOR;                     // 3) 방문자(이미지 없음 등)
  } else if (source) {
    policySource = source;                          // 4) 명시적 source
  } else {
    policySource = undefined;                       // 5) 아무 것도 없으면 빈 뷰(공간 유지)
  }

  // 로컬 SVG(컴포넌트)면 직접 렌더
  const LocalSvgComp = getLocalSvgComponent(policySource);
  if (LocalSvgComp) {
    const containerStyle = style as StyleProp<ViewStyle | ImageStyle>;
    return (
      <View style={[{ overflow: 'hidden' }, containerStyle]}>
        <LocalSvgComp width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
    );
  }

  // URL/숫자 에셋 → SVG 여부 판별
  const { uri, isSvg } = resolveSvg(policySource);

  // 원격 SVG면 SvgUri로 렌더
  if (isSvg && uri) {
    const containerStyle = style as StyleProp<ViewStyle | ImageStyle>;
    return (
      <View style={[{ overflow: 'hidden' }, containerStyle]}>
        <SvgUri uri={uri} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
    );
  }

  // 비-SVG는 RN Image
  if (policySource) {
    return (
      <RNImage
        ref={ref}
        source={policySource as ImageSourcePropType}
        style={style}
        resizeMode={resizeMode}
        onError={(e) => {
          if (!isAnonymous && !isVisitor && isUsableUrl(imageUrl)) setFailed(true);
          onError?.(e);
        }}
        {...rest}
      />
    );
  }

  // 소스가 없으면 공간만 유지
  const containerStyle = style as StyleProp<ViewStyle | ImageStyle>;
  return <View style={[{ overflow: 'hidden' }, containerStyle]} />;
});

export default memo(ProfileImage);
