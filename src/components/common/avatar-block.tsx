import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as BoringAvatar from 'boring-avatars';

export default function AvatarBlock({
  id,
  customSrc,
  className,
}: {
  id: string | number;
  customSrc?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={className ?? 'w-8 h-8'}>
      <AvatarImage src={customSrc || ''} />
      <AvatarFallback className="rounded-lg">
        <BoringAvatar.default name={id as any} />
      </AvatarFallback>
      {/*<AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>*/}
    </Avatar>
  );
}
