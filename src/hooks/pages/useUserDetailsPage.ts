import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "@tanstack/react-router";
import {setSelectedUserDetailId, setSelectedUserStatus, clearSelectedUserStatus, clearSelectedUserDetailId} from "../../redux/user.slice";
import {useUserQuery} from "../../queries/user.query";
import {ROUTES} from "../../util/constants.util.ts";
import type { UserStatusVariant } from "../../types/global.types";

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
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  
  const { userId } = useParams({ from: '/dashboard/users/$userId' })
  
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUserDetailId(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userProfile?.profile) {
      setEditFirstName(userProfile.profile.firstName || '');
      setEditLastName(userProfile.profile.lastName || '');
    }
  }, [userProfile]);

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
    if (userProfile?.profile) {
      setEditFirstName(userProfile.profile.firstName || '');
      setEditLastName(userProfile.profile.lastName || '');
      setIsEditModalOpen(true);
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  }

  const handleEditFieldChange = (field: 'firstName' | 'lastName', value: string) => {
    if (field === 'firstName') {
      setEditFirstName(value);
    } else {
      setEditLastName(value);
    }
  }

  const handleUpdateUserProfile = async () => {
    if (!userId || !editFirstName.trim() || !editLastName.trim()) return;
    
    dispatch(setSelectedUserDetailId(userId));
    const response = await adminUpdateUserProfileMutation.mutateAsync({
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
    });
    
    if (response && response.success) {
      dispatch(clearSelectedUserDetailId());
      closeEditModal();
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
    editFirstName,
    editLastName,
    isUpdatingProfile: adminUpdateUserProfileMutation.isPending,

    // ⚙️ Functions
    handleNavigateToTransactionHistory,
    handleUpdateUserStatus,
    handleResetUserPassword,
    openEditModal,
    closeEditModal,
    handleEditFieldChange,
    handleUpdateUserProfile,
  };
};
