'use server';

import { cookies } from 'next/headers';

export async function setCookies(data: any) {
  const cookieStore = await cookies();

  cookieStore.set(data);
  // // or
  // cookieStore.set('name', 'lee', { secure: true })
  // // or
  // cookieStore.set({
  //   name: 'name',
  //   value: 'lee',
  //   httpOnly: true,
  //   path: '/',
  // })
}
