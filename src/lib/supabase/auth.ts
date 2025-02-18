import { createClient } from '@/lib/supabase/server';
import { IUser } from '@/types/user';

export const auth = async (): Promise<IUser | undefined> => {
  return {
    id: '9f4c4ae6-ac38-478d-a330-6ab6985b6092',
    email: 'test@test.com',
    name: 'Andronov',
    image: 'https://avatars.githubusercontent.com/u/10128486?v=4',
    provider: 'github',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  }; // TODO fix it
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log('auth', error);
  if (data?.user) {
    return data.user as unknown as IUser;
  }
};
