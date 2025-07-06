import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseDeleteMutationProps{
    entity:string;
    key: unknown[];
    onSuccessFn: ()=>void;
}

const deleteJob = async (entity:string,jobId: number) => {
    await axios.delete(`http://localhost:5095/api/${entity}/${jobId}`);
};

export const useDeleteMutation=({entity, key, onSuccessFn}:UseDeleteMutationProps)=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id:number)=>deleteJob(entity,id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:key});
            onSuccessFn();
        }
    });
};