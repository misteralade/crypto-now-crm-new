import {useDisputeQuery} from "../../queries/dispute.querries.ts";
import {useNavigate} from "@tanstack/react-router";
import {ROUTES} from "../../util/constants.ts";
import {useDispatch} from "react-redux";
import {setManageDisputeTransactionId, setManageSearchDisputeField} from "../../redux/dispute.slice.ts";
import {useState} from "react";
import {type RootState, store} from "../../store.ts";

export const useDisputesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchDispute, loadingSearchDispute } = useDisputeQuery();
  
  const [showTransactionDrawer, setShowTransactionDrawer] = useState(false);
  
  const handleViewDisputeDetails = (disputeId: string) => {
    navigate({ to: `${ROUTES.DISPUTES}/${disputeId}` })
  }
  
  const handleShowTransactionDetails = (transactionId: string) => {
    dispatch(setManageDisputeTransactionId(transactionId));
    toggleTransactionDetailsDrawer();
  }
  
  const handleNavigateToTransactionPage = (transactionId: string) => {
    navigate({ to: `${ROUTES.TRANSACTIONS}/${transactionId}` })
  }
  
  const handleSortByField = (columnKey: string) => {
    const sortModel = (store.getState() as RootState).transactionManagement.search.transactions.sortModel;
    dispatch(setManageSearchDisputeField({
      field: "sortModel",
      value: {
        colId: columnKey,
        orderBy: sortModel && sortModel.colId === columnKey && sortModel.orderBy === 'ASC' ? 'DESC' : 'ASC',
      }
    }))
  }
  
  const toggleTransactionDetailsDrawer = () => setShowTransactionDrawer(!showTransactionDrawer);
  
  return {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    showTransactionDrawer,
    
    // ⚙️ Functions
    handleViewDisputeDetails,
    handleShowTransactionDetails,
    handleNavigateToTransactionPage,
    toggleTransactionDetailsDrawer,
    handleSortByField,
  };
}