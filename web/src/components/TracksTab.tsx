import { useState } from 'react'
import './LayOut.css'
import { formatLapTime } from '../utils/time'

interface TracksTabProps {
    uiData: any
    closeUI: () => void
}

export default function TracksTab({ uiData, closeUI }: TracksTabProps) {
    
    const tracks = Object.values(uiData.tracks)
    
    
    const availableCategories = uiData.categories[uiData.job] || []
    
    
    const [selectedTrackIndex, setSelectedTrackIndex] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] || '')

    const currentTrack = tracks[selectedTrackIndex] as any

    if (!currentTrack) return null

    const filteredRecords = (uiData.leaderboards || []).filter((record: any) => {
    return record.track === currentTrack.id && record.category === selectedCategory;
    })

    const bestRecord = filteredRecords[0]
    const topTimeStr = bestRecord ? formatLapTime(bestRecord.time_ms) : '--:--.--'

    const totalMs = filteredRecords.reduce((acc: number, curr: any) => acc + curr.time_ms, 0)
    const avgMs = filteredRecords.length > 0 ? Math.round(totalMs / filteredRecords.length) : 0
    const avgTimeStr = formatLapTime(avgMs)

    
    function handleStart() {
        fetch(`https://${GetParentResourceName()}/startSimulation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ track: currentTrack.id, category: selectedCategory })
        });
        closeUI();
    }

    return (
        <div className="pause-menu-layout">
            
            
            <div className="pause-left-column">
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
                    <h2>{currentTrack.name}</h2>
                    <p>{currentTrack.description}</p>
                </div>
                
                <div className="track-image-box">
                    <img src={currentTrack.mapImage} alt={currentTrack.name} />
                </div>

                
                <div className="track-controls-box">
                    <div className="gta-select-row">
                        <span>Vehicle Class</span>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            {availableCategories.map((cat: string) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="gta-stats-row">
                        <div>Top Time: <span>{topTimeStr}</span></div>
                        <div>Average Time: <span>{avgTimeStr}</span></div>
                    </div>

                    <button className="gta-start-button" onClick={handleStart}>START SIMULATION</button>
                </div>

            </div>
        </div>
    );
}