import {useDisputeQuery} from "../../queries/dispute.querries.ts";
import {useNavigate} from "@tanstack/react-router";
import {ROUTES, TIME_IN_MILLISECONDS} from "../../util/constants.ts";
import {useDispatch} from "react-redux";
import {
  setManageDisputeTransactionId,
  setManageSearchDispute,
  setManageSearchDisputeField
} from "../../redux/dispute.slice.ts";
import {useMemo, useState} from "react";
import {type RootState, store} from "../../store.ts";
import {searchDisputeInitialState} from "../../redux/states/dispute.states.ts";
import {debounce} from "../../util/debouce.util.ts";

export const useDisputesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchDispute, loadingSearchDispute } = useDisputeQuery();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransactionDrawer, setShowTransactionDrawer] = useState(false);
  
  // Tables
  const [pageSize, setPageSize] = useState(10);
  
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
  
  const handleNavigateToEditDisputePage = (disputeId: string) => {
    navigate({ to: `${ROUTES.DISPUTES}/edit/${disputeId}` })
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
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(setManageSearchDispute({
      ...searchDisputeInitialState,
      size: newPageSize,
    }))
  }
  
  const handlePageChange = (page: number) => {
    dispatch(
      setManageSearchDisputeField({
        field: 'page',
        value: page,
      }),
    )
  }
  
  const handleSearchChange = useMemo(() => {
    const debouncedUpdate = debounce(
      (query: string) => setManageSearchDisputeField({
        field: "searchQuery",
        value: query,
      }),
      TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS
    );
    
    return (query: string) => {
      setSearchQuery(query);
      debouncedUpdate(query);
    };
  }, [dispatch]);
  
  const toggleTransactionDetailsDrawer = () => setShowTransactionDrawer(!showTransactionDrawer);
  
  return {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    showTransactionDrawer,
    pageSize,
    searchQuery,
    
    // ⚙️ Functions
    handleViewDisputeDetails,
    handleShowTransactionDetails,
    handleNavigateToTransactionPage,
    toggleTransactionDetailsDrawer,
    handleSortByField,
    handleNavigateToEditDisputePage,
    handlePageSizeChange,
    handlePageChange,
    handleSearchChange,
  };
}