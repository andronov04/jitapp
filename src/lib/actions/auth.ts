'use server';
import { IUser } from '@/types/user';
import { createSupabaseServer } from '@/lib/supabase/server';
import prisma from '@/prisma';

export const auth = async (): Promise<IUser | undefined> => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  const iuser = await prisma.iuser.findFirst({
    where: {
      id: data?.user?.id,
    },
  });
  if (data?.user) {
    return {
      ...data.user,
      ...(iuser ?? {}),
    } as unknown as IUser;
  }
};
