import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";


export default function useWebContainer() {
    const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
    const main = async () => {
        const webcontainer = await WebContainer.boot();
        setWebContainer(webcontainer);
    }
    useEffect(() => {
        main()
    }, []);
    return webContainer
}