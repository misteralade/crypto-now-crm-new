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
    adminSendDisputeMutation,
    goBack,
  }
}