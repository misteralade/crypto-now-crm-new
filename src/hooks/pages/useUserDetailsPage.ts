import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "@tanstack/react-router";
import {setSelectedUserDetailId, setSelectedUserStatus, clearSelectedUserStatus, clearSelectedUserDetailId} from "../../redux/user.slice";
import {useUserQuery} from "../../queries/user.query";
import {ROUTES} from "../../util/constants.util.ts";
import type { UserStatusVariant } from "../../types/global.types";
import type { AdminUserProfileUpdateRequestType } from "../../schemas/user.schema";

export const useUserDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    userProfile, 
    loadingUserProfile, 
    userProfileSummary,
    loadingUserProfileSummary,
    patchUserStatusMutation, 
    adminResetPasswordMutation, 
    adminUpdateUserProfileMutation 
  } = useUserQuery();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { userId } = useParams({ from: '/dashboard/user/$userId' })
  
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUserDetailId(userId));
    }
  }, [userId, dispatch]);

  const handleNavigateToTransactionHistory = () => {
    if (userId) {
      navigate({ to: `${ROUTES.USER_TRANSACTIONS.replace('$userId', userId)}` })
    }
  }

  const handleUpdateUserStatus = async (status: UserStatusVariant) => {
    if (!userId) return;
    
    dispatch(setSelectedUserDetailId(userId));
    dispatch(setSelectedUserStatus(status));
    
    const response = await patchUserStatusMutation.mutateAsync();
    
    if (response && response.success) {
      dispatch(clearSelectedUserStatus());
      dispatch(clearSelectedUserDetailId());
    }
  }

  const handleResetUserPassword = async () => {
    if (!userId) return;
    
    dispatch(setSelectedUserDetailId(userId));
    const response = await adminResetPasswordMutation.mutateAsync();
    
    if (response && response.success) {
      dispatch(clearSelectedUserDetailId());
    }
  }

  const openEditModal = () => {
    setIsEditModalOpen(true);
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  }

  const handleUpdateUserProfile = async (values: Omit<AdminUserProfileUpdateRequestType, 'id'>) => {
    if (!userId) return;
    
    dispatch(setSelectedUserDetailId(userId));
    const response = await adminUpdateUserProfileMutation.mutateAsync(values);
    
    if (response && response.success) {
      dispatch(clearSelectedUserDetailId());
      closeEditModal();
    }
  }

  const getEditModalInitialValues = () => {
    const profile = userProfileSummary?.user?.profile || userProfile?.profile;
    return {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || null,
      dob: profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null,
    }
  }

  return {
    // 🧩 Values
    userId,
    userProfile,
    loadingUserProfile,
    userProfileSummary,
    loadingUserProfileSummary,
    isEditModalOpen,
    isUpdatingProfile: adminUpdateUserProfileMutation.isPending,
    editModalInitialValues: getEditModalInitialValues(),

    // ⚙️ Functions
    handleNavigateToTransactionHistory,
    handleUpdateUserStatus,
    handleResetUserPassword,
    openEditModal,
    closeEditModal,
    handleUpdateUserProfile,
  };
};
