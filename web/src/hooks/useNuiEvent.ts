import { useEffect } from "react";

export function useNuiEvent<T = any>(action: string, handler: (data: T)=> void){
    useEffect(()=>{
        const eventListener = (event: MessageEvent) => {
            const { action: eventAction, data} = event.data

            if (eventAction === action){
                handler(data)
            }
        }

        window.addEventListener("message", eventListener)

        return () => window.removeEventListener("message", eventListener)
    }, [action, handler])
}