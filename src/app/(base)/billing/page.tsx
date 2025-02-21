import { auth } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await auth();
  if (!user) {
    return redirect('/');
  }
  // const { username } = await params;
  // const user = await getUserByUsername(username); // get current user
  // if (!user) {
  //   return null;
  // }
  return <div className="main">Billing</div>;
}
