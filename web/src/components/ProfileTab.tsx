import './LayOut.css'

interface ProfileTabProps {
    uiData: any
}

export default function ProfileTab({ uiData }: ProfileTabProps) {
    const info = uiData.personalInfo
    
    
    const personalRecords = uiData.leaderboards.filter((record: any) => record.name === info.name)

    return (
        <div className="pause-menu-layout">
            
            <div className="pause-left-column">
                <div className="pause-list-item selected">CAREER OVERVIEW</div>
                <div className="pause-list-item">CERTIFICATIONS</div>
                <div className="pause-list-item">AWARDS</div>
            </div>

            <div className="pause-right-column">
                <div className="track-details-header">
                    <h2>OFFICER PROFILE</h2>
                    <p>Simulation performance metrics for {info.name}</p>
                </div>

                <div className="gta-stats-row" style={{ marginBottom: '20px' }}>
                    <div>Name: <span>{info.name}</span></div>
                    <div>Department: <span>{info.job}</span></div>
                    <div>Rank: <span>{info.rank}</span></div>
                    <div>Total Simulations Run: <span>{personalRecords.length}</span></div>
                </div>

                <h3>Personal Best Times</h3>
                <table className="gta-table">
                    <thead>
                        <tr>
                            <th>TRACK</th>
                            <th>CLASS</th>
                            <th>TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personalRecords.map((record: any, index: number) => (
                            <tr key={index}>
                                <td>{record.track}</td>
                                <td>{record.category}</td>
                                <td>{(record.time_ms / 1000).toFixed(3)} s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}