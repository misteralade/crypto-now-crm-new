import type { BaseApiResponse } from "./response.payload.types";
import type {
  KycSessionStep,
  KycVerificationResult,
  KycNinBvnType,
  KycIdType,
} from "./kyc.types";

export type {
  KycSessionStep,
  KycVerificationResult,
  KycNinBvnType,
  KycIdType,
} from "./kyc.types";
export type AdminKycSessionPayload = {
  id: string;
  userId: string;
  currentStep: KycSessionStep;
  selectedIdType: KycIdType | null;
  hasSelectedIdType: boolean;
  hasCompletedFrontUpload: boolean;
  hasCompletedBackUpload: boolean;
  hasCompletedSelfieCapture: boolean;
  hasSubmitted: boolean;
  hasCompletedDocumentVerification: boolean;
  hasCompletedFaceMatching: boolean;
  documentVerificationStatus: KycVerificationResult;
  faceMatchStatus: KycVerificationResult;
  ninBvnType: KycNinBvnType | null;
  ninBvnMasked: string | null;
  failureReason: string | null;
  retryCount: number;
  maxRetries: number;
  submittedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
};

export type AdminKycSessionMediaPayload = {
  documentFrontUrl: string | null;
  documentBackUrl: string | null;
  selfieUrl: string | null;
};

export type AdminKycSessionListPayload = {
  sessions: AdminKycSessionPayload[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetAdminKycSessionsApiResponse =
  BaseApiResponse<AdminKycSessionListPayload>;
export type GetAdminKycSessionDetailApiResponse =
  BaseApiResponse<AdminKycSessionPayload>;
export type GetAdminKycSessionMediaApiResponse =
  BaseApiResponse<AdminKycSessionMediaPayload>;
export type AdminKycActionApiResponse =
  BaseApiResponse<AdminKycSessionPayload | null>;
