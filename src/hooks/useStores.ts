import { useContext } from 'react';
import { StoreContext } from '@/lib/providers/store-provider';

export const useStores = () => {
  return useContext(StoreContext);
};
