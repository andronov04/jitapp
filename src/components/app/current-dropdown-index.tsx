'use client';
import { observer } from 'mobx-react-lite';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { toast } from 'sonner';
import { useStores } from '@/hooks/useStores';
import AvatarBlock from '@/components/common/avatar-block';
import { isAdmin } from '@/lib/utils';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const CurrentUserDropdown = observer(() => {
  const { app } = useStores();
  const router = useRouter();
  if (!app.currentUser) {
    return <div></div>;
  }

  const handleLogout = async () => {
    const resp = await createSupabaseBrowser().auth.signOut();
    if (resp.error) {
      toast.error(resp.error.message);
    } else {
      router.refresh();
    }
  };
  return (
    <div className="h-6 w-6">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AvatarBlock
            customSrc={app.currentUser.avatar ?? undefined}
            className="h-6 w-6 rounded-full"
            id={app.currentUser?.id}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 bg-background shadow-none">
          <DropdownMenuLabel>{app.currentUser.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              className="w-full hover:underline"
              href={`/@${app.currentUser.username}`}
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="w-full hover:underline" href={`/settings`}>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="w-full hover:underline" href={`/billing`}>
              Billing
            </Link>
          </DropdownMenuItem>
          {isAdmin(app.currentUser?.email ?? '') && (
            <DropdownMenuItem>
              <Link className="w-full hover:underline" href={`/admin`}>
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="w-full cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export default CurrentUserDropdown;
