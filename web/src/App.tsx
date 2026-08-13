import {useState } from "react";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { useExitListener } from "./hooks/useExitListener";
import Menu from "./components/Menu";

export default function App(){

    const [isVisible, setIsVisible] = useState(false)
    const [leaderboardData, setLeaderboardData] = useState([])

    useNuiEvent("openMenu", (payload)=>{
      setLeaderboardData(payload || [])
      setIsVisible(true)
    })

    useExitListener(setIsVisible)

    if(!isVisible){
      return null
    }

    return(
      <div style={{background: 'rgba(0,0,0,0.8)', color: 'white', padding: '50px'}}>
        <Menu closeUI={() => setIsVisible(false)} leaderboardData={leaderboardData} />
      </div>
    )

}