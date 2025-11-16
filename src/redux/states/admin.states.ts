import type {
  CreateNewAdminRequestType,
  CreateNewRoleRequestType,
  SearchAdminRequestType
} from "../../schemas/admin.schema";

export const createNewRoleInitialState: CreateNewRoleRequestType = {
  description: undefined,
  name: "",
  permissionIds: []
}

export const createNewAdminInitialState: CreateNewAdminRequestType = {
  active: true,
  email: "",
  firstName: "",
  lastName: "",
  roleId: "",
  username: ""
}

export const searchAdminInitialState: SearchAdminRequestType = {
  active: undefined,
  createdAt: undefined,
  createdAtFrom: undefined,
  createdAtTo: undefined,
  email: undefined,
  firstName: undefined,
  id: undefined,
  lastName: undefined,
  roleId: undefined,
  searchField: undefined,
  searchQuery: undefined,
  updatedAt: undefined,
  username: undefined,

  // Relations
  includeRole: true,

  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
}
