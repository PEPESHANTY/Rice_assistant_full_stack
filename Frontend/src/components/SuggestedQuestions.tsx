import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useApp } from './AppContext';

// Topic structure based on irriChatFlows.ts
export interface Topic {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  icon: string;
  color: string;
  questions: Array<{
    en: string;
    vi: string;
  }>;
}

// The 5 main topics with their questions
export const TOPICS: Topic[] = [
  {
    id: 'land_prep',
    title: {
      en: 'Land prep & seeding',
      vi: 'Làm đất & gieo sạ'
    },
    icon: '🌾',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    questions: [
      {
        en: 'Do I really need laser land leveling? What\'s the benefit for me?',
        vi: 'Có cần thiết phải san phẳng laser không? Lợi ích cụ thể là gì?'
      },
      {
        en: 'How long before direct seeding should I drain water after land prep?',
        vi: 'Sau khi làm đất, tôi nên rút nước trước gieo sạ bao lâu?'
      },
      {
        en: 'What\'s the maximum seed rate I should use with mechanized seeding?',
        vi: 'Khi gieo sạ cơ giới, lượng giống tối đa nên dùng là bao nhiêu?'
      },
      {
        en: 'What capacity can a 6‑row pneumatic seeder cover in a day?',
        vi: 'Máy sạ khí động 6 hàng một ngày sạ được bao nhiêu?'
      },
      {
        en: 'Is wide–narrow row pattern better than even spacing?',
        vi: 'Sạ hàng rộng–hẹp có lợi gì so với khoảng cách đều?'
      }
    ]
  },
  {
    id: 'water_fert',
    title: {
      en: 'Water & fertilizer',
      vi: 'Nước & phân bón'
    },
    icon: '💧',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    questions: [
      {
        en: 'When do I start AWD and how do I know when to irrigate?',
        vi: 'Bắt đầu AWD khi nào và làm sao biết lúc cần tưới?'
      },
      {
        en: 'In the first week after sowing, should the field be flooded?',
        vi: 'Tuần đầu sau sạ có cần giữ ruộng ngập không?'
      },
      {
        en: 'What total N‑P‑K do I target on alluvial soil?',
        vi: 'Tổng N‑P‑K khuyến cáo trên đất phù sa là bao nhiêu?'
      },
      {
        en: 'How should I adjust N in Summer–Autumn compared with Winter–Spring?',
        vi: 'Vụ Hè–Thu có cần giảm đạm so với Đông–Xuân không?'
      },
      {
        en: 'If I use a seeder that incorporates fertilizer, can I reduce nitrogen?',
        vi: 'Dùng máy sạ vùi phân thì có thể giảm lượng đạm không?'
      }
    ]
  },
  {
    id: 'pest',
    title: {
      en: 'Pest management',
      vi: 'Quản lý dịch hại'
    },
    icon: '🐛',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    questions: [
      {
        en: 'I see brown planthoppers—should I spray now?',
        vi: 'Có rầy nâu trên ruộng—tôi có nên phun ngay không?'
      },
      {
        en: 'What does IPM mean for my farm?',
        vi: 'IPM nghĩa là gì với ruộng của tôi?'
      },
      {
        en: 'If I must spray, what are the \'4 Rights\'?',
        vi: 'Nếu buộc phải phun, \'4 đúng\' là gì?'
      },
      {
        en: 'Should I spray on a fixed schedule to prevent pests?',
        vi: 'Có nên phun định kỳ để phòng sâu bệnh không?'
      },
      {
        en: 'Any safety/timing tips if spraying is needed?',
        vi: 'Nếu cần phun thì có lưu ý gì về an toàn và thời điểm không?'
      }
    ]
  },
  {
    id: 'harvest',
    title: {
      en: 'Harvest & storage',
      vi: 'Thu hoạch & bảo quản'
    },
    icon: '🌾',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    questions: [
      {
        en: 'When is the optimal harvest time?',
        vi: 'Thời điểm thu hoạch tối ưu là khi nào?'
      },
      {
        en: 'Why use a combine instead of hand harvesting?',
        vi: 'Vì sao nên dùng máy gặt đập liên hợp thay vì gặt tay?'
      },
      {
        en: 'How soon must I dry paddy after harvest?',
        vi: 'Sau thu hoạch bao lâu phải sấy lúa?'
      },
      {
        en: 'What are safe moisture targets for storage?',
        vi: 'Độ ẩm an toàn để bảo quản là bao nhiêu?'
      },
      {
        en: 'If it rains during harvest, what should I do?',
        vi: 'Nếu gặp mưa lúc thu hoạch thì xử lý thế nào?'
      }
    ]
  },
  {
    id: 'straw',
    title: {
      en: 'Straw handling',
      vi: 'Xử lý rơm rạ'
    },
    icon: '♻️',
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    questions: [
      {
        en: 'How long can straw stay on dry fields after harvest?',
        vi: 'Rơm có thể để trên ruộng khô tối đa bao lâu sau thu hoạch?'
      },
      {
        en: 'What should I do with straw on wet fields?',
        vi: 'Rơm trên ruộng ướt nên xử lý thế nào?'
      },
      {
        en: 'Which baler suits wet fields better?',
        vi: 'Loại máy cuốn rơm nào phù hợp ruộng ướt hơn?'
      },
      {
        en: 'Is burning straw a problem? What nutrients are lost?',
        vi: 'Đốt rơm có hại không? Mất những dinh dưỡng gì?'
      },
      {
        en: 'How does straw fit a circular pathway back to the field?',
        vi: 'Rơm tham gia vòng tuần hoàn trở lại đồng ruộng như thế nào?'
      }
    ]
  },
  {
    id: 'demos',
    title: {
      en: 'Expert Demos',
      vi: 'Ví dụ chuyên gia'
    },
    icon: '🎓',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    questions: [
      {
        en: 'I sowed rice on January 1 and kept water about 5 cm deep for the first 10 days. When should I start AWD?',
        vi: 'Tôi gieo lúa ngày 1/1 và giữ nước sâu 5 cm trong 10 ngày đầu. Khi nào nên bắt đầu AWD?'
      },
      {
        en: 'My AWD tube shows the water level is −8 cm. The soil surface looks dry but no cracks yet. Should I wait longer before irrigating?',
        vi: 'Ống đo AWD cho thấy mực nước là −8 cm. Mặt ruộng đã khô nhưng chưa nứt. Tôi có nên chờ thêm trước khi tưới không?'
      },
      {
        en: 'I already applied my first round of fertilizer 10 days after sowing. When should I plan the next one?',
        vi: 'Tôi đã bón đợt phân đầu tiên 10 ngày sau sạ. Khi nào nên bón đợt tiếp theo?'
      },
      {
        en: 'I have an LCC but I\'m not sure how to use it. When should I start checking the leaf color?',
        vi: 'Tôi có bảng so màu lá (LCC) nhưng chưa biết dùng thế nào. Khi nào nên bắt đầu kiểm tra màu lá?'
      },
      {
        en: 'After several cool and wet nights, I noticed gray spindle-shaped spots on my rice leaves. Is this leaf blast?',
        vi: 'Sau vài đêm mát ẩm, tôi thấy những vết xám hình thoi trên lá lúa. Có phải bệnh đạo ôn lá không?'
      },
      {
        en: 'The water in my canal measures about 3‰ salinity this week. Can I still use it for irrigation?',
        vi: 'Nước trong kênh đo được khoảng 3‰ độ mặn tuần này. Tôi có thể dùng để tưới không?'
      },
      {
        en: 'I\'m planning my next crop in Soc Trang, where we have mild salinity and a short dry season. Which rice varieties should I choose?',
        vi: 'Tôi dự định vụ tới ở Sóc Trăng, nơi có nhiễm mặn nhẹ và mùa khô ngắn. Nên chọn giống lúa nào?'
      },
      {
        en: 'I\'m uploading photos of my rice field. Please check if there\'s any pest problem.',
        vi: 'Tôi đang tải lên một số hình ảnh ruộng lúa của mình. Hãy kiểm tra xem có sâu bệnh gì không.'
      }
    ]
  }
];

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  messagesCount: number;
}

export function SuggestedQuestions({ onSelectQuestion, messagesCount }: SuggestedQuestionsProps) {
  const { language } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const texts = {
    EN: {
      chooseTopicTitle: 'Choose a topic:',
      chooseTopicSubtitle: 'Or type your own question below 👇',
      questions: 'questions',
      backToTopics: 'Back to topics',
      moreQuestions: 'More questions',
      exampleQuestions: '💡 Example questions',
      popularTopics: '📚 Popular topics',
      tapToExpand: 'Tap to see questions'
    },
    VI: {
      chooseTopicTitle: 'Chọn chủ đề:',
      chooseTopicSubtitle: 'Hoặc gõ câu hỏi riêng bên dưới 👇',
      questions: 'câu hỏi',
      backToTopics: 'Về danh sách chủ đề',
      moreQuestions: 'Câu hỏi mẫu',
      exampleQuestions: '💡 Câu hỏi mẫu',
      popularTopics: '📚 Chủ đề phổ biến',
      tapToExpand: 'Chạm để xem câu hỏi'
    }
  };

  const t = texts[language];

  const handleQuestionClick = (question: { en: string; vi: string }) => {
    const questionText = language === 'EN' ? question.en : question.vi;
    onSelectQuestion(questionText);
    setSelectedTopic(null);
    setSheetOpen(false);
  };

  // Only show initial view if it's the first message (welcome message)
  const showInitialView = messagesCount === 1;

  // Topic Cards View
  const TopicCards = () => (
    <div className="space-y-2 py-2">
      <div className="text-center space-y-0.5 px-3">
        <h3 className="text-responsive-base font-medium">{t.chooseTopicTitle}</h3>
        <p className="text-responsive-xs text-muted-foreground">{t.chooseTopicSubtitle}</p>
      </div>
      
      <div className="px-3">
        <div className="grid grid-cols-3 gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`
                ${topic.color}
                border-2 rounded-lg
                flex flex-col items-center justify-center gap-1
                transition-all duration-200
                active:scale-95
                min-h-[90px] p-2
              `}
            >
              <span className="text-2xl">{topic.icon}</span>
              <span className="text-[10px] font-medium text-center leading-tight px-1">
                {language === 'EN' ? topic.title.en : topic.title.vi}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Questions List View
  const QuestionsList = () => (
    <div className="space-y-2 py-2">
      <div className="px-3 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-1 text-xs h-8 px-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {t.backToTopics}
        </Button>
      </div>

      {selectedTopic && (
        <>
          <div className="px-3 text-center space-y-0.5">
            <div className="text-2xl">{selectedTopic.icon}</div>
            <h3 className="text-responsive-base font-medium">
              {language === 'EN' ? selectedTopic.title.en : selectedTopic.title.vi}
            </h3>
          </div>

          <div className="px-3 space-y-1.5">
            {selectedTopic.questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="
                  w-full min-h-[48px] p-3
                  bg-white border-2 border-border rounded-lg
                  text-left
                  hover:border-primary hover:bg-accent
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                <p className="text-responsive-xs leading-snug">
                  {language === 'EN' ? question.en : question.vi}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Bottom Sheet with Tabs
  const BottomSheetView = () => {
    const [activeTabId, setActiveTabId] = useState<string>(TOPICS[0].id);
    const activeTopic = TOPICS.find(t => t.id === activeTabId) || TOPICS[0];

    return (
      <div className="flex flex-col h-full">
        {/* Icon Tabs - Horizontally Scrollable */}
        <div className="flex-shrink-0 border-b border-border pb-1.5 relative">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTabId(topic.id)}
                  className={`
                    flex flex-col items-center gap-0.5 p-2 rounded-lg min-w-[64px]
                    transition-all duration-200 flex-shrink-0
                    ${activeTabId === topic.id ? 'bg-accent border-2 border-primary' : 'hover:bg-accent/50 border-2 border-transparent'}
                  `}
                >
                  <span className={`text-xl ${activeTabId === topic.id ? 'scale-110' : ''}`}>
                    {topic.icon}
                  </span>
                  <span className="text-[9px] font-medium text-center leading-tight whitespace-nowrap">
                    {language === 'EN' ? topic.title.en.split(' ')[0] : topic.title.vi.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Gradient fade indicator on right edge */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none" />
        </div>

        {/* Questions for Active Tab - Scrollable */}
        <div className="flex-1 overflow-y-auto mt-3 px-3">
          <div className="space-y-1.5 pb-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
              {language === 'EN' ? activeTopic.title.en : activeTopic.title.vi}
            </h3>
            {activeTopic.questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="
                  w-full min-h-[48px] p-3
                  bg-white border border-border rounded-lg
                  text-left text-responsive-xs leading-snug
                  hover:border-primary hover:bg-accent
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                {language === 'EN' ? question.en : question.vi}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  if (showInitialView) {
    // Show topic cards or questions list in main chat area
    return (
      <div className="w-full max-w-2xl mx-auto">
        {selectedTopic ? <QuestionsList /> : <TopicCards />}
      </div>
    );
  }

  // After conversation starts, show floating pill button with bottom sheet
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="
            fixed bottom-20 left-1/2 -translate-x-1/2
            z-40
            shadow-lg
            bg-background
            hover:bg-accent
            border-2
            px-3 py-1.5
            gap-1.5
            h-9
          "
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{t.exampleQuestions}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] max-h-[600px] rounded-t-2xl flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-center text-base">
            {t.popularTopics}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden mt-3">
          <BottomSheetView />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Contextual suggestions after assistant message
interface ContextualSuggestionsProps {
  suggestions: Array<{ en: string; vi: string }>;
  onSelectQuestion: (question: string) => void;
  topicTitle?: { en: string; vi: string };
}

export function ContextualSuggestions({ 
  suggestions, 
  onSelectQuestion,
  topicTitle 
}: ContextualSuggestionsProps) {
  const { language } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || suggestions.length === 0) return null;

  const texts = {
    EN: {
      relatedQuestions: 'Related questions:',
      seeAll: 'See all',
      questions: 'questions'
    },
    VI: {
      relatedQuestions: 'Câu hỏi liên quan:',
      seeAll: 'Xem tất cả',
      questions: 'câu hỏi'
    }
  };

  const t = texts[language];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3">
      <div className="space-y-2 bg-accent/30 rounded-xl p-3 border border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            💬 {t.relatedQuestions}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-background rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((question, index) => (
            <button
              key={index}
              onClick={() => onSelectQuestion(language === 'EN' ? question.en : question.vi)}
              className="
                w-full min-h-[48px] p-3
                bg-background border border-border rounded-lg
                text-left text-sm
                hover:border-primary hover:bg-accent
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              {language === 'EN' ? question.en : question.vi}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
