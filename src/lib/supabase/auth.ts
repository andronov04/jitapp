import { createClient } from '@/lib/supabase/server';
import { IUser } from '@/types/user';

export const auth = async (): Promise<IUser | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log('auth', error);
  if (data?.user) {
    return data.user as unknown as IUser;
  }
};
