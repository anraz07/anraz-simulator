import { useState } from 'react'
import './Menu.css'


type Tab = 'tracks' | 'leaderboards' | 'personal'

export default function Menu() {
    const [activeTab, setActiveTab] = useState<Tab>('tracks')

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
                        {/*TODO: tracklist and vehicle type list*/}
                        <h3>Select a Track</h3>
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
                                <tr>
                                    <td>1</td>
                                    <td>Jhon Doe</td>
                                    <td>S+</td>
                                    <td>01:24:53</td>
                                </tr>
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