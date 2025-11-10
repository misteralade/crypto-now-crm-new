import {useNavigate, useParams} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {setEditDisputeId, setEditDisputeTransactionId} from "../../redux/dispute.slice.ts";
import {useDispatch} from "react-redux";
import {useDisputeQuery} from "../../queries/dispute.querries.ts";
import {ROUTES} from "../../util/constants.util.ts";

export const useEditDisputesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editDisputeDetails, loadingEditDisputeDetails, transactionDetails, loadingTransactionDetails } = useDisputeQuery()
  
  const [statusNotes, setStatusNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
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
  
  const toggleEditDisputeNotes = async () => setIsEditingNotes(!isEditingNotes);
  
  const toggleUpdating = () => setIsUpdating(!isUpdating);
  
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
    
    // ⚙️ Functions
    goBack,
    toggleEditDisputeNotes,
    toggleUpdating,
    updateAdminNotes,
    updateStatusNotes,
    handleUpdateStatusNotes,
    dispatchDisputeTransactionId,
  }
}
