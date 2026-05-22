export default function PlayerList({ users, revealed }) {
  return (
    <div className="player-list">
      <h3 className="player-list-title">Players ({users.length})</h3>
      <ul className="players">
        {users.map((user, i) => (
          <li key={i} className="player">
            <span className="player-name">{user.name}</span>
            <span className={`player-vote ${user.hasVoted ? 'player-vote--voted' : 'player-vote--waiting'}`}>
              {revealed
                ? (user.vote ?? '—')
                : user.hasVoted
                ? '✓'
                : 'waiting…'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
