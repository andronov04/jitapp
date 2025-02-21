import { getUserByUsername } from '@/lib/actions/user';
import AvatarBlock from '@/components/common/avatar-block';

export default async function User({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  return (
    <div className="main">
      <div className="flex w-full items-start gap-14 justify-start">
        <div className="flex flex-col gap-4 items-start justify-center">
          <AvatarBlock
            className="w-32 h-32"
            id={user.id}
            customSrc={user.avatar}
          />
          <h1 className="text-muted-foreground">@{user.username}</h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl">Feed</p>
        </div>
      </div>
    </div>
  );
}
