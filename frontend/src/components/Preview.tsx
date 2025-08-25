import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  webContainer: WebContainer;
}

export default function Preview({ webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

async function main() {
  const installProcess = await webContainer.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log("install:", data);
    }
  }));
  await installProcess.exit;

  const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
  devProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log("dev:", data);
    }
  }));

  webContainer.on('server-ready', (port, previewUrl) => {
    console.log("✅ WebContainer server ready at:", previewUrl);
    setUrl(previewUrl);
  });
} 

  useEffect(() => {
    main()
  }, [])
  return (
    <div className="h-full w-full flex flex-col">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between bg-gray-100 p-2 shadow-md">
        <input
          placeholder="/"
          value={url ?? ""}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full max-w-lg px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
        />

      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        {!url && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="mb-2">Loading...</p>
          </div>
        )}
        {url && (
          <iframe
            className="w-full h-full border-0"
            src={url}
          />
        )}
      </div>
    </div>

  );
}