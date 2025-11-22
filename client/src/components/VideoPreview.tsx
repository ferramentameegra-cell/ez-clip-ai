import { Video, Gamepad2, Type } from "lucide-react";

interface VideoPreviewProps {
  hasSecondaryContent?: boolean;
  hasSubtitles?: boolean;
  headline?: string;
}

export function VideoPreview({ 
  hasSecondaryContent = false, 
  hasSubtitles = false,
  headline 
}: VideoPreviewProps) {
  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Título */}
        <div>
          <h2 className="text-3xl font-bold mb-3">Preview do Resultado</h2>
          <p className="text-xl text-muted-foreground">
            Visualização de como ficará o vídeo final no TikTok
          </p>
        </div>

        {/* Mockup do TikTok */}
        <div className="relative max-w-sm mx-auto">
          {/* Moldura do celular */}
          <div className="relative aspect-[9/16] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-gray-900 p-3">
            {/* Notch (entalhe do iPhone) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50" />
            
            {/* Conteúdo do vídeo */}
            <div className="relative h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 rounded-[2rem] overflow-hidden">
              
              {/* TOP SAFE ZONE (200px / 10.42%) - Logo TikTok */}
              <div className="absolute top-0 left-0 right-0 h-[10.42%] bg-gradient-to-b from-black/60 to-transparent z-40 flex items-center justify-between px-4">
                <div className="text-white text-xs font-medium">
                  Seguindo
                </div>
                <div className="text-white text-xs font-bold">
                  Para Você
                </div>
                <div className="w-6" /> {/* Espaço vazio */}
              </div>

              {/* VÍDEO PRINCIPAL (200-900px / 36.46%) */}
              <div className="absolute top-[10.42%] left-0 right-0 h-[36.46%] bg-purple-500/30 backdrop-blur-sm flex items-center justify-center border-b-2 border-white/20">
                <div className="text-white text-center space-y-2">
                  <Video className="h-12 w-12 mx-auto opacity-70" />
                  <p className="text-xs font-medium px-4">
                    Vídeo Principal
                    <br />
                    <span className="text-[10px] opacity-70">(200-900px)</span>
                  </p>
                </div>
              </div>

              {/* HEADLINE (900-940px / 2.08%) */}
              {headline && (
                <div className="absolute top-[46.88%] left-0 right-0 h-[2.08%] bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 border-y-2 border-yellow-400/50">
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Type className="h-3 w-3" />
                    <p className="text-[10px] font-bold uppercase tracking-wide">
                      {headline}
                    </p>
                  </div>
                </div>
              )}

              {/* VÍDEO DE RETENÇÃO (940-1620px / 35.42%) */}
              {hasSecondaryContent ? (
                <div className="absolute top-[48.96%] left-0 right-0 h-[35.42%] bg-blue-500/30 backdrop-blur-sm flex items-center justify-center border-t-2 border-white/20">
                  <div className="text-white text-center space-y-2">
                    <Gamepad2 className="h-12 w-12 mx-auto opacity-70" />
                    <p className="text-xs font-medium px-4">
                      Vídeo de Retenção
                      <br />
                      <span className="text-[10px] opacity-70">(940-1620px)</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute top-[48.96%] left-0 right-0 h-[35.42%] bg-purple-500/30 backdrop-blur-sm flex items-center justify-center border-t-2 border-white/20">
                  <div className="text-white text-center space-y-2">
                    <Video className="h-12 w-12 mx-auto opacity-70" />
                    <p className="text-xs font-medium px-4">
                      Vídeo Principal
                      <br />
                      <span className="text-[10px] opacity-70">(Continuação)</span>
                    </p>
                  </div>
                </div>
              )}

              {/* LEGENDAS (1620-1720px / 5.21%) - ACIMA DOS BOTÕES */}
              {hasSubtitles && (
                <div className="absolute top-[84.38%] left-0 right-0 h-[5.21%] flex items-center justify-center px-4 z-30">
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-[11px] font-medium text-center max-w-[90%] mx-auto border-2 border-yellow-400/30">
                    Legendas aparecem aqui
                  </div>
                </div>
              )}

              {/* BOTTOM SAFE ZONE (1720-1920px / 10.42%) - Botões */}
              <div className="absolute bottom-0 left-0 right-0 h-[10.42%] bg-gradient-to-t from-black/80 to-transparent z-40">
                {/* Botões laterais (like, comment, share) */}
                <div className="absolute bottom-0 right-2 space-y-3 pb-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white/40" />
                    </div>
                    <span className="text-white text-[8px]">12.5K</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white/40" />
                    </div>
                    <span className="text-white text-[8px]">1.2K</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white/40" />
                    </div>
                    <span className="text-white text-[8px]">856</span>
                  </div>
                </div>

                {/* Username e descrição */}
                <div className="absolute bottom-2 left-4 right-16">
                  <p className="text-white text-xs font-bold">@seuperfil</p>
                  <p className="text-white text-[10px] opacity-80 line-clamp-1">
                    Descrição do vídeo...
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Legenda explicativa */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-4 h-4 bg-purple-500 rounded" />
              <span className="flex-1">Vídeo Principal (topo)</span>
              <span className="text-muted-foreground">36.5% (700px)</span>
            </div>
            {headline && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="flex-1">Headline (centro)</span>
                <span className="text-muted-foreground">2.1% (40px)</span>
              </div>
            )}
            {hasSecondaryContent && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="flex-1">Vídeo Retenção</span>
                <span className="text-muted-foreground">35.4% (680px)</span>
              </div>
            )}
            {hasSubtitles && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="flex-1">Legendas (visíveis)</span>
                <span className="text-muted-foreground">5.2% (100px) - y=1620px</span>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-4 h-4 bg-gray-800 rounded" />
              <span className="flex-1">Safe Zones (UI)</span>
              <span className="text-muted-foreground">20.8% (400px)</span>
            </div>
          </div>

          {/* Aviso importante */}
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <p className="text-sm font-medium text-yellow-900 text-center">
              ⚠️ Safe zones respeitadas para TikTok e Instagram Reels
            </p>
            <p className="text-xs text-yellow-700 text-center mt-1">
              Legendas posicionadas em y=1620px (acima dos botões)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
