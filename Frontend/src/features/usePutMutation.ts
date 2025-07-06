import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface usePutMutationProps{
    entity: string;
    key: unknown[];
    onSuccessFn?: ()=>void;
}

export const usePutMutation= ({ entity, key, onSuccessFn }:usePutMutationProps) =>{
    const queryClient=useQueryClient();

    return useMutation({
        mutationFn: async(data:any) => {
            const { id,...body } = data;
            const res = await axios.put(`http://localhost:5095/api/${entity}/${id}`, body);
            return res.data;
        },
        onSuccess: () => {
            alert('Updated successfully');
            queryClient.invalidateQueries({ queryKey: key });
            if (onSuccessFn) onSuccessFn();
        },
        onError: (error: any) => {
            const res = error?.response?.data;
            if (typeof res === 'string') {
                alert(res);
            } else if (res?.errors) {
                alert(res.errors.MaxSalary[0]);
            } else {
                alert('Something went wrong');
            }
        }
    })
};