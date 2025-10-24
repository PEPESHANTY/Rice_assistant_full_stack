import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useApp } from './AppContext';
import { Bot, User, BookOpen, Info, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { irriChatFlows, type ChatFlow, type Citation, type FlowMessage } from '../data/irriChatFlows';

interface ConversationExamplesProps {
  onLoadConversation?: (flow: ChatFlow) => void;
}

export function ConversationExamples({ onLoadConversation }: ConversationExamplesProps) {
  const { language } = useApp();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [openCitationId, setOpenCitationId] = useState<string | null>(null);

  const texts = {
    EN: {
      title: 'Example Conversations',
      subtitle: 'Complete IRRI demonstrations with citations',
      loadConversation: 'Try this conversation',
      viewFullConversation: 'View full conversation',
      collapseConversation: 'Collapse conversation',
      source: 'Source',
      poweredBy: 'Powered by IRRI Research',
      messages: 'messages'
    },
    VI: {
      title: 'Ví Dụ Hội Thoại',
      subtitle: 'Trình diễn IRRI đầy đủ với trích dẫn',
      loadConversation: 'Thử hội thoại này',
      viewFullConversation: 'Xem hội thoại đầy đủ',
      collapseConversation: 'Thu gọn hội thoại',
      source: 'Nguồn',
      poweredBy: 'Được hỗ trợ bởi nghiên cứu IRRI',
      messages: 'tin nhắn'
    }
  };

  const t = texts[language];

  const renderCitationPopover = (citation: Citation, messageId: string, citationIndex: number) => {
    const citationId = `${messageId}-${citationIndex}`;
    
    return (
      <Popover 
        key={citationIndex}
        open={openCitationId === citationId}
        onOpenChange={(open) => setOpenCitationId(open ? citationId : null)}
      >
        <PopoverTrigger asChild>
          <button
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Info className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">
              {language === 'EN' ? citation.label.en : citation.label.vi}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-72 sm:w-80 p-0 border-2 border-blue-100 shadow-xl z-50"
          side="top"
          align="start"
          sideOffset={8}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2.5 border-b border-blue-200">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-blue-900 leading-tight">
                  {language === 'EN' ? citation.label.en : citation.label.vi}
                </h4>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2.5">
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{language === 'EN' ? citation.excerpt.en : citation.excerpt.vi}"
              </p>
            </div>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">{t.source}: IRRI CGSpace</span>
            </a>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderMessage = (message: FlowMessage, messageIndex: number, flowId: string) => {
    return (
      <div 
        key={messageIndex} 
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                message.role === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white border-2 border-blue-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-blue-600" />
              )}
            </div>
          </div>
          
          {/* Message Bubble */}
          <div 
            className={`rounded-xl px-3 py-2.5 shadow-sm ${
              message.role === 'user' 
                ? 'bg-green-600 text-white' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {language === 'EN' ? message.text_en : message.text_vi}
            </p>
            
            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-blue-100">
                <div className="flex flex-wrap gap-1.5 items-start">
                  {message.citations.map((citation, citIdx) => 
                    renderCitationPopover(citation, `${flowId}-${messageIndex}`, citIdx)
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
      </div>
      <p className="text-xs text-gray-600 px-1">{t.subtitle}</p>
      
      <div className="space-y-3">
        {irriChatFlows.flows.map((flow) => {
          const isExpanded = selectedFlowId === flow.id;
          const flowTitle = flow.title.split(' – ');
          const displayTitle = language === 'EN' ? flowTitle[0] : flowTitle[1] || flowTitle[0];
          
          return (
            <Card 
              key={flow.id}
              className={`border-2 transition-all ${
                isExpanded 
                  ? 'border-green-400 shadow-lg' 
                  : 'border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md'
              }`}
            >
              <CardHeader 
                className="pb-3 px-3 pt-3 cursor-pointer"
                onClick={() => setSelectedFlowId(isExpanded ? null : flow.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight flex-1">
                        {displayTitle}
                      </h4>
                      <ChevronRight 
                        className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {flow.topic.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      <span className="text-xs text-gray-500">
                        • {flow.messages.length} {t.messages}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="space-y-2.5 mb-3">
                    {flow.messages.map((message, msgIdx) => 
                      renderMessage(message, msgIdx, flow.id)
                    )}
                  </div>
                  
                  {onLoadConversation && (
                    <Button
                      onClick={() => onLoadConversation(flow)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
                      size="sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {t.loadConversation}
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      
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
  );
}
