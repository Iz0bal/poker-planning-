export default function ResultsDisplay({ users }) {
  const numericVotes = users
    .map((u) => parseFloat(u.vote))
    .filter((v) => !isNaN(v));

  const average =
    numericVotes.length > 0
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
      : null;

  // Group user names by their vote value
  const voteGroups = users.reduce((acc, u) => {
    if (u.vote !== null) {
      if (!acc[u.vote]) acc[u.vote] = [];
      acc[u.vote].push(u.name);
    }
    return acc;
  }, {});

  const consensus = Object.keys(voteGroups).length === 1;
  const totalVoters = users.filter((u) => u.vote !== null).length;

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
          {Object.entries(voteGroups)
            .sort((a, b) => {
              const na = parseFloat(a[0]);
              const nb = parseFloat(b[0]);
              if (!isNaN(na) && !isNaN(nb)) return na - nb;
              return String(a[0]).localeCompare(String(b[0]));
            })
            .map(([vote, names]) => (
              <div key={vote} className="results-vote-item">
                <div className="results-vote-row">
                  <span className="results-vote-value">{vote}</span>
                  <span
                    className="results-vote-bar"
                    style={{ '--count': names.length, '--total': totalVoters }}
                  />
                  <span className="results-vote-count">{names.length}×</span>
                </div>
                <div className="results-vote-names">
                  {names.map((name, i) => (
                    <span key={i} className="results-vote-name">{name}</span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
