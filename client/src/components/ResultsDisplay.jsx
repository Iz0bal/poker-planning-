export default function ResultsDisplay({ users }) {
  const numericVotes = users
    .map((u) => parseFloat(u.vote))
    .filter((v) => !isNaN(v));

  const average =
    numericVotes.length > 0
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
      : null;

  const voteCounts = users.reduce((acc, u) => {
    if (u.vote !== null) {
      acc[u.vote] = (acc[u.vote] || 0) + 1;
    }
    return acc;
  }, {});

  const consensus = Object.keys(voteCounts).length === 1;

  return (
    <div className="results">
      <h3 className="results-title">Results</h3>
      {consensus && (
        <div className="results-consensus">Team consensus!</div>
      )}
      <div className="results-stats">
        {average !== null && (
          <div className="results-stat">
            <span className="results-stat-label">Average</span>
            <span className="results-stat-value">{average}</span>
          </div>
        )}
        <div className="results-votes">
          {Object.entries(voteCounts)
            .sort((a, b) => {
              const na = parseFloat(a[0]);
              const nb = parseFloat(b[0]);
              if (!isNaN(na) && !isNaN(nb)) return na - nb;
              return String(a[0]).localeCompare(String(b[0]));
            })
            .map(([vote, count]) => (
              <div key={vote} className="results-vote-item">
                <span className="results-vote-value">{vote}</span>
                <span className="results-vote-bar" style={{ '--count': count, '--total': users.length }} />
                <span className="results-vote-count">{count}×</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
