import type { CreateCurrencyRequestType, UpdateCurrencyRequestType } from "../../schemas/currency.schema";

export const createCurrencyInitialState: CreateCurrencyRequestType = {
  name: '',
  code: '',
  description: undefined,
  isActive: true,
  logoUrl: '',
  additionalInfo: undefined,
};

export const updateCurrencyInitialState: UpdateCurrencyRequestType = {
  name: undefined,
  code: undefined,
  description: undefined,
  isActive: undefined,
  logoUrl: undefined,
  additionalInfo: undefined,
};
