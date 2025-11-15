import {useNavigate, useParams} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {
  clearEditDisputeStatusModalNote, clearEditDisputeStatusModalResolution, clearEditDisputeStatusModalStatus,
  setEditDisputeId,
  setEditDisputeStatusModalNote, setEditDisputeStatusModalResolution, setEditDisputeStatusModalStatus,
  setEditDisputeTransactionId
} from "../../redux/dispute.slice.ts";
import {useDispatch} from "react-redux";
import {useDisputeQuery} from "../../queries/dispute.querries.ts";
import {ROUTES} from "../../util/constants.util.ts";
import type {DisputeResolution, DisputeStatus} from "../../types/dispute.types.ts";

export const useEditDisputesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    editDisputeDetails,
    loadingEditDisputeDetails,
    transactionDetails,
    loadingTransactionDetails,
    
    // Mutation
    updateDisputeStatusMutation,
  } = useDisputeQuery()
  
  const [statusNotes, setStatusNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedDisputeStatus, setSelectedDisputeStatus] = useState<DisputeStatus>();
  const [selectedResolution, setSelectedResolution] = useState<DisputeResolution>();
  
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false)
  
  const { id } = useParams({ from: '/dashboard/disputes/edit/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setEditDisputeId(id))
    }
  }, [id, dispatch]);
  
  const goBack = () => {
    navigate({ to: ROUTES.DISPUTES });
  }
  
  const updateAdminNotes = (notes: string) => {
    setAdminNotes(notes);
  }
  
  const updateStatusNotes = (notes: string) => {
    setStatusNotes(notes);
  }
  
  const handleUpdateStatusNotes = () => {
    // Implement the logic to update status notes here
  }
  
  const dispatchDisputeTransactionId = (transactionId: string) => {
    dispatch(setEditDisputeTransactionId(transactionId))
  }
  
  const handleOpenStatusUpdateModal = (status: DisputeStatus) => {
    setSelectedDisputeStatus(status);
    setStatusNotes("")
    toggleShowStatusUpdateModal()
  }
  
  const handleSelectedResolution = (resolution: DisputeResolution) => {
    setSelectedResolution(resolution);
  }
  
  // Update toggles
  const toggleEditDisputeNotes = async () => setIsEditingNotes(!isEditingNotes);
  
  const toggleUpdating = () => setIsUpdating(!isUpdating);
  
  const toggleShowStatusUpdateModal = () => setShowStatusUpdateModal(!showStatusUpdateModal);
  
  // Executions
  const handleUpdateStatus = async () => {
    dispatch(setEditDisputeStatusModalNote(statusNotes));
    dispatch(setEditDisputeStatusModalStatus(selectedDisputeStatus));
    dispatch(setEditDisputeStatusModalResolution(selectedResolution));
    
    const { success } = await updateDisputeStatusMutation.mutateAsync();
    if (success) {
      dispatch(clearEditDisputeStatusModalNote())
      dispatch(clearEditDisputeStatusModalStatus())
      dispatch(clearEditDisputeStatusModalResolution())
      toggleShowStatusUpdateModal()
      
      setTimeout(() => {
        navigate({ to: ROUTES.DISPUTES })
      }, 5000)
    }
  }
  
  return {
    // 🧩 Values
    disputeDetails: editDisputeDetails,
    loadingDisputeDetails: loadingEditDisputeDetails,
    transactionDetails,
    loadingTransactionDetails,
    isEditingNotes,
    isUpdating,
    adminNotes,
    statusNotes,
    selectedDisputeStatus,
    showStatusUpdateModal,
    selectedResolution,
    
    // ⚙️ Functions
    goBack,
    toggleEditDisputeNotes,
    toggleUpdating,
    updateAdminNotes,
    updateStatusNotes,
    handleUpdateStatusNotes,
    dispatchDisputeTransactionId,
    handleOpenStatusUpdateModal,
    toggleShowStatusUpdateModal,
    handleUpdateStatus,
    handleSelectedResolution,
  }
}
