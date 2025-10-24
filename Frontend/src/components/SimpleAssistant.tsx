import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useApp } from './AppContext';
import { 
  MessageSquare, 
  Mic, 
  Camera, 
  Send, 
  User,
  Bot,
  MicOff,
  CalendarDays,
  MapPin,
  BookOpen,
  ExternalLink, 
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { qaData, type QAPair } from '../data/AIRRVie_QA';
import { DateWithLunar } from './DateWithLunar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { irriChatFlows, type Citation, type ChatFlow } from '../data/irriChatFlows';
import { getImageAnalysisResponse } from '../data/imageAnalysisResponses';
import { SuggestedQuestions } from './SuggestedQuestions';
import riceFieldPestImage from 'figma:asset/80df1cbebc908d5aefcfa12c7c2197861a3fe22b.png';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  content_en?: string;  // English version
  content_vi?: string;  // Vietnamese version
  citation?: string;
  citation_en?: string;
  citation_vi?: string;
  citations?: Citation[];
  inputType: 'text' | 'voice' | 'image';
  timestamp: Date;
  isTyping?: boolean;
  imageUrl?: string;  // For displaying uploaded images
}

export function SimpleAssistant() {
  const { user, language } = useApp();
  const navigate = useNavigate();
  const isGuest = !user;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your rice farming assistant powered by IRRI knowledge. I provide expert guidance from IRRI handbooks on rice cultivation, pest management, water management, fertilizers, and more. Ask me questions or browse suggested topics below!",
      content_en: "Hello! I'm your rice farming assistant powered by IRRI knowledge. I provide expert guidance from IRRI handbooks on rice cultivation, pest management, water management, fertilizers, and more. Ask me questions or browse suggested topics below!",
      content_vi: "Xin chào! Tôi là trợ lý trồng lúa được hỗ trợ bởi kiến thức IRRI. Tôi cung cấp hướng dẫn chuyên môn từ sổ tay IRRI về canh tác lúa, quản lý sâu bệnh, quản lý nước, phân bón và nhiều hơn nữa. Hãy hỏi tôi hoặc xem các chủ đề gợi ý bên dưới!",
      inputType: 'text',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeInputType, setActiveInputType] = useState<'text' | 'voice' | 'image'>('text');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<{ flow: ChatFlow; currentIndex: number } | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update message content display when language changes
  useEffect(() => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.content_en && msg.content_vi) {
          return {
            ...msg,
            content: language === 'EN' ? msg.content_en : msg.content_vi,
            citation: msg.citation_en && msg.citation_vi 
              ? (language === 'EN' ? msg.citation_en : msg.citation_vi)
              : msg.citation
          };
        }
        return msg;
      })
    );
  }, [language]);

  const texts = {
    EN: {
      assistant: 'Rice Farming Assistant',
      description: 'Ask questions about rice farming and get expert guidance',
      chatHeader: 'Chat with Assistant',
      chatSubtitle: 'Ask any question about rice farming, or tap a suggestion below.',
      textInput: 'Text',
      voiceInput: 'Voice',
      imageInput: 'Photo',
      typeMessage: 'Type your question here...',
      send: 'Send',
      listening: 'Listening...',
      analyzing: 'Analyzing photo...',
      typing: 'Typing...',
      suggestions: 'Suggested Questions',
      guestMode: 'Guest Mode',
      backToHome: '← Back to Home',
      signUp: 'Sign Up to Save'
    },
    VI: {
      assistant: 'Trợ Lý Trồng Lúa',
      description: 'Đặt câu hỏi về trồng lúa và nhận hướng dẫn chuyên môn',
      chatHeader: 'Trò chuyện với Trợ Lý',
      chatSubtitle: 'Hỏi bất kỳ câu hỏi nào về trồng lúa, hoặc chọn gợi ý bên dưới.',
      textInput: 'Gõ',
      voiceInput: 'Giọng Nói',
      imageInput: 'Ảnh',
      typeMessage: 'Nhập câu hỏi của bạn tại đây...',
      send: 'Gửi',
      listening: 'Đang nghe...',
      analyzing: 'Đang phân tích ảnh...',
      typing: 'Đang gõ...',
      suggestions: 'Câu Hỏi Gợi Ý',
      guestMode: 'Chế Độ Khách',
      backToHome: '← Về Trang Chủ',
      signUp: 'Đăng Ký Để Lưu',
      noMatch: "Tôi không có thông tin cụ thể về điều đó trong cơ sở kiến thức. Bạn có thể diễn đạt lại câu hỏi hoặc hỏi về canh tác lúa, quản lý sâu bệnh, phân bón, quản lý nước, hoặc thực hành thu hoạch?",
      conversationActive: "💬 Đang trong cuộc trò chuyện - Đặt câu hỏi tiếp theo",
    }
  };

  const t = texts[language];

  // Get suggested questions - combine IRRI flows and QA data
  const suggestedQuestions = useMemo(() => {
    const irriQuestions: string[] = [];
    
    // Get first user question from each IRRI flow
    if (irriChatFlows?.flows && Array.isArray(irriChatFlows.flows)) {
      irriChatFlows.flows.forEach(flow => {
        if (flow?.messages && Array.isArray(flow.messages)) {
          const firstUserMsg = flow.messages.find(msg => msg?.role === 'user');
          if (firstUserMsg?.text_en && firstUserMsg?.text_vi) {
            const questionText = language === 'EN' ? firstUserMsg.text_en : firstUserMsg.text_vi;
            if (questionText) {
              irriQuestions.push(questionText);
            }
          }
        }
      });
    }
    
    // Add 3 questions from QA data
    let qaQuestions: string[] = [];
    if (qaData && Array.isArray(qaData)) {
      qaQuestions = qaData
        .slice(0, 3)
        .map(qa => {
          if (qa?.question?.en && qa?.question?.vi) {
            return language === 'EN' ? qa.question.en : qa.question.vi;
          }
          return null;
        })
        .filter((q): q is string => q !== null);
    }
    
    return [...irriQuestions, ...qaQuestions].filter(Boolean);
  }, [language]);

  // Find bilingual version of a user question
  const findBilingualQuestion = (question: string): { en: string; vi: string } => {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Check IRRI flow questions first (most likely matches)
    for (const flow of irriChatFlows.flows) {
      for (const message of flow.messages) {
        if (message.role === 'user') {
          const enLower = message.text_en.toLowerCase();
          const viLower = message.text_vi.toLowerCase();
          
          // Check for exact or very close matches
          if (enLower === normalizedQuestion || viLower === normalizedQuestion) {
            return { en: message.text_en, vi: message.text_vi };
          }
          
          // Check if question contains or is contained by the flow question
          if (enLower.includes(normalizedQuestion) || normalizedQuestion.includes(enLower) ||
              viLower.includes(normalizedQuestion) || normalizedQuestion.includes(viLower)) {
            return { en: message.text_en, vi: message.text_vi };
          }
        }
      }
    }
    
    // Check QA data
    for (const qa of qaData) {
      const enLower = qa.question.en.toLowerCase();
      const viLower = qa.question.vi.toLowerCase();
      
      if (enLower === normalizedQuestion || viLower === normalizedQuestion ||
          enLower.includes(normalizedQuestion) || normalizedQuestion.includes(enLower) ||
          viLower.includes(normalizedQuestion) || normalizedQuestion.includes(viLower)) {
        return { en: qa.question.en, vi: qa.question.vi };
      }
    }
    
    // If no match found, return the original question for both
    // (In a real app, you'd call a translation API here)
    return { en: question, vi: question };
  };

  // Calculate similarity score for better matching
  const calculateSimilarity = (question1: string, question2: string): number => {
    const words1 = question1.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const words2 = question2.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    let matchCount = 0;
    for (const word of words1) {
      if (words2.some(w => w.includes(word) || word.includes(w))) {
        matchCount++;
      }
    }
    
    return matchCount / Math.max(words1.length, 1);
  };

  // Check if question should trigger a full conversation flow
  const findMatchingFlow = (userQuestion: string): ChatFlow | null => {
    const normalizedQuestion = userQuestion.toLowerCase().trim();
    const keywords = normalizedQuestion.split(/\s+/).filter(w => w.length > 3);
    
    // FIRST PRIORITY: Check for exact or very high similarity matches in DEMO flows only
    // This ensures Expert Demo questions always match the demo flows first
    const demoFlows = irriChatFlows.flows.filter(f => f.topic && f.topic.includes('demo'));
    
    for (const flow of demoFlows) {
      const firstUserMsg = flow.messages.find(msg => msg.role === 'user');
      if (firstUserMsg) {
        const questionEn = firstUserMsg.text_en.toLowerCase();
        const questionVi = firstUserMsg.text_vi.toLowerCase();
        
        // Check for exact match
        if (normalizedQuestion === questionEn || normalizedQuestion === questionVi) {
          console.log('✅ Exact match found in demo flow:', flow.id);
          return flow;
        }
        
        // Check for very high similarity (>0.75) in demo flows
        const scoreEn = calculateSimilarity(normalizedQuestion, questionEn);
        const scoreVi = calculateSimilarity(normalizedQuestion, questionVi);
        const score = Math.max(scoreEn, scoreVi);
        
        if (score > 0.75) {
          console.log('✅ High similarity match in demo flow:', flow.id, 'score:', score);
          return flow;
        }
      }
    }
    
    // SECOND PRIORITY: Check for keyword matches in all flows
    // Keyword mapping for detecting conversation topics
    const keywordMap: { [key: string]: string[] } = {
      'flow_awd_watering': ['water', 'watering', 'awd', 'irrigation', 'irrigate', 'flood', 'flooding', 'dry', 'drying', 'wet', 'wetting', 'moisture', 'drain', 'schedule', 'lịch', 'tưới', 'nước', 'khô', 'ướt', 'ngập'],
      'flow_fertilizer_plan': ['fertilizer', 'fertiliser', 'nutrient', 'nitrogen', 'phosphorus', 'potassium', 'lime', 'soil', 'amendment', 'plan', 'planning', 'phân', 'bón', 'đạm', 'lân', 'kali', 'vôi', 'kế', 'hoạch'],
      'flow_ipm_pesticide': ['pest', 'insect', 'spray', 'spraying', 'pesticide', 'insecticide', 'planthopper', 'hopper', 'brown', 'control', 'ipm', 'threshold', 'rầy', 'sâu', 'bệnh', 'thuốc', 'phun', 'trừ', 'kiểm', 'soát']
    };
    
    // Check for high-confidence keyword matches (need at least 2 keyword matches for flow trigger)
    for (const flow of irriChatFlows.flows) {
      const flowKeywords = keywordMap[flow.id] || flow.topic;
      const matchCount = keywords.filter(keyword => 
        flowKeywords.some(flowKeyword => 
          keyword.includes(flowKeyword.toLowerCase()) || 
          flowKeyword.toLowerCase().includes(keyword)
        )
      ).length;
      
      // Trigger full conversation if we have strong keyword match
      if (matchCount >= 2) {
        return flow;
      }
    }
    
    // THIRD PRIORITY: Check for moderate similarity matches in all flows
    for (const flow of irriChatFlows.flows) {
      const firstUserMsg = flow.messages.find(msg => msg.role === 'user');
      if (firstUserMsg) {
        const questionEn = firstUserMsg.text_en.toLowerCase();
        const questionVi = firstUserMsg.text_vi.toLowerCase();
        
        const scoreEn = calculateSimilarity(normalizedQuestion, questionEn);
        const scoreVi = calculateSimilarity(normalizedQuestion, questionVi);
        const score = Math.max(scoreEn, scoreVi);
        
        // Moderate similarity triggers the full conversation
        if (score > 0.6) {
          return flow;
        }
      }
    }
    
    return null;
  };

  // Find matching answer from data - ONLY for perfect matches
  const findPerfectMatch = (userQuestion: string): { answer: string; answer_en?: string; answer_vi?: string; citation?: string; citation_en?: string; citation_vi?: string; citations?: Citation[] } | null => {
    const normalizedQuestion = userQuestion.toLowerCase().trim();
    
    // Check IRRI chat flows for PERFECT matches only (>0.95 similarity or exact match)
    let bestMatch: { answer_en: string; answer_vi: string; citations?: Citation[]; score: number } | null = null;
    
    for (const flow of irriChatFlows.flows) {
      for (let i = 0; i < flow.messages.length; i++) {
        const message = flow.messages[i];
        if (message.role === 'user') {
          const questionEn = message.text_en.toLowerCase();
          const questionVi = message.text_vi.toLowerCase();
          
          // Check for exact match first
          if (questionEn === normalizedQuestion || questionVi === normalizedQuestion) {
            const responseMessage = flow.messages[i + 1];
            if (responseMessage && responseMessage.role === 'assistant') {
              return {
                answer: language === 'EN' ? responseMessage.text_en : responseMessage.text_vi,
                answer_en: responseMessage.text_en,
                answer_vi: responseMessage.text_vi,
                citations: responseMessage.citations
              };
            }
          }
          
          // Calculate similarity scores for near-perfect matches
          const scoreEn = calculateSimilarity(normalizedQuestion, questionEn);
          const scoreVi = calculateSimilarity(normalizedQuestion, questionVi);
          const score = Math.max(scoreEn, scoreVi);
          
          // Only consider near-perfect matches (>0.95 similarity)
          if (score > 0.95 && (!bestMatch || score > bestMatch.score)) {
            const responseMessage = flow.messages[i + 1];
            if (responseMessage && responseMessage.role === 'assistant') {
              bestMatch = {
                answer_en: responseMessage.text_en,
                answer_vi: responseMessage.text_vi,
                citations: responseMessage.citations,
                score: score
              };
            }
          }
        }
      }
    }
    
    // Return if we found a near-perfect IRRI match
    if (bestMatch) {
      return {
        answer: language === 'EN' ? bestMatch.answer_en : bestMatch.answer_vi,
        answer_en: bestMatch.answer_en,
        answer_vi: bestMatch.answer_vi,
        citations: bestMatch.citations
      };
    }
    
    // Check QA data for exact matches only
    const match = qaData.find(qa => {
      const questionEn = qa.question.en.toLowerCase();
      const questionVi = qa.question.vi.toLowerCase();
      
      // Only exact matches
      return questionEn === normalizedQuestion || questionVi === normalizedQuestion;
    });
    
    if (match) {
      return { 
        answer: language === 'EN' ? match.answer.en : match.answer.vi,
        answer_en: match.answer.en,
        answer_vi: match.answer.vi,
        citation: language === 'EN' ? match.citation.en : match.citation.vi,
        citation_en: match.citation.en,
        citation_vi: match.citation.vi
      };
    }
    
    // No perfect match found - return null to use ChatGPT
    return null;
  };

  // Typing animation effect
  const simulateTyping = (messageId: string, fullText: string, options?: { 
    citation?: string; 
    citation_en?: string; 
    citation_vi?: string; 
    citations?: Citation[];
    content_en?: string;
    content_vi?: string;
  }) => {
    let currentIndex = 0;
    setTypingMessageId(messageId);
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const charsToAdd = Math.min(3, fullText.length - currentIndex);
        currentIndex += charsToAdd;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: fullText.substring(0, currentIndex), isTyping: true }
              : msg
          )
        );
      } else {
        clearInterval(typingInterval);
        setTypingMessageId(null);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  content: fullText, 
                  content_en: options?.content_en,
                  content_vi: options?.content_vi,
                  citation: options?.citation, 
                  citation_en: options?.citation_en,
                  citation_vi: options?.citation_vi,
                  citations: options?.citations, 
                  isTyping: false 
                }
              : msg
          )
        );
      }
    }, 30);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const questionAsked = input;
    // Get bilingual version of the question
    const bilingualQuestion = findBilingualQuestion(questionAsked);

    // Check if this is the pest detection demo question that needs an image
    const isPestPhotoQuestion = 
      questionAsked.toLowerCase().includes("uploading photos") ||
      questionAsked.toLowerCase().includes("tải lên") ||
      questionAsked.toLowerCase().includes("hình ảnh ruộng");

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: questionAsked,
      content_en: bilingualQuestion.en,
      content_vi: bilingualQuestion.vi,
      inputType: activeInputType,
      timestamp: new Date(),
      imageUrl: isPestPhotoQuestion ? riceFieldPestImage : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // First, check if we're continuing an active flow
    if (activeFlow) {
      // Check if the user's question matches the next expected question in the flow
      const nextUserMsgIndex = activeFlow.currentIndex;
      
      if (nextUserMsgIndex < activeFlow.flow.messages.length) {
        const expectedMsg = activeFlow.flow.messages[nextUserMsgIndex];
        
        if (expectedMsg.role === 'user') {
          const expectedEn = expectedMsg.text_en.toLowerCase();
          const expectedVi = expectedMsg.text_vi.toLowerCase();
          const userQuestionLower = questionAsked.toLowerCase();
          
          // Check if user's question matches (loosely)
          const isMatch = userQuestionLower.includes(expectedEn.substring(0, 20)) ||
                         expectedEn.includes(userQuestionLower.substring(0, 20)) ||
                         userQuestionLower.includes(expectedVi.substring(0, 20)) ||
                         expectedVi.includes(userQuestionLower.substring(0, 20)) ||
                         calculateSimilarity(userQuestionLower, expectedEn) > 0.3 ||
                         calculateSimilarity(userQuestionLower, expectedVi) > 0.3;
          
          if (isMatch) {
            // Continue with the flow - show next assistant response
            const nextAssistantMsgIndex = nextUserMsgIndex + 1;
            
            if (nextAssistantMsgIndex < activeFlow.flow.messages.length) {
              const assistantMsg = activeFlow.flow.messages[nextAssistantMsgIndex];
              
              if (assistantMsg.role === 'assistant') {
                setTimeout(() => {
                  setIsLoading(false);
                  
                  const content = language === 'EN' ? assistantMsg.text_en : assistantMsg.text_vi;
                  const assistantMessageId = `flow-${activeFlow.flow.id}-${nextAssistantMsgIndex}-${Date.now()}`;
                  const assistantMessage: Message = {
                    id: assistantMessageId,
                    type: 'assistant',
                    content: '',
                    content_en: assistantMsg.text_en,
                    content_vi: assistantMsg.text_vi,
                    citations: assistantMsg.citations,
                    inputType: 'text',
                    timestamp: new Date(),
                    isTyping: true
                  };
                  
                  setMessages(prev => [...prev, assistantMessage]);
                  simulateTyping(assistantMessageId, content, {
                    content_en: assistantMsg.text_en,
                    content_vi: assistantMsg.text_vi,
                    citations: assistantMsg.citations
                  });
                  
                  // Update flow position
                  setActiveFlow({
                    flow: activeFlow.flow,
                    currentIndex: nextAssistantMsgIndex + 1
                  });
                  
                  // Check if we've reached the end of the flow
                  if (nextAssistantMsgIndex + 1 >= activeFlow.flow.messages.length) {
                    // End of flow
                    setTimeout(() => setActiveFlow(null), 1000);
                  }
                }, 1000);
                return;
              }
            }
          }
        }
      }
      
      // If we get here, the question didn't match the flow - end the flow and handle normally
      setActiveFlow(null);
    }
    
    // Check if this question should start a new conversation flow
    const matchingFlow = findMatchingFlow(questionAsked);
    
    if (matchingFlow) {
      // Check if this is a "demo" flow (Expert Demo) that should show follow-up questions
      const isDemoFlow = matchingFlow.topic && Array.isArray(matchingFlow.topic) && matchingFlow.topic.includes('demo');
      console.log('🔍 Flow detection:', { flowId: matchingFlow.id, topic: matchingFlow.topic, isDemoFlow });
      
      // Show a subtle notification that we're loading expert guidance
      toast.info(
        language === 'EN' 
          ? 'Loading IRRI expert guidance...'
          : 'Đang tải hướng dẫn chuyên gia IRRI...',
        { duration: 2000 }
      );
      
      // Find the first assistant message in the flow
      setTimeout(() => {
        // Skip the first user message and show only the first assistant response
        let firstAssistantIndex = matchingFlow.messages.findIndex(msg => msg.role === 'assistant');
        
        if (firstAssistantIndex !== -1) {
          const assistantMsg = matchingFlow.messages[firstAssistantIndex];
          const content = language === 'EN' ? assistantMsg.text_en : assistantMsg.text_vi;
          const messageId = `flow-${matchingFlow.id}-${firstAssistantIndex}-${Date.now()}`;
          
          // For pest detection flow, include the rice field image in the response
          const isPestDetectionFlow = matchingFlow.id === 'bph_flow_pest_05_v2';
          
          const message: Message = {
            id: messageId,
            type: 'assistant',
            content: '',
            content_en: assistantMsg.text_en,
            content_vi: assistantMsg.text_vi,
            citations: assistantMsg.citations,
            inputType: 'text',
            timestamp: new Date(),
            isTyping: true,
            imageUrl: isPestDetectionFlow ? riceFieldPestImage : undefined
          };
          
          setMessages(prev => [...prev, message]);
          
          // ONLY set active flow for demo flows (Expert Demos)
          // Set this BEFORE starting typing animation and turning off loading
          if (isDemoFlow) {
            console.log('✅ Setting activeFlow:', { flowId: matchingFlow.id, currentIndex: firstAssistantIndex + 1, totalMessages: matchingFlow.messages.length });
            setActiveFlow({
              flow: matchingFlow,
              currentIndex: firstAssistantIndex + 1
            });
          } else {
            console.log('❌ NOT setting activeFlow (not a demo flow)');
          }
          
          // Set isLoading to false AFTER setting activeFlow
          setIsLoading(false);
          
          simulateTyping(messageId, content, {
            content_en: assistantMsg.text_en,
            content_vi: assistantMsg.text_vi,
            citations: assistantMsg.citations
          });
        }
      }, 1000);
      return;
    }

    // If no flow match, check for perfect match first, otherwise use ChatGPT
    setTimeout(async () => {
      const perfectMatch = findPerfectMatch(questionAsked);
      
      // If we found a PERFECT match in IRRI data, use it
      if (perfectMatch) {
        // Show subtle notification that IRRI knowledge is being used
        toast.success(
          language === 'EN' 
            ? '📚 Found in IRRI Knowledge Base'
            : '📚 Tìm thấy trong Cơ sở Kiến thức IRRI',
          { duration: 2000 }
        );
        
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
          id: assistantMessageId,
          type: 'assistant',
          content: '',
          content_en: perfectMatch?.answer_en,
          content_vi: perfectMatch?.answer_vi,
          citation: perfectMatch?.citation || '',
          citation_en: perfectMatch?.citation_en,
          citation_vi: perfectMatch?.citation_vi,
          inputType: 'text',
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        
        // Start typing animation
        const responseText = perfectMatch.answer;
        const citation = perfectMatch?.citation;
        const citations = perfectMatch?.citations;
        simulateTyping(assistantMessageId, responseText, {
          content_en: perfectMatch?.answer_en,
          content_vi: perfectMatch?.answer_vi,
          citation: citation,
          citation_en: perfectMatch?.citation_en,
          citation_vi: perfectMatch?.citation_vi,
          citations: citations
        });
      } else {
        // No match found in IRRI knowledge base
        setIsLoading(false);
        
        const noMatchMessageEn = "I couldn't find an answer to that question in the IRRI knowledge base. Please try:\n\n• Asking about rice cultivation, pest management, water management, or fertilizers\n• Browsing the suggested questions below\n• Rephrasing your question\n\nI'm specialized in providing IRRI expert guidance on rice farming topics.";
        
        const noMatchMessageVi = "Tôi không tìm thấy câu trả lời cho câu hỏi đó trong cơ sở kiến thức IRRI. Vui lòng thử:\n\n• Hỏi về canh tác lúa, quản lý sâu bệnh, quản lý nước, hoặc phân bón\n• Xem các câu hỏi gợi ý bên dưới\n• Đặt lại câu hỏi theo cách khác\n\nTôi chuyên cung cấp hướng dẫn chuyên môn từ IRRI về các chủ đề trồng lúa.";
        
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
          id: assistantMessageId,
          type: 'assistant',
          content: '',
          content_en: noMatchMessageEn,
          content_vi: noMatchMessageVi,
          inputType: 'text',
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        const responseText = language === 'EN' ? noMatchMessageEn : noMatchMessageVi;
        simulateTyping(assistantMessageId, responseText, {
          content_en: noMatchMessageEn,
          content_vi: noMatchMessageVi
        });
      }
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    setActiveInputType('voice');
    if (!isRecording) {
      setTimeout(() => {
        setInput("What is AWD method?");
        setIsRecording(false);
        toast.success(language === 'EN' ? 'Voice recorded successfully' : 'Ghi âm thành công');
      }, 2500);
    }
  };

  const handleImageInput = () => {
    setActiveInputType('image');
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Get the analysis response based on filename
      const analysisResponse = getImageAnalysisResponse(file.name);
      
      // Create object URL for displaying the image
      const imageUrl = URL.createObjectURL(file);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: language === 'EN' 
          ? "Can you analyze this rice plant image?"
          : "Bạn có thể phân tích hình ảnh cây lúa này không?",
        content_en: "Can you analyze this rice plant image?",
        content_vi: "Bạn có thể phân tích hình ảnh cây lúa này không?",
        inputType: 'image',
        timestamp: new Date(),
        imageUrl: imageUrl
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      setTimeout(() => {
        const assistantMessageId = (Date.now() + 1).toString();
        
        // Use detected response or fallback to generic response
        let responseEn: string;
        let responseVi: string;
        let citationEn: string;
        let citationVi: string;
        
        if (analysisResponse) {
          responseEn = analysisResponse.response.en;
          responseVi = analysisResponse.response.vi;
          citationEn = "(IRRI Image Analysis - Expert Guidance)";
          citationVi = "(Phân tích Ảnh IRRI - Hướng dẫn Chuyên gia)";
          
          // Show toast with detected condition
          toast.success(
            language === 'EN' 
              ? `Detected: ${analysisResponse.condition}`
              : `Phát hiện: ${analysisResponse.condition === 'Brown Plant Hopper Infestation' ? 'Rầy nâu' :
                  analysisResponse.condition === 'Brown Spot Disease' ? 'Bệnh đốm nâu' :
                  analysisResponse.condition === 'Golden Apple Snail Damage' ? 'Tác hại ốc bươu vàng' :
                  analysisResponse.condition === 'Healthy Rice Crop' ? 'Lúa khỏe mạnh' :
                  analysisResponse.condition}`,
            { duration: 3000 }
          );
        } else {
          // Fallback response for unrecognized images
          responseEn = "I can see a rice field image, but I cannot clearly identify the specific condition. For the most accurate diagnosis, please:\n\n1. Take a clear, well-lit photo\n2. Focus on affected areas (leaves, stems, or pests)\n3. Upload photos named with condition prefixes:\n   - 'bph_' for brown planthopper\n   - 'bs_' for brown spot disease\n   - 'gas_' for golden apple snail\n   - 'h_' for healthy rice\n\nOr describe the symptoms you're seeing, and I can help identify the problem.";
          responseVi = "Tôi có thể thấy hình ảnh ruộng lúa, nhưng không thể xác định rõ tình trạng cụ thể. Để chẩn đoán chính xác nhất, vui lòng:\n\n1. Chụp ảnh rõ nét, đủ ánh sáng\n2. Tập trung vào vùng bị ảnh hưởng (lá, thân hoặc sâu bệnh)\n3. Tải ảnh có tên bắt đầu với:\n   - 'bph_' cho rầy nâu\n   - 'bs_' cho bệnh đốm nâu\n   - 'gas_' cho ốc bươu vàng\n   - 'h_' cho lúa khỏe mạnh\n\nHoặc mô tả các triệu chứng bạn thấy, tôi có thể giúp xác định vấn đề.";
          citationEn = "(AI Image Analysis)";
          citationVi = "(Phân tích Ảnh AI)";
        }
        
        const responseText = language === 'EN' ? responseEn : responseVi;
        
        const assistantMessage: Message = {
          id: assistantMessageId,
          type: 'assistant',
          content: '',
          content_en: responseEn,
          content_vi: responseVi,
          inputType: 'text',
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        
        simulateTyping(assistantMessageId, responseText, {
          content_en: responseEn,
          content_vi: responseVi,
          citation: language === 'EN' ? citationEn : citationVi,
          citation_en: citationEn,
          citation_vi: citationVi
        });
      }, 2000);
      
      toast.success(language === 'EN' ? 'Photo uploaded successfully' : 'Tải ảnh lên thành công');
    }
  };



  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setActiveInputType('text');
    setSelectedSuggestion(suggestion);
    
    // Clear selection after a moment
    setTimeout(() => setSelectedSuggestion(null), 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLoadConversation = (flow: ChatFlow) => {
    // Clear existing messages except the welcome message
    const welcomeMessage = messages[0];
    const newMessages: Message[] = [welcomeMessage];
    
    // Add only the first user question and first assistant response
    // The user will need to manually type follow-up questions
    const firstUserMsg = flow.messages.find(msg => msg.role === 'user');
    const firstAssistantMsg = flow.messages.find(msg => msg.role === 'assistant');
    
    if (firstUserMsg) {
      const userMessage: Message = {
        id: `flow-${flow.id}-user-0`,
        type: 'user',
        content: language === 'EN' ? firstUserMsg.text_en : firstUserMsg.text_vi,
        content_en: firstUserMsg.text_en,
        content_vi: firstUserMsg.text_vi,
        inputType: 'text',
        timestamp: new Date()
      };
      newMessages.push(userMessage);
    }
    
    if (firstAssistantMsg) {
      const assistantMessage: Message = {
        id: `flow-${flow.id}-assistant-0`,
        type: 'assistant',
        content: language === 'EN' ? firstAssistantMsg.text_en : firstAssistantMsg.text_vi,
        content_en: firstAssistantMsg.text_en,
        content_vi: firstAssistantMsg.text_vi,
        citations: firstAssistantMsg.citations,
        inputType: 'text',
        timestamp: new Date(Date.now() + 1000)
      };
      newMessages.push(assistantMessage);
    }
    
    setMessages(newMessages);
    
    // Set active flow so user can continue with follow-up questions
    const firstAssistantIndex = flow.messages.findIndex(msg => msg.role === 'assistant');
    if (firstAssistantIndex !== -1) {
      setActiveFlow({
        flow: flow,
        currentIndex: firstAssistantIndex + 1
      });
    }
    
    // Show success toast
    toast.success(
      language === 'EN' 
        ? 'Example conversation loaded! You can continue asking questions.'
        : 'Đã tải hội thoại mẫu! Bạn có thể tiếp tục đặt câu hỏi.'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Top Navigation */}
      {user ? (
        <Navigation />
      ) : (
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center py-2 sm:py-3">
              <div className="flex items-center">
                <div>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">Rice Assistant</span>
                  <Badge variant="secondary" className="ml-2 text-xs">{t.guestMode}</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-2 sm:px-3"
                >
                  {t.backToHome}
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      {/* Main Content Container */}
      <div className={`w-full mx-auto px-2 sm:px-3 lg:px-4 ${user ? 'pb-20 lg:pb-4' : 'pb-3'}`}>
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Page Header - Only show when user is logged in */}
          {user && (
            <div className="pt-4 sm:pt-6 mb-4 sm:mb-6 px-2">
              <h1 className="text-3xl font-bold text-gray-900">{t.assistant}</h1>
            </div>
          )}
          <div className="flex">
            {/* Chat Content - Full Width */}
            <div className="flex-1">
              {/* Chat with Assistant Card */}
          <Card 
            className="shadow-md mb-6"
            style={{
              borderRadius: '12px',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            {/* Chat Header */}
            <CardHeader 
              className="pb-2 flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
                padding: '10px 12px',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-700 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5">
                    {t.chatHeader}
                  </h3>
                  <p className="text-xs text-green-600 font-medium mt-0.5 sm:mt-1 mb-1 sm:mb-2">
                    {t.description}
                  </p>
                  
                  {/* Date & Location Info - Only show for logged-in users */}
                  {user && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1.5 sm:pt-2 border-t border-gray-100">
                      {/* Date */}
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                        <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 flex-shrink-0" />
                        <DateWithLunar 
                          date={new Date().toISOString().split('T')[0]} 
                          className="text-xs text-orange-700 font-medium"
                        />
                      </div>
                      
                      {/* Location */}
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="text-xs text-blue-700 font-medium truncate max-w-[120px] sm:max-w-[180px]">
                          {user?.farms[0]?.location || (language === 'EN' ? 'Mekong Delta, VN' : 'ĐBSCL, VN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="border-t border-gray-100">
                <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-1.5 sm:gap-2`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div 
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm ${
                              message.type === 'user' ? 'bg-green-600 text-white' : 'bg-white border-2 border-blue-600'
                            }`}
                          >
                            {message.type === 'user' ? (
                              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            ) : (
                              <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                            )}
                          </div>
                        </div>
                        
                        {/* Message Bubble */}
                        <div 
                          className={`rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 shadow-sm ${
                            message.type === 'user' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          {/* Display image if present */}
                          {message.imageUrl && (
                            <div className={`mb-2.5 rounded-lg overflow-hidden border-2 shadow-lg ${
                              message.type === 'user' 
                                ? 'border-green-300' 
                                : 'border-blue-300'
                            }`}>
                              <img 
                                src={message.imageUrl} 
                                alt={message.type === 'user' ? 'Uploaded rice field' : 'Pest detection analysis'} 
                                className="w-full rounded-lg"
                                style={{ maxHeight: '280px', objectFit: 'cover' }}
                              />
                              <div className={`px-2 py-1.5 border-t ${
                                message.type === 'user'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}>
                                <p className={`text-xs italic flex items-center gap-1 ${
                                  message.type === 'user' ? 'text-green-700' : 'text-blue-700'
                                }`}>
                                  <Camera className="w-3 h-3" />
                                  {message.type === 'user' 
                                    ? (language === 'EN' ? 'Photo attached' : 'Đã đính kèm ảnh')
                                    : (language === 'EN' ? 'Pest detection result' : 'Kết quả phát hiện sâu bệnh')
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-xs sm:text-sm leading-snug sm:leading-relaxed mb-0 whitespace-pre-wrap">
                            {message.content}
                          </p>
                          
                          {/* Old style citation (simple text) */}
                          {message.citation && !message.isTyping && (
                            <div 
                              className={`mt-1.5 pt-1.5 border-t text-xs italic ${
                                message.type === 'user' ? 'border-green-500 text-green-100' : 'border-gray-200 text-gray-500'
                              }`}
                            >
                              {message.citation}
                            </div>
                          )}
                          
                          {/* IRRI Citations with popups */}
                          {message.citations && message.citations.length > 0 && !message.isTyping && (
                            <div className="mt-2 pt-2 border-t border-blue-100">
                              <div className="flex flex-wrap gap-1.5 items-start">
                                {message.citations.map((citation, citIdx) => (
                                  <Popover key={citIdx}>
                                    <PopoverTrigger asChild>
                                      <button
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                        style={{
                                          padding: '3px 8px',
                                          borderRadius: '6px',
                                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                          border: '1px solid rgba(59, 130, 246, 0.25)'
                                        }}
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
                                          <span className="font-medium">
                                            {language === 'EN' ? 'Source: IRRI CGSpace' : 'Nguồn: IRRI CGSpace'}
                                          </span>
                                        </a>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Timestamp */}
                          <div 
                            className={`flex items-center gap-1 mt-1 text-xs ${
                              message.type === 'user' ? 'text-green-100' : 'text-gray-400'
                            }`}
                          >
                            {message.inputType === 'voice' && <Mic className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                            {message.inputType === 'image' && <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                            <span className="hidden sm:inline text-xs">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{t.typing}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Flow Follow-up Questions - Show next question if we're in an active flow */}
                  {!isLoading && activeFlow && activeFlow.currentIndex < activeFlow.flow.messages.length && (() => {
                    // Find the next user question in the flow
                    const nextMsg = activeFlow.flow.messages[activeFlow.currentIndex];
                    console.log('🔘 Button render check:', { isLoading, hasActiveFlow: !!activeFlow, currentIndex: activeFlow?.currentIndex, totalMessages: activeFlow?.flow.messages.length, nextMsgRole: nextMsg?.role });
                    if (nextMsg && nextMsg.role === 'user') {
                      const questionText = language === 'EN' ? nextMsg.text_en : nextMsg.text_vi;
                      return (
                        <div className="flex justify-start mb-3">
                          <div className="max-w-[85%]">
                            <div className="mb-1.5 px-2">
                              <p className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                                <span>💬</span>
                                <span>{language === 'EN' ? 'Continue conversation:' : 'Tiếp tục hội thoại:'}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setInput(questionText);
                                setActiveInputType('text');
                                setTimeout(() => {
                                  handleSendMessage();
                                }, 100);
                              }}
                              className="w-full text-left bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                                {questionText}
                              </p>
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Suggested Questions Component */}
                  <SuggestedQuestions 
                    onSelectQuestion={(question) => {
                      setInput(question);
                      setActiveInputType('text');
                      // Auto-send the question after a brief moment
                      setTimeout(() => {
                        const event = { preventDefault: () => {} };
                        handleSendMessage();
                      }, 100);
                    }}
                    messagesCount={messages.length}
                  />
                  
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Input Area - Always visible at bottom */}
              <div className="bg-white border-t border-gray-100" style={{ padding: 'clamp(10px, 2.5vw, 14px)' }}>
                {/* Action Buttons Row */}
                <div className="flex mb-2" style={{ gap: 'clamp(6px, 1.5vw, 8px)' }}>
                  <Button
                    variant={activeInputType === 'text' ? 'default' : 'outline'}
                    onClick={() => setActiveInputType('text')}
                    className={`flex-1 ${activeInputType === 'text' ? 'bg-green-700 hover:bg-green-800 border-2 border-green-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    style={{
                      minHeight: 'clamp(42px, 10vw, 46px)',
                      borderRadius: '8px',
                      padding: 'clamp(6px, 1.5vw, 8px)',
                      fontSize: 'clamp(12px, 3vw, 14px)'
                    }}
                  >
                    <MessageSquare style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }} className="sm:mr-1.5" />
                    <span className="hidden sm:inline">{t.textInput}</span>
                  </Button>
                  <Button
                    variant={activeInputType === 'voice' ? 'default' : 'outline'}
                    onClick={handleVoiceInput}
                    className={`flex-1 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-500' 
                        : activeInputType === 'voice'
                          ? 'bg-green-700 hover:bg-green-800 border-2 border-green-700'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      minHeight: 'clamp(42px, 10vw, 46px)',
                      borderRadius: '8px',
                      padding: 'clamp(6px, 1.5vw, 8px)',
                      fontSize: 'clamp(12px, 3vw, 14px)'
                    }}
                  >
                    {isRecording ? (
                      <MicOff style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }} className="sm:mr-1.5 animate-pulse" />
                    ) : (
                      <Mic style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }} className="sm:mr-1.5" />
                    )}
                    <span className="hidden sm:inline">{isRecording ? t.listening : t.voiceInput}</span>
                  </Button>
                  <Button
                    variant={activeInputType === 'image' ? 'default' : 'outline'}
                    onClick={handleImageInput}
                    className={`flex-1 ${activeInputType === 'image' ? 'bg-green-700 hover:bg-green-800 border-2 border-green-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    style={{
                      minHeight: 'clamp(42px, 10vw, 46px)',
                      borderRadius: '8px',
                      padding: 'clamp(6px, 1.5vw, 8px)',
                      fontSize: 'clamp(12px, 3vw, 14px)'
                    }}
                  >
                    <Camera style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }} className="sm:mr-1.5" />
                    <span className="hidden sm:inline">{t.imageInput}</span>
                  </Button>
                </div>

                {/* Text Input & Send */}
                <div className="flex" style={{ gap: 'clamp(6px, 1.5vw, 8px)' }}>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.typeMessage}
                    disabled={isLoading || isRecording || typingMessageId !== null}
                    className="flex-1 resize-none bg-gray-50 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{
                      minHeight: 'clamp(50px, 12vw, 56px)',
                      maxHeight: 'clamp(50px, 12vw, 56px)',
                      borderRadius: '10px',
                      padding: 'clamp(10px, 2.5vw, 12px)',
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      lineHeight: '1.4'
                    }}
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading || typingMessageId !== null}
                    className="bg-green-600 hover:bg-green-700 self-end"
                    style={{
                      minHeight: 'clamp(50px, 12vw, 56px)',
                      minWidth: 'clamp(50px, 12vw, 56px)',
                      borderRadius: '10px',
                      padding: 'clamp(10px, 2.5vw, 12px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Send style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} className="sm:mr-1.5" />
                    <span className="hidden sm:inline" style={{ fontSize: 'clamp(13px, 3vw, 15px)' }}>{t.send}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
