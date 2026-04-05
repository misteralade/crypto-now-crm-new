import type { BaseApiResponse } from "./response.payload.types";

export type KycSessionStep =
  | "Not Started"
  | "submitted"
  | "In Progress"
  | "In Review"
  | "Resubmitted"
  | "Approved"
  | "Declined"
  | "Expired"
  | "Abandoned"
  | "archived";

export type KycVerificationResult =
  | "pending"
  | "approved"
  | "rejected"
  | "error";

export type KycIdType = "national_id" | "drivers_license" | "passport";

export type AdminKycSessionPayload = {
  id: string;
  userId: string;
  currentStep: KycSessionStep;
  selectedIdType: KycIdType | null;
  hasSubmitted: boolean;
  documentVerificationStatus: KycVerificationResult;
  faceMatchStatus: KycVerificationResult;
  ninMasked: string | null;
  ninVerificationAttempts: number;
  ninVerificationAttemptsRemaining: number;
  identityVerificationAttempts: number;
  identityVerificationAttemptsRemaining: number;
  failureReason: string | null;
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
