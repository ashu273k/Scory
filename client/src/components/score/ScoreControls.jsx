import { useState } from 'react';

export function ScoreControls({ gameType, onScoreChange, disabled }) {
  const [team, setTeam] = useState('team1');

  if (gameType === 'cricket') {
    return (
      <div className="card mt-4">
        <h3 className="font-bold mb-4">Update Score</h3>
        <div className="flex gap-2 mb-3">
          <button className={`flex-1 ${team==='team1'?'btn-primary':'btn-secondary'}`} onClick={()=>setTeam('team1')}>Team 1</button>
          <button className={`flex-1 ${team==='team2'?'btn-success':'btn-secondary'}`} onClick={()=>setTeam('team2')}>Team 2</button>
        </div>
        <div className="flex gap-2 mb-2">
          {[1,2,3,4,6].map(runs=>(
            <button key={runs} disabled={disabled} className="btn btn-primary flex-1" onClick={()=>onScoreChange({team, runs})}>+{runs}</button>
          ))}
          <button disabled={disabled} className="btn btn-danger flex-1" onClick={()=>onScoreChange({team, wicket:true})}>Wicket</button>
        </div>
      </div>
    );
  }

  // For basketball, football, others
  return (
    <div className="card mt-4">
      <h3 className="font-bold mb-4">Update Score</h3>
      <div className="flex gap-2 mb-3">
        <button className={`flex-1 ${team==='team1'?'btn-primary':'btn-secondary'}`} onClick={()=>setTeam('team1')}>Team 1</button>
        <button className={`flex-1 ${team==='team2'?'btn-success':'btn-secondary'}`} onClick={()=>setTeam('team2')}>Team 2</button>
      </div>
      <div className="flex gap-2 mb-2">
        {[1,2,3].map(points=>(
          <button key={points} disabled={disabled} className="btn btn-primary flex-1" onClick={()=>onScoreChange({team, points})}>+{points}</button>
        ))}
      </div>
    </div>
  );
}
