import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "@tanstack/react-router";
import {useDisputeQuery} from "../../queries/dispute.querries.ts";
import {setDisputeDetailsId} from "../../redux/dispute.slice.ts";
import {ROUTES} from "../../util/constants.util.ts";

export const useDisputeDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { disputeMessages, loadingDisputeMessages, disputeDetails, loadingDisputeDetails, adminSendDisputeMutation } = useDisputeQuery();
  
  const { id } = useParams({ from: '/dashboard/disputes/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setDisputeDetailsId(id))
    }
  }, [id, dispatch]);
  
  const getDisputeStatusColor = (status: | 'OPEN' | 'UNDER_REVIEW' | 'AWAITING_EVIDENCE' | 'AWAITING_USER_RESPONSE' | 'AWAITING_ADMIN_RESPONSE' | 'ESCALATED' | 'RESOLVED' | 'REJECTED' | 'CLOSED' ): string => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AWAITING_EVIDENCE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'AWAITING_USER_RESPONSE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'AWAITING_ADMIN_RESPONSE':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'ESCALATED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CLOSED':
        return 'bg-gray-50 text-gray-600 border-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const goBack = () => {
    navigate({ to: ROUTES.DISPUTES });
  }
  
  return {
    // 🧩 Values
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    
    // ⚙️ Functions
    getDisputeStatusColor,
    adminSendDisputeMutation,
    goBack,
  }
}