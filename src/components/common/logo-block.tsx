import Link from 'next/link';

export default function LogoBlock({ size = 32 }: { size?: number }) {
  return (
    <div>
      <Link
        href="/"
        className="flex w-fit items-center text-sm font-medium hover:opacity-80"
      >
        <svg
          className="mr-2 fill-black dark:fill-white"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="#000000"
        >
          <rect x="1" y="1" width="32" height="32" rx="0" />
          <text
            x="27"
            className="roboto-font fill-white dark:fill-black"
            y="27"
            fill="white"
            textAnchor="end"
            fontSize="10"
            fontWeight="800"
            fontFamily="Roboto"
          >
            JIT
          </text>
        </svg>
        {/*<p className="font-bold">JIT</p>*/}
      </Link>
    </div>
  );
}
