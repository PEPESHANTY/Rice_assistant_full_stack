import React, { useState, useRef } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useApp } from './AppContext';
import { 
  MessageSquare, 
  Mic, 
  Camera, 
  Send, 
  Volume2,
  BookOpen,
  Bell,
  Languages,
  Loader2,
  User,
  Bot,
  Image as ImageIcon,
  MicOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  inputType: 'text' | 'voice' | 'image';
  timestamp: Date;
  context?: {
    farmStage?: string;
    weather?: string;
    plotInfo?: string;
  };
}

export function Assistant() {
  const { user, language, weather, addJournalEntry, addTask } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: language === 'EN' 
        ? "Hello! I'm your AI farming assistant. I can help you with rice cultivation questions, provide weather-based advice, and assist with farm management. How can I help you today?"
        : "Xin chào! Tôi là trợ lý AI nông nghiệp của bạn. Tôi có thể giúp bạn với các câu hỏi về trồng lúa, tư vấn dựa trên thời tiết và hỗ trợ quản lý trang trại. Hôm nay tôi có thể giúp gì cho bạn?",
      inputType: 'text',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeInputType, setActiveInputType] = useState<'text' | 'voice' | 'image'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const texts = {
    EN: {
      assistant: 'AI Assistant',
      description: 'Get expert advice and answers to your farming questions',
      textInput: 'Text Input',
      voiceInput: 'Voice Input',
      imageInput: 'Image Input',
      askQuestion: 'Ask a question...',
      send: 'Send',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      uploadImage: 'Upload Image',
      quickActions: 'Quick Actions',
      saveToJournal: 'Save to Journal',
      createReminder: 'Create Reminder',
      translate: 'Translate',
      playAudio: 'Play Audio',
      suggestions: 'Suggestions',
      weatherBased: 'Weather-based advice',
      cropStage: 'Crop stage guidance',
      pestControl: 'Pest control tips',
      fertilizer: 'Fertilizer recommendations',
      typeMessage: 'Type your message here...'
    },
    VI: {
      assistant: 'Trợ Lý AI',
      description: 'Nhận tư vấn chuyên gia và câu trả lời cho các câu hỏi nông nghiệp',
      textInput: 'Nhập Văn Bản',
      voiceInput: 'Nhập Giọng Nói',
      imageInput: 'Nhập Hình Ảnh',
      askQuestion: 'Đặt câu hỏi...',
      send: 'Gửi',
      startRecording: 'Bắt Đầu Ghi Âm',
      stopRecording: 'Dừng Ghi Âm',
      uploadImage: 'Tải Hình Ảnh',
      quickActions: 'Thao Tác Nhanh',
      saveToJournal: 'Lưu Vào Nhật Ký',
      createReminder: 'Tạo Nhắc Nhở',
      translate: 'Dịch',
      playAudio: 'Phát Âm Thanh',
      suggestions: 'Gợi Ý',
      weatherBased: 'Tư vấn dựa trên thời tiết',
      cropStage: 'Hướng dẫn giai đoạn cây trồng',
      pestControl: 'Mẹo phòng trừ sâu bệnh',
      fertilizer: 'Khuyến nghị phân bón',
      typeMessage: 'Nhập tin nhắn của bạn ở đây...'
    }
  };

  const t = texts[language];

  const suggestions = [
    {
      en: "What's the best fertilizer for rice at 30 days after sowing?",
      vi: "Loại phân bón nào tốt nhất cho lúa sau 30 ngày gieo?"
    },
    {
      en: "How to identify and treat brown planthopper?",
      vi: "Cách nhận biết và điều trị rầy nâu?"
    },
    {
      en: "When should I drain the field for harvest?",
      vi: "Khi nào nên tháo nước ruộng để thu hoạch?"
    },
    {
      en: "How does the weather affect my rice crop?",
      vi: "Thời tiết ảnh hưởng thế nào đến cây lúa của tôi?"
    }
  ];

  const mockResponses = {
    fertilizer: {
      en: "At 30 days after sowing, your rice plants are in the tillering stage. I recommend applying NPK fertilizer (16-20-0) at 50-60 kg/ha. This will promote healthy tiller development. Based on current weather conditions, apply early morning or late evening to avoid nutrient loss.",
      vi: "Sau 30 ngày gieo, cây lúa của bạn đang ở giai đoạn đẻ nhánh. Tôi khuyên nên bón phân NPK (16-20-0) với liều lượng 50-60 kg/ha. Điều này sẽ thúc đẩy phát triển nhánh khỏe mạnh. Dựa vào điều kiện thời tiết hiện tại, nên bón vào sáng sớm hoặc chiều tối để tránh mất chất dinh dưỡng."
    },
    pest: {
      en: "Brown planthopper appears as small brown insects on rice stems. Signs include yellowing leaves and stunted growth. For treatment: 1) Use insecticides like imidacloprid (17.8% SL), 2) Maintain proper water levels, 3) Remove weeds that harbor pests. Apply treatment during cool hours.",
      vi: "Rầy nâu xuất hiện như những côn trùng nhỏ màu nâu trên thân lúa. Dấu hiệu gồm lá vàng và sinh trưởng chậm lại. Cách điều trị: 1) Sử dụng thuốc trừ sâu như imidacloprid (17.8% SL), 2) Duy trì mức nước thích hợp, 3) Loại bỏ cỏ dại chỗ trú ẩn của sâu bệnh. Phun thuốc vào giờ mát."
    },
    harvest: {
      en: "Drain your rice field 7-10 days before harvest when grains are 80-85% mature (golden yellow color). This allows the soil to firm up for easier harvesting and prevents grain quality loss. Monitor grain moisture - ideal harvest moisture is 20-25%.",
      vi: "Tháo nước ruộng lúa 7-10 ngày trước thu hoạch khi hạt chín 80-85% (màu vàng óng). Điều này giúp đất chắc hơn để thu hoạch dễ dàng và tránh mất chất lượng hạt. Theo dõi độ ẩm hạt - độ ẩm thu hoạch lý tưởng là 20-25%."
    },
    weather: {
      en: "Based on the current weather forecast showing rain in the next 2 days, I recommend: 1) Postpone fertilizer application until after rain, 2) Check drainage systems, 3) Monitor for fungal diseases in high humidity, 4) Consider pest management as rain can increase pest activity.",
      vi: "Dựa trên dự báo thời tiết hiện tại cho thấy mưa trong 2 ngày tới, tôi khuyến nghị: 1) Hoãn bón phân cho đến sau mưa, 2) Kiểm tra hệ thống thoát nước, 3) Theo dõi bệnh nấm trong độ ẩm cao, 4) Cân nhắc quản lý sâu bệnh vì mưa có thể tăng hoạt động sâu bệnh."
    }
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('fertilizer') || message.includes('phân')) {
      return mockResponses.fertilizer[language];
    } else if (message.includes('pest') || message.includes('planthopper') || message.includes('rầy') || message.includes('sâu')) {
      return mockResponses.pest[language];
    } else if (message.includes('harvest') || message.includes('drain') || message.includes('thu hoạch') || message.includes('tháo nước')) {
      return mockResponses.harvest[language];
    } else if (message.includes('weather') || message.includes('thời tiết')) {
      return mockResponses.weather[language];
    } else {
      return language === 'EN' 
        ? "I understand your question about rice farming. Based on your farm's current stage and local conditions, I recommend consulting with local agricultural experts for specific guidance. You can also check the latest research from IRRI (International Rice Research Institute) for best practices."
        : "Tôi hiểu câu hỏi của bạn về trồng lúa. Dựa trên giai đoạn hiện tại của trang trại và điều kiện địa phương, tôi khuyên bạn nên tham khảo ý kiến chuyên gia nông nghiệp địa phương để có hướng dẫn cụ thể. Bạn cũng có thể kiểm tra nghiên cứu mới nhất từ IRRI (Viện Nghiên cứu Lúa Quốc tế) về các phương pháp hay nhất.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      inputType: activeInputType,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        inputType: 'text',
        timestamp: new Date(),
        context: {
          farmStage: user?.farms[0]?.plots[0] ? '30 days after sowing' : undefined,
          weather: weather?.current.condition,
          plotInfo: user?.farms[0]?.plots[0]?.name
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    setActiveInputType('voice');
    // Mock voice input
    setTimeout(() => {
      if (isRecording) {
        setInput("How to apply fertilizer for rice plants?");
        setIsRecording(false);
        toast.success('Voice recorded successfully');
      }
    }, 3000);
  };

  const handleImageInput = () => {
    setActiveInputType('image');
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock image analysis
      setInput("I uploaded an image of my rice plants. What do you think about their condition?");
      toast.success('Image uploaded successfully');
    }
  };

  const handleSaveToJournal = (content: string) => {
    if (user?.farms[0]?.plots[0]) {
      addJournalEntry({
        plotId: user.farms[0].plots[0].id,
        type: 'other',
        title: 'AI Assistant Advice',
        content: content,
        date: new Date().toISOString(),
        photos: []
      });
      toast.success('Saved to journal!');
    }
  };

  const handleCreateReminder = (content: string) => {
    if (user?.farms[0]?.plots[0]) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      addTask({
        plotId: user.farms[0].plots[0].id,
        title: 'Follow AI Advice',
        description: content.substring(0, 100) + '...',
        dueDate: tomorrow.toISOString(),
        completed: false,
        type: 'other'
      });
      toast.success('Reminder created!');
    }
  };

  const handleSuggestionClick = (suggestion: { en: string; vi: string }) => {
    setInput(language === 'EN' ? suggestion.en : suggestion.vi);
    setActiveInputType('text');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Add extra padding-bottom on mobile to account for bottom nav */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.assistant}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Chat with AI Assistant
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={activeInputType === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveInputType('text')}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {t.textInput}
                    </Button>
                    <Button
                      variant={activeInputType === 'voice' ? 'default' : 'outline'}
                      size="sm"
                      onClick={handleVoiceInput}
                    >
                      {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                      {t.voiceInput}
                    </Button>
                    <Button
                      variant={activeInputType === 'image' ? 'default' : 'outline'}
                      size="sm"
                      onClick={handleImageInput}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      {t.imageInput}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                      </div>
                      <div className={`rounded-lg px-4 py-3 ${
                        message.type === 'user' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white border shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 text-xs opacity-70">
                            {message.inputType === 'voice' && <Mic className="h-3 w-3" />}
                            {message.inputType === 'image' && <ImageIcon className="h-3 w-3" />}
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                          {message.type === 'assistant' && (
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleSaveToJournal(message.content)}
                              >
                                <BookOpen className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleCreateReminder(message.content)}
                              >
                                <Bell className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-white border shadow-sm rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-gray-500">Assistant is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    {activeInputType === 'text' && (
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.typeMessage}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                    )}
                    {activeInputType === 'voice' && (
                      <div className="flex items-center justify-center h-10 bg-gray-100 rounded-md">
                        {isRecording ? (
                          <span className="text-red-600 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Recording...
                          </span>
                        ) : (
                          <span className="text-gray-500">Click microphone to start recording</span>
                        )}
                      </div>
                    )}
                    {activeInputType === 'image' && (
                      <div className="flex items-center justify-center h-10 bg-gray-100 rounded-md">
                        <span className="text-gray-500">Click camera to upload image</span>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t.saveToJournal}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  {t.createReminder}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Languages className="h-4 w-4 mr-2" />
                  {t.translate}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Volume2 className="h-4 w-4 mr-2" />
                  {t.playAudio}
                </Button>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t.suggestions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {language === 'EN' ? suggestion.en : suggestion.vi}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Context Info */}
            {user?.farms[0]?.plots[0] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Farm Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Current Plot:</span>
                    <p className="text-gray-600">{user.farms[0].plots[0].name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Rice Variety:</span>
                    <p className="text-gray-600">{user.farms[0].plots[0].riceVariety}</p>
                  </div>
                  {weather && (
                    <div>
                      <span className="font-medium">Weather:</span>
                      <p className="text-gray-600">{weather.current.condition}, {weather.current.temperature}°C</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}