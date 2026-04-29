interface TradeoffListProps {
  pros?: string[];
  cons?: string[];
}

export default function TradeoffList({ pros, cons }: TradeoffListProps) {
  if ((!pros || pros.length === 0) && (!cons || cons.length === 0)) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:gap-8">
      {pros && pros.length > 0 && (
        <ul className="tradeoff-list tradeoff-list-pro space-y-2 text-sm leading-relaxed text-(--text-secondary)">
          {pros.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {cons && cons.length > 0 && (
        <ul className="tradeoff-list tradeoff-list-con space-y-2 text-sm leading-relaxed text-(--text-secondary)">
          {cons.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
