import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import {clearTransactionDetailSessionId, setTransactionDetailSessionId } from "../../redux/transaction-management.slice";
import {useTransactionQuery} from "../../queries/transaction.query.ts";
import {ROUTES} from "../../util/constants.util.ts";

export const useTransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactionInfo, loadingTransactionInfo } = useTransactionQuery();
  
  const { id } = useParams({ from: '/dashboard/transactions/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setTransactionDetailSessionId(id))
    }
  }, [id, dispatch]);
  
  const goBack = () => {
    dispatch(clearTransactionDetailSessionId());
    navigate({to: ROUTES.TRANSACTIONS})
  }
  
  return {
    // 🧩 Values
    transactionInfo,
    loadingTransactionInfo,
    
    
    // ⚙️ Functions
    goBack,
  }
}