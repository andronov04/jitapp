import { redirect } from 'next/navigation';
import {createSupabaseBrowser} from "@/lib/supabase/client";

export default async function PrivatePage() {
  const supabase = createSupabaseBrowser();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return <p>Hello {data.user.email}</p>;
}
