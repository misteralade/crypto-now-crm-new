import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { KycSessionStep } from '../types/kyc-session.types'

interface KycSessionSliceState {
  list: {
    page: number
    limit: number
    statusFilter: KycSessionStep | undefined
    userIdFilter: string
  }
  detail: {
    selectedSessionId: string | undefined
  }
  escalate: {
    sessionId: string | undefined
    notes: string
  }
  reject: {
    sessionId: string | undefined
    reason: string
  }
  approve: {
    sessionId: string | undefined
  }
}

const initialState: KycSessionSliceState = {
  list: {
    page: 1,
    limit: 20,
    statusFilter: undefined,
    userIdFilter: '',
  },
  detail: {
    selectedSessionId: undefined,
  },
  escalate: {
    sessionId: undefined,
    notes: '',
  },
  reject: {
    sessionId: undefined,
    reason: '',
  },
  approve: {
    sessionId: undefined,
  },
}

const kycSessionSlice = createSlice({
  name: 'kycSession',
  initialState,
  reducers: {
    // List filters
    setKycSessionPage: (state, action: PayloadAction<number>) => {
      state.list.page = action.payload
    },
    setKycSessionStatusFilter: (state, action: PayloadAction<KycSessionStep | undefined>) => {
      state.list.statusFilter = action.payload
      state.list.page = 1
    },
    setKycSessionUserIdFilter: (state, action: PayloadAction<string>) => {
      state.list.userIdFilter = action.payload
      state.list.page = 1
    },

    // Detail
    setSelectedKycSessionId: (state, action: PayloadAction<string>) => {
      state.detail.selectedSessionId = action.payload
    },
    clearSelectedKycSessionId: (state) => {
      state.detail.selectedSessionId = undefined
    },

    // Escalate
    setEscalateSessionId: (state, action: PayloadAction<string>) => {
      state.escalate.sessionId = action.payload
      state.escalate.notes = ''
    },
    setEscalateNotes: (state, action: PayloadAction<string>) => {
      state.escalate.notes = action.payload
    },
    clearEscalate: (state) => {
      state.escalate.sessionId = undefined
      state.escalate.notes = ''
    },

    // Reject
    setRejectSessionId: (state, action: PayloadAction<string>) => {
      state.reject.sessionId = action.payload
      state.reject.reason = ''
    },
    setRejectReason: (state, action: PayloadAction<string>) => {
      state.reject.reason = action.payload
    },
    clearReject: (state) => {
      state.reject.sessionId = undefined
      state.reject.reason = ''
    },

    // Approve
    setApproveSessionId: (state, action: PayloadAction<string>) => {
      state.approve.sessionId = action.payload
    },
    clearApprove: (state) => {
      state.approve.sessionId = undefined
    },
  },
})

export const {
  setKycSessionPage,
  setKycSessionStatusFilter,
  setKycSessionUserIdFilter,
  setSelectedKycSessionId,
  clearSelectedKycSessionId,
  setEscalateSessionId,
  setEscalateNotes,
  clearEscalate,
  setRejectSessionId,
  setRejectReason,
  clearReject,
  setApproveSessionId,
  clearApprove,
} = kycSessionSlice.actions

export default kycSessionSlice.reducer
