'use client';

import { useEffect, useState, use } from 'react';
import JSZip from 'jszip';
import { createClient } from '@/lib/supabase/client';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

interface Site {
  id: string;
  name: string;
  subdomain: string;
}

interface SiteFile {
  id: string;
  file_path: string;
  content: string;
}

interface Generation {
  id: string;
  prompt: string;
  created_at: string;
}

type DeviceWidth = '100%' | '768px' | '390px';

function fileDotColor(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  if (ext === 'html') return 'bg-orange-500';
  if (ext === 'css') return 'bg-blue-500';
  if (ext === 'js') return 'bg-yellow-500';
  return 'bg-zinc-500';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function SiteEditorPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = use(params);
  const supabase = createClient();

  const [site, setSite] = useState<Site | null>(null);
  const [files, setFiles] = useState<SiteFile[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('100%');
  const [iframeKey, setIframeKey] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [siteRes, filesRes, gensRes] = await Promise.all([
        supabase.from('sites').select('id, name, subdomain').eq('id', siteId).single(),
        supabase.from('site_files').select('id, file_path, content').eq('site_id', siteId),
        supabase.from('generations').select('id, prompt, created_at').eq('site_id', siteId).order('created_at', { ascending: true }),
      ]);
      if (siteRes.data) setSite(siteRes.data as Site);
      if (filesRes.data) setFiles(filesRes.data as SiteFile[]);
      if (gensRes.data) setGenerations(gensRes.data as Generation[]);
    }
    load();
  }, [siteId]);

  async function handleDownload() {
    if (!site) return;
    const zip = new JSZip();
    files.forEach((f) => zip.file(f.file_path, f.content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function callGenerate(prompt: string) {
    setEditError(null);
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, siteId }),
      });
      const data = await res.json() as { files?: SiteFile[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      if (data.files) setFiles(data.files as SiteFile[]);
      setIframeKey((k) => k + 1);
      // Refresh generations
      const { data: gensData } = await supabase
        .from('generations')
        .select('id, prompt, created_at')
        .eq('site_id', siteId)
        .order('created_at', { ascending: true });
      if (gensData) setGenerations(gensData as Generation[]);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsRegenerating(false);
    }
  }

  const devices: { label: string; value: DeviceWidth }[] = [
    { label: 'Desktop', value: '100%' },
    { label: 'Tablet', value: '768px' },
    { label: 'Mobile', value: '390px' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* ── Left panel: file tree ── */}
      <aside className="w-56 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <p className="text-sm font-medium text-zinc-400">Files</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {files.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFile(f.file_path)}
              className={[
                'flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer text-sm text-left transition-colors',
                selectedFile === f.file_path
                  ? 'bg-zinc-800 border border-zinc-700 text-white'
                  : 'hover:bg-zinc-800 text-zinc-300',
              ].join(' ')}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${fileDotColor(f.file_path)}`} />
              <span className="truncate">{f.file_path}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors"
          >
            Download ZIP
          </button>
        </div>
      </aside>

      {/* ── Center panel: preview ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 border-b border-zinc-800 bg-zinc-900 flex items-center gap-3 px-4 shrink-0">
          {site && (
            <span className="text-sm text-zinc-400">{site.subdomain}.vibbr.app</span>
          )}

          <div className="w-px h-4 bg-zinc-700 mx-1" />

          {devices.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDeviceWidth(d.value)}
              className={[
                'text-xs px-2 py-1 rounded transition-colors',
                deviceWidth === d.value
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300',
              ].join(' ')}
            >
              {d.label}
            </button>
          ))}

          <div className="w-px h-4 bg-zinc-700 mx-1" />

          <button
            type="button"
            onClick={() => callGenerate('Regenerate this site with the same concept but improved design')}
            disabled={isRegenerating}
            className="text-xs text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
          <iframe
            key={iframeKey}
            src={`/api/preview/${siteId}`}
            style={{
              width: deviceWidth,
              height: '100%',
              border: 'none',
              borderRadius: '8px',
            }}
            title="Site preview"
          />
        </div>
      </div>

      {/* ── Right panel: AI edit ── */}
      <aside className="w-80 shrink-0 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <p className="text-sm font-medium text-zinc-400">Edit with AI</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {generations.map((g) => (
            <div key={g.id} className="bg-zinc-800 rounded-lg p-3">
              <p className="text-sm text-zinc-300">{g.prompt}</p>
              <p className="text-xs text-zinc-500 mt-1">{formatDate(g.created_at)}</p>
            </div>
          ))}
          {generations.length === 0 && (
            <p className="text-xs text-zinc-600">No edits yet. Ask AI to change something.</p>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 flex flex-col gap-2">
          {editError && (
            <p className="text-xs text-red-400">{editError}</p>
          )}
          <PromptInputBox
            onSend={(msg) => callGenerate(msg)}
            isLoading={isRegenerating}
            placeholder="Make the hero darker..."
          />
        </div>
      </aside>
    </div>
  );
}
