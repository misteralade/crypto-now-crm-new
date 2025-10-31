import type { CreateBankAccountRequestType } from "../../schemas/bank.schema";
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