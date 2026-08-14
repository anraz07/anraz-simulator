import './LayOut.css'
import { useState } from 'react'
import { formatLapTime } from '../utils/time'

interface ProfileTabProps {
    uiData: any
}

type ProfileSubTab = 'CAREER' | 'CERTIFICATIONS' | 'AWARDS'

export default function ProfileTab({ uiData }: ProfileTabProps) {
    const info = uiData.personalInfo
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('CAREER')

    const allPersonalRuns = (uiData.leaderboards || []).filter((r: any) => r.name === info.name)

    const pbMap = new Map<string, any>()
    allPersonalRuns.forEach((run: any)=>{
        const key = `${run.track}_${run.category}`
        if(!pbMap.has(key) || run.time_ms < pbMap.get(key).time_ms){
            pbMap.set(key, run)
        }
    })
    const personalBests = Array.from(pbMap.values())

    return (
        <div className="pause-menu-layout">
            <div className="pause-left-column">
                <div className="list-header">OFFICER DOSSIER</div>
                <div 
                    className={`pause-list-item ${activeSubTab === 'CAREER' ? 'selected' : ''}`}
                    onClick={() => setActiveSubTab('CAREER')}
                >
                    CAREER OVERVIEW
                </div>
                <div 
                    className={`pause-list-item ${activeSubTab === 'CERTIFICATIONS' ? 'selected' : ''}`}
                    onClick={() => setActiveSubTab('CERTIFICATIONS')}
                >
                    LICENSES & CERTS
                </div>
                <div 
                    className={`pause-list-item ${activeSubTab === 'AWARDS' ? 'selected' : ''}`}
                    onClick={() => setActiveSubTab('AWARDS')}
                >
                    AWARDS & MEDALS
                </div>
            </div>
            <div className="pause-right-column">

                {activeSubTab === 'CAREER' && (
                    <>
                        <div className="track-details-header">
                            <h2>OFFICER PROFILE</h2>
                            <p>Simulation performance metrics for {info.name}</p>
                        </div>
                        <div className="gta-stats-row" style={{ marginBottom: '20px' }}>
                            <div>Name: <span>{info.name}</span></div>
                            <div>Department: <span>{info.job}</span></div>
                            <div>Rank / Grade: <span>{info.rank}</span></div>
                            <div>Total Simulations Completed: <span>{allPersonalRuns.length}</span></div>
                        </div>
                        <div className="list-header" style={{ textAlign: 'left', paddingLeft: '10px' }}>
                            PERSONAL BEST TIMES
                        </div>
                        <table className="gta-table">
                            <thead>
                                <tr>
                                    <th>TRACK</th>
                                    <th>CLASS</th>
                                    <th>BEST LAP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personalBests.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                                            NO SIMULATIONS RECORDED YET
                                        </td>
                                    </tr>
                                )}
                                {personalBests.map((record: any, index: number) => (
                                    <tr key={index}>
                                        <td>{record.track}</td>
                                        <td>{record.category}</td>
                                        <td style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                            {formatLapTime(record.time_ms)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                {activeSubTab === 'CERTIFICATIONS' && (
                    <>
                        <div className="track-details-header">
                            <h2>DEPARTMENT CERTIFICATIONS</h2>
                            <p>Driver qualification criteria and qualification status</p>
                        </div>
                        {/* Example License Card */}
                        <div className="gta-stats-row" style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '16px', color: '#ffc107' }}>
                                HIGH-SPEED INTERCEPTOR LICENSE (S+)
                            </div>
                            <div style={{ fontSize: '13px', color: '#ccc', margin: '5px 0' }}>
                                Authorized for pursuit vehicles with Class S+ classification.
                            </div>
                            
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>• Required Rank: Police Officer II+</span>
                                    <span style={{ color: '#4caf50' }}>✓ Requirement Fulfilled</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>• Beat Sandy Shores Circuit (Class S+) under 00:50.000</span>
                                    <span style={{ color: '#e53935' }}>✗ Requirement Not Fulfilled</span>
                                </div>
                            </div>
                        </div>
                        <div className="gta-stats-row">
                            <div style={{ fontSize: '16px', color: '#ffc107' }}>
                                BASIC PATROL CERTIFICATION (B/A)
                            </div>
                            <div style={{ fontSize: '13px', color: '#ccc', margin: '5px 0' }}>
                                Standard patrol vehicle operation authorization.
                            </div>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>• Required Rank: Cadet / Officer I</span>
                                    <span style={{ color: '#4caf50' }}>✓ Requirement Fulfilled</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {activeSubTab === 'AWARDS' && (
                    <>
                        <div className="track-details-header">
                            <h2>AWARDS & ACHIEVEMENTS</h2>
                            <p>Departmental driving honors and commendations</p>
                        </div>
                        <div className="gta-stats-row">
                            <div>Fastest Lap of the Week: <span>None</span></div>
                            <div>Clean Driver Ribbon: <span>Awarded (0 Collision Penalties)</span></div>
                            <div>Master of Sandy Shores: <span>In Progress (2/5 Classes Mastered)</span></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}