import React, { useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

interface ImageProps extends React.HTMLProps<HTMLImageElement> {
  width?: number;
  height?: number;
  skeleton?: boolean;
  skeletonClassName?: string;
  inline?: boolean;
}

const ImageSkeleton = (props: ImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const {
    skeleton = true,
    skeletonClassName = '',
    className = '',
    width = '',
    height = '',
    style = {},
    onClick,
    inline,
    ...imageProps
  } = props;

  const imageClass = imageLoaded
    ? inline
      ? 'inline-block'
      : 'block'
    : 'hidden';

  if (error || !props.src)
    return (
      <div
        onClick={onClick}
        style={{ width, height }}
        className="flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <ImageIcon className="text-muted-foreground h-6 w-6" />
        <p className="text-muted-foreground text-xs">
          Preview is not ready yet
        </p>
      </div>
    );

  return (
    <>
      <img
        ref={imageRef}
        {...imageProps}
        alt={imageProps.alt}
        onClick={onClick}
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
        className={`${skeleton ? imageClass : ''} ${className}`}
        style={{ width, height, ...style }}
      />

      {skeleton && !imageLoaded && !error && (
        <Skeleton
          className={`animate-pulse ${skeletonClassName}`}
          onClick={onClick}
          style={{ width, height }}
        />
      )}
    </>
  );
};

export default ImageSkeleton;
