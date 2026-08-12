import { useEffect } from "react";

export function useExitListener(setIsVisible: (visible: boolean)=> void){

    useEffect(()=>{
        const handleKeyDown = (event: KeyboardEvent)=>{
            if (event.code === "Escape"){
                setIsVisible(false)

                fetch(`https://${GetParentResourceName()}/closeMenu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
                });
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return()=>{
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [setIsVisible])
}