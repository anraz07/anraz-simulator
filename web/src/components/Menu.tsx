import { useState } from 'react'
import './Menu.css'


type Tab = 'tracks' | 'leaderboards' | 'personal'

interface MenuProps{
    closeUI: () => void
    leaderboardData: any[]
}

export default function Menu({ closeUI, leaderboardData }: MenuProps) {
    const [activeTab, setActiveTab] = useState<Tab>('tracks')
    const [currentTrack, setCurrentTrack] = useState('')
    const [currentVehCategory, setCurrentVehCategory] = useState('')
    
    function handleStart(){

        fetch(`https://${GetParentResourceName()}/startSimulation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({track: currentTrack, category: currentVehCategory})
                });
                closeUI()
    }

    return (
        <div className="gta-menu-container">

            <div className="gta-header">
                <h2>LAPD SIM</h2>
                <div className="gta-tabs">
                    <button onClick={() => setActiveTab('tracks')} className={activeTab === 'tracks' ? 'active' : ''}>TRACKS</button>
                    <button onClick={() => setActiveTab('leaderboards')} className={activeTab === 'leaderboards' ? 'active' : ''}>LEADERBOARDS</button>
                    <button onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>PROFILE</button>
                </div>
            </div>

            
            <div className="gta-content">
                {activeTab === 'tracks' && (
                    <div className="tracks-view">
                        <h3>Select a Track</h3>
                        <select value={currentTrack} onChange={(e) => setCurrentTrack(e.target.value)}>
                            <option value="sandyShoresCircuit">Sandy Shores Circuit</option>
                            <option value="paletoBaySprint">Paleto Bay Sprint</option>
                        </select>
                        <select value={currentVehCategory} onChange={(e) => setCurrentVehCategory(e.target.value)}>
                            <option value="S+">S+</option>
                            <option value="S">S</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="MS">MS</option>
                            <option value="MA">MA</option>
                        </select>
                        <button onClick={handleStart}>START SIMULATION</button>
                    </div>
                )}
                
                {activeTab === 'leaderboards' && (
                    <div className="leaderboards-view">
                        <h3>Department Leaderboards</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Vehicle Class</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((record, index)=>(
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{record.name}</td>
                                        <td>{record.category}</td>
                                        <td>{record.time_ms} ms</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'personal' && (
                    <div className="personal-view">
                        <h3>Your Record</h3>
                    </div>
                )}
            </div>
        </div>
    );
}