import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TEAMS = [
  { id: 'team-a', label: 'CrossClient' },
  { id: 'team-b', label: 'SelfCare' },
];

export default function LandingPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  function handleTeamClick(teamId) {
    setSelectedTeam(teamId);
    setName('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    navigate(`/team/${selectedTeam}`, { state: { name: name.trim() } });
  }

  return (
    <div className="landing">
      <h1 className="landing-title">Planning Poker</h1>
      <p className="landing-subtitle">Select your team to get started</p>

      <div className="team-cards">
        {TEAMS.map((team) => (
          <button
            key={team.id}
            className={`team-card ${selectedTeam === team.id ? 'team-card--active' : ''}`}
            onClick={() => handleTeamClick(team.id)}
          >
            <span className="team-card-label">{team.label}</span>
          </button>
        ))}
      </div>

      {selectedTeam && (
        <form className="name-form" onSubmit={handleSubmit}>
          <input
            className="name-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={30}
          />
          <button className="btn btn-primary" type="submit" disabled={!name.trim()}>
            Join {TEAMS.find((t) => t.id === selectedTeam)?.label}
          </button>
        </form>
      )}
    </div>
  );
}
