import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useApp } from './AppContext';
import { Bot, User, ExternalLink, BookOpen, Info } from 'lucide-react';
import { irriChatFlows, type ChatFlow, type Citation } from '../data/irriChatFlows';

interface ChatFlowExamplesProps {
  onFlowSelect?: (flow: ChatFlow) => void;
}

export function ChatFlowExamples({ onFlowSelect }: ChatFlowExamplesProps) {
  const { language } = useApp();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [openCitationId, setOpenCitationId] = useState<string | null>(null);

  const texts = {
    EN: {
      title: 'Example Conversations',
      subtitle: 'Learn from these IRRI-based demonstrations',
      tapToView: 'Tap to view full conversation',
      source: 'Source',
      clickForDetails: 'Click for details',
      poweredBy: 'Powered by IRRI Research'
    },
    VI: {
      title: 'Ví Dụ Hội Thoại',
      subtitle: 'Học hỏi từ các trình diễn dựa trên IRRI',
      tapToView: 'Nhấn để xem hội thoại đầy đủ',
      source: 'Nguồn',
      clickForDetails: 'Nhấn để xem chi tiết',
      poweredBy: 'Được hỗ trợ bởi nghiên cứu IRRI'
    }
  };

  const t = texts[language];

  const renderCitationPopover = (citation: Citation, messageId: string, citationIndex: number) => {
    const citationId = `${messageId}-${citationIndex}`;
    
    return (
      <Popover 
        open={openCitationId === citationId}
        onOpenChange={(open) => setOpenCitationId(open ? citationId : null)}
      >
        <PopoverTrigger asChild>
          <button
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-1"
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <Info className="w-3 h-3" />
            <span className="font-medium">
              {language === 'EN' ? citation.label.en : citation.label.vi}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 sm:w-96 p-0 border-2 border-blue-100 shadow-lg"
          side="top"
          align="start"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-200">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-blue-900 leading-tight">
                  {language === 'EN' ? citation.label.en : citation.label.vi}
                </h4>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{language === 'EN' ? citation.excerpt.en : citation.excerpt.vi}"
              </p>
            </div>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="font-medium">{t.source}: IRRI CGSpace</span>
            </a>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 px-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-green-700 flex-shrink-0" />
              <span>{t.title}</span>
            </CardTitle>
            <p className="text-xs text-gray-600 leading-tight">
              {t.subtitle}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {irriChatFlows.flows.length} {language === 'EN' ? 'flows' : 'luồng'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)] lg:h-[calc(100vh-240px)]">
          <div className="p-3 space-y-3">
            {irriChatFlows.flows.map((flow) => (
              <Card 
                key={flow.id}
                className="border-2 border-gray-200 hover:border-green-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => {
                  setSelectedFlowId(selectedFlowId === flow.id ? null : flow.id);
                  onFlowSelect?.(flow);
                }}
              >
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-tight">
                        {flow.title.split(' – ')[language === 'EN' ? 0 : 1] || flow.title}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {flow.topic.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-3 pb-3 pt-2">
                  <div className="space-y-2">
                    {flow.messages.map((message, msgIdx) => (
                      <div 
                        key={msgIdx} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-1.5`}>
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                                message.role === 'user' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-white border-2 border-blue-600'
                              }`}
                            >
                              {message.role === 'user' ? (
                                <User className="w-3 h-3" />
                              ) : (
                                <Bot className="w-3 h-3 text-blue-600" />
                              )}
                            </div>
                          </div>
                          
                          {/* Message Bubble */}
                          <div 
                            className={`rounded-lg px-2.5 py-2 shadow-sm ${
                              message.role === 'user' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <p className="text-xs leading-relaxed whitespace-pre-wrap">
                              {language === 'EN' ? message.text_en : message.text_vi}
                            </p>
                            
                            {/* Citations */}
                            {message.citations && message.citations.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="flex flex-wrap gap-1 items-center">
                                  {message.citations.map((citation, citIdx) => (
                                    <React.Fragment key={citIdx}>
                                      {renderCitationPopover(citation, `${flow.id}-${msgIdx}`, citIdx)}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* IRRI Attribution */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.poweredBy}</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">
                {irriChatFlows.source}
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
