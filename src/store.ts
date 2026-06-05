import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storageSession from 'redux-persist/lib/storage/session'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import dashboardSlice from './redux/dashboard.slice'
import coinManagementSlice from './redux/coin-management.slice'
import transactionManagementSlice from './redux/transaction-management.slice'
import userSlice from './redux/user.slice'
import fiatSlice from './redux/fiat.slice'
import auditLogSlice from './redux/audit-log.slice'
import notificationSlice from './redux/notification.slice';
import adminSlice from './redux/admin.slice';
import disputeSlice from './redux/dispute.slice.ts';
import testimonialSlice from './redux/testimonial.slice';
import kycTierLimitSlice from './redux/kyc-tier-limit.slice';
import currencySlice from './redux/currency.slice';
import kycSessionSlice from './redux/kyc-session.slice';
import { BASIC } from './config/index.config'
// (To persist to localStorage instead: import storage from 'redux-persist/lib/storage')

const rootReducer = combineReducers({
  dashboard: dashboardSlice,
  coinManagement: coinManagementSlice,
  transactionManagement: transactionManagementSlice,
  user: userSlice,
  fiat: fiatSlice,
  auditLog: auditLogSlice,
  notification: notificationSlice,
  admin: adminSlice,
  dispute: disputeSlice,
  testimonial: testimonialSlice,
  kycTierLimit: kycTierLimitSlice,
  currency: currencySlice,
  kycSession: kycSessionSlice,
})

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: [
    'dashboard',
    'coinManagement',
    'user',
    'fiat',
    'auditLog',
    'notification',
    'admin',
    'dispute',
    'testimonial',
    'kycTierLimit',
    'currency',
    'kycSession',
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions — ignore them here
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: BASIC.NODE_ENV !== 'production',
})

// persistor for PersistGate
export const persistor = persistStore(store)

// Types for use throughout the app
export type RootState = ReturnType<typeof rootReducer> // note: use rootReducer type (not persistedReducer)
export type AppDispatch = typeof store.dispatch
