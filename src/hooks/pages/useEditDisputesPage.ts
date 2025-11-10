import {useParams} from "@tanstack/react-router";
import {useEffect} from "react";
import {setEditDisputeId} from "../../redux/dispute.slice.ts";
import {useDispatch} from "react-redux";

export const useEditDisputesPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams({ from: '/dashboard/disputes/edit/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setEditDisputeId(id))
    }
  }, [id, dispatch]);
  
  return {
  
  }
}