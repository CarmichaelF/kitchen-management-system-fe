import { api } from "@/service/axios";

interface useFetchDataProps{
  path: 'inventory' | 'input' | 'product' | 'pricing';
}

export function useFetchData({path} : useFetchDataProps){
  const getAll = async<T>() => {
    return await api.get<T>(`/${path}`);
  };

  const getByID = async<T>({id} : {id: string}) => {
    return await api.get<T>(`/${path}/${id}`)
  }

  const create = async <T>({data}: {data: T}) => {
    return await api.post(`/${path}`, data);
  };

  const update = async <T>({id, data} : {id: string, data: T}) => {
    return await api.put(`/${path}/${id}`, data);
  };

  const remove = async ({id}: {id: string}) => {
    return await api.delete(`/${path}/${id}`);
  };

  return {
    getAll,
    getByID,
    create,
    update,
    remove,
  };
}