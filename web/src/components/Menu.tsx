import { useState } from 'react'
import './Menu.css'
import TracksTab from './TracksTab'
import LeaderboardTab from './LeaderboardTab'
import ProfileTab from './ProfileTab'

type Tab = 'TRACKS' | 'LEADERBOARD' | 'PROFILE'

export default function Menu({ closeUI, uiData }: any) {
    const [activeTab, setActiveTab] = useState<Tab>('TRACKS')
    if (!uiData) return null; // Safety net

    return (
        <div className="pause-menu-container">
            {/* TOP NAVIGATION BAR */}
            <div className="pause-menu-header">
                <div 
                    className={`pause-menu-tab ${activeTab === 'TRACKS' ? 'active' : ''}`}
                    onClick={() => setActiveTab('TRACKS')}
                >
                    MAPS
                </div>
                <div 
                    className={`pause-menu-tab ${activeTab === 'LEADERBOARD' ? 'active' : ''}`}
                    onClick={() => setActiveTab('LEADERBOARD')}
                >
                    LEADERBOARDS
                </div>
                <div 
                    className={`pause-menu-tab ${activeTab === 'PROFILE' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PROFILE')}
                >
                    PROFILE
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="pause-menu-content">
                {activeTab === 'TRACKS' && <TracksTab uiData={uiData} closeUI={closeUI} />}
                {activeTab === 'LEADERBOARD' && <LeaderboardTab uiData={uiData} />}
                {activeTab === 'PROFILE' && <ProfileTab uiData={uiData} />}
            </div>
        </div>
    );
}