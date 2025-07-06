import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UsePostMutationProps {
  entity: string;
  key: unknown[];
  onSuccessFn?: () => void; // Let parent handle reset or UI update
}

export const usePostMutation = ({ entity, key, onSuccessFn }: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        minSalary: data.minSalary.toString(),
        maxSalary: data.maxSalary.toString(),
      };
      const res = await axios.post(`http://localhost:5095/api/${entity}`, payload);
      return res.data;
    },
    onSuccess: () => {
      alert('Job request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: key });
      if (onSuccessFn) onSuccessFn(); // Let component reset form
    },
    onError: (error: any) => {
      const res = error?.response?.data;
      if (typeof res === 'string') {
        alert(res);
      } else if (res?.errors?.MaxSalary?.[0]) {
        alert(res.errors.MaxSalary[0]);
      } else {
        alert('Something went wrong');
      }
    },
  });
};
