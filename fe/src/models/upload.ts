export interface UploadFileResult {
  url: string;
  key: string;
  provider: string;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data: UploadFileResult;
}

export interface UseAvatarUploadOptions {
  onUploadSuccess?: (uploadRes: UploadFileResult) => Promise<void> | void;

}
