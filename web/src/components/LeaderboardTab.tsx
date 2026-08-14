import { useState } from 'react'
import { formatLapTime } from '../utils/time';
import './LayOut.css';

interface LeaderboardTabProps {
    uiData: any
}

export default function LeaderboardTab({ uiData }: LeaderboardTabProps) {
    const tracks = Object.values(uiData.tracks)
    const availableCategories = uiData.categories[uiData.job] || []
    
    const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] || '')

    const currentTrack = tracks[selectedTrackIndex] as any
    
    
   
    const filteredLeaderboards = uiData.leaderboards.filter((record: any) => {
        return record.track === currentTrack.id && record.category === selectedCategory
    });

  
    let totalMs = 0
    filteredLeaderboards.forEach((r: any) => totalMs += r.time_ms)
    const avgMs = filteredLeaderboards.length > 0 ? totalMs / filteredLeaderboards.length : 0
    const averageTimeStr = formatLapTime(avgMs)

    return (
        <div className="pause-menu-layout">
            
            <div className="pause-left-column">
                <div className="list-header">SELECT TRACK</div>
                {tracks.map((track: any, index: number) => (
                    <div 
                        key={track.id} 
                        className={`pause-list-item ${index === selectedTrackIndex ? 'selected' : ''}`}
                        onClick={() => setSelectedTrackIndex(index)}
                    >
                        {track.name}
                    </div>
                ))}
            </div>

            <div className="pause-right-column">
                <div className="track-details-header">
                    <h2>{currentTrack.name} - LEADERBOARDS</h2>
                </div>

                <div className="track-controls-box" style={{ marginBottom: '20px' }}>
                    <div className="gta-select-row">
                        <span>Filter Class</span>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            {availableCategories.map((cat: string) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="gta-stats-row" style={{ borderLeft: '4px solid #1c5233' }}>
                        <div>Average Class Time: <span>{averageTimeStr}</span></div>
                    </div>
                </div>

                <table className="gta-table">
                    <thead>
                        <tr>
                            <th>RANK</th>
                            <th>OFFICER</th>
                            <th>CLASS</th>
                            <th>TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaderboards.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>NO RECORDS FOUND</td>
                            </tr>
                        )}
                        {filteredLeaderboards.map((record: any, index: number) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{record.name}</td>
                                <td>{record.category}</td>
                                <td>{formatLapTime(record.time_ms)}</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}