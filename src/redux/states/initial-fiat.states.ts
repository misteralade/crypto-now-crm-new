import type {AdminSearchSupportedBankRequestType, CreateBankAccountRequestType} from "../../schemas/bank.schema";
import type { EditPlatformExchangeRateRequestType } from "../../schemas/rate.schema";

export const createAdminBankInitialState: CreateBankAccountRequestType = {
  accountHolderName: "",
  accountNumber: "",
  accountType: "BOTH",
  bankId: "",
  instructions: undefined,
  isActive: false,
  isDefault: false,
  label: undefined
}

export const editExchangeRateInitialState: EditPlatformExchangeRateRequestType = {
  buyRate: undefined,
  sellRate: undefined,
}

export const searchSupportedBankInitialState: AdminSearchSupportedBankRequestType = {
  createdBy: undefined,
  // Common Search Fields
  id: undefined,
  searchField: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  createdAtFrom: undefined,
  createdAtTo: undefined,
  
  // Specific Search Fields
  accountNumber: undefined,
  accountHolderName: undefined,
  isActive: true,
  isDeleted: false,
  isDefault: undefined,
  
  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
}
