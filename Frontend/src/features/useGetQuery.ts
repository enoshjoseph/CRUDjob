import { useQuery, type UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";

const fetchJobs = async <T>(page:number,pageSize:number): Promise<T> =>{
    const res= await axios.get<T>(
        `http://localhost:5095/api/JobRequest?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
};

export const useGetQuery = <T>(
    key: string|unknown[],
    page: number,
    pageSize: number,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
    ) =>{
    return useQuery<T,Error>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: () =>fetchJobs<T>(page,pageSize),
        ...options
    })
};