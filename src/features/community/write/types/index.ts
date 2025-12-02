import { AllowedCategory, AllowedClientCategory } from '../../post/types';

export interface CategoryBottomSheetProps {
  visible: boolean;
  selectedCategory: AllowedClientCategory;
  onSelect: (category: AllowedClientCategory) => void;
  onClose: () => void;
  disabled?: boolean;
}

export interface UseWriteFormProps {
  isEdit?: boolean;
  postId?: number;
  initialCategory?: AllowedClientCategory;
  initialContent?: string;
  initialImages?: string[];
  initialAnonymous?: boolean;
}

// 게시글 수정 초기 데이터타입
export interface InitialEditData {
  boardCategory: AllowedCategory;
  content: string;
  contentImageUrls?: string[];
  isAnonymous: boolean;
}

// 게시글 수정
export type UpdatePostBody = {
  content: string;
  images?: string[];
  removedImages?: string[];
};

// 이미지 업로드 관련 타입
export type ImageType = 'POST' | 'COMMENT';

export type PresignRequest = {
  imageType: ImageType;
  uploadSessionId: string;
  files: {
    filename: string;
    contentType: string;
  }[];
};

export type PresignedUrlItem = {
  key: string;
  putUrl: string;
  method: string;
  headers: Record<string, string>;
};

// 게시판 작성 옵션
export type BoardWriteOptions = {
  boardId: number;
  anonymousWritable: boolean;
};

// 이미지 업로드 관련 타입
export interface ImageAsset {
  uri: string;
  type?: string; // 'image/jpeg', 'image/png' 등
  name?: string; // 파일명
}
