const CARDS = ['0', '0.5', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '∞'];

export default function CardDeck({ selectedCard, onVote, disabled }) {
  return (
    <div className="card-deck">
      {CARDS.map((value) => (
        <button
          key={value}
          className={`poker-card ${selectedCard === value ? 'poker-card--selected' : ''} ${disabled ? 'poker-card--disabled' : ''}`}
          onClick={() => !disabled && onVote(value)}
          disabled={disabled}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
