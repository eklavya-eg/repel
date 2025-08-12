import type { WebContainer } from "@webcontainer/api"
import { useEffect, useState } from "react";


interface props{
    webContainer: WebContainer,
    projectFiles: any
}
export default function Preview({webContainer, projectFiles}:props){
    // const [url, setUrl] = useState<string>("");
    const main = async()=>{
        await webContainer.mount(projectFiles);
        const install = await webContainer.spawn('npm', ['i']);
        await install.exit;
        await webContainer.spawn('npm', ['run', 'dev']);
    }
    useEffect(()=>{
        main();
    }, [projectFiles])

}