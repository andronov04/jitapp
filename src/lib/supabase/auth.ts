import { IUser } from '@/types/user';
import {createSupabaseServer} from "@/lib/supabase/server";

export const auth = async (): Promise<IUser | undefined> => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (data?.user) {
    return {
      ...data.user,
      username: "user", // TODO add full from bd, with cache
    } as unknown as IUser;
  }
};
