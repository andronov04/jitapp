export default function SymbolBlock({
  symbol,
  fill = '#000',
}: { symbol: string; fill?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 32 32"
      fill={fill}
    >
      <rect x="1" y="1" width="32" height="32" rx="0" />

      <text
        x="28"
        y="28"
        style={{ fontSize: '10px', fontWeight: '700' }}
        className="roboto-font"
        fill="black"
        textAnchor="end"
        fontSize="10"
        fontWeight="700"
        fontFamily="Roboto"
      >
        {symbol.toUpperCase()}
      </text>
    </svg>
    // <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    //   <rect x="1" y="1" width="30" height="30" rx="5" stroke={fill} strokeWidth="2" />
    //
    //   <text
    //     x="27"
    //     y="27"
    //     className="roboto-font"
    //     fill={fill}
    //     textAnchor="end"
    //     fontSize="10"
    //     fontWeight="800"
    //     fontFamily="Roboto"
    //   >
    //     {symbol.toUpperCase()}
    //   </text>
    // </svg>
  );
}
