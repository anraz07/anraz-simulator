import {useState } from "react";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { useExitListener } from "./hooks/useExitListener";
import Menu from "./components/Menu";

export default function App(){

    const [isVisible, setIsVisible] = useState(false)
    const [uiData, setUiData] = useState<any>(null);

    useNuiEvent("openMenu", (payload)=>{
      setUiData(payload)
      setIsVisible(true)
    })

    useExitListener(setIsVisible)

    if(!isVisible){
      return null
    }

    return(
      <div>
        <Menu closeUI={() => setIsVisible(false)} uiData={uiData} />
      </div>
    )

}