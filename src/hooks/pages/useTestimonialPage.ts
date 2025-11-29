import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  clearCreateTestimonial,
  clearDeleteTestimonialId,
  clearUpdateTestimonial,
  setCreateTestimonialField,
  setDeleteTestimonialId,
  setSearchTestimonialField,
  setUpdateTestimonialField,
  setUpdateTestimonialId,
} from '../../redux/testimonial.slice';
import { useTestimonialQuery } from '../../queries/testimonial.querries';
import type {
  CreateTestimonialRequestType,
  UpdateTestimonialRequestType,
} from '../../schemas/testimonial.schema';

export const useTestimonialPage = () => {
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    testimonials,
    loadingTestimonials,
    createTestimonialMutation,
    updateTestimonialMutation,
    deleteTestimonialMutation,
    togglePublishStatusMutation,
    refetchTestimonials,
  } = useTestimonialQuery();

  // Create Modal Handlers
  const openCreateModal = () => {
    dispatch(clearCreateTestimonial());
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    dispatch(clearCreateTestimonial());
  };

  const handleCreateTestimonialFieldChange = (
    field: keyof CreateTestimonialRequestType,
    value: any
  ) => {
    dispatch(setCreateTestimonialField({ field, value }));
  };

  const handleCreateTestimonial = async () => {
    await createTestimonialMutation.mutateAsync();
    closeCreateModal();
  };

  // Edit Modal Handlers
  const openEditModal = (testimonialId: string, currentData: UpdateTestimonialRequestType) => {
    dispatch(setUpdateTestimonialId(testimonialId));
    
    // Set initial values for the edit form
    Object.entries(currentData).forEach(([key, value]) => {
      if (value !== undefined) {
        dispatch(setUpdateTestimonialField({ 
          field: key as keyof UpdateTestimonialRequestType, 
          value 
        }));
      }
    });
    
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    dispatch(clearUpdateTestimonial());
  };

  const handleUpdateTestimonialFieldChange = (
    field: keyof UpdateTestimonialRequestType,
    value: any
  ) => {
    dispatch(setUpdateTestimonialField({ field, value }));
  };

  const handleUpdateTestimonial = async () => {
    await updateTestimonialMutation.mutateAsync();
    closeEditModal();
  };

  // Delete Modal Handlers
  const openDeleteModal = (testimonialId: string) => {
    dispatch(setDeleteTestimonialId(testimonialId));
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    dispatch(clearDeleteTestimonialId());
  };

  const handleDeleteTestimonial = async () => {
    await deleteTestimonialMutation.mutateAsync();
    closeDeleteModal();
  };

  // Search/Filter Handlers
  const handleSearchFieldChange = (field: string, value: any) => {
    dispatch(setSearchTestimonialField({ field: field as any, value }));
  };

  const handleRefresh = () => {
    refetchTestimonials();
  };

  // Pagination Handlers
  const handlePageChange = (page: number) => {
    dispatch(setSearchTestimonialField({ field: 'page', value: page }));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setSearchTestimonialField({ field: 'size', value: size }));
    dispatch(setSearchTestimonialField({ field: 'page', value: 1 })); // Reset to page 1 when changing size
  };

  // Toggle Publish Status
  const handleTogglePublishStatus = async (id: string) => {
    await togglePublishStatusMutation.mutateAsync({ id });
  };

  return {
    // 🧩 Values
    testimonials,
    loadingTestimonials,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    
    // Mutations
    createTestimonialMutation,
    updateTestimonialMutation,
    deleteTestimonialMutation,
    
    // ⚙️ Functions
    openCreateModal,
    closeCreateModal,
    handleCreateTestimonialFieldChange,
    handleCreateTestimonial,
    
    openEditModal,
    closeEditModal,
    handleUpdateTestimonialFieldChange,
    handleUpdateTestimonial,
    
    openDeleteModal,
    closeDeleteModal,
    handleDeleteTestimonial,
    
    handleSearchFieldChange,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    handleTogglePublishStatus,
  };
};

