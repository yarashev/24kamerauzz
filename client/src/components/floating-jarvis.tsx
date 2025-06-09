import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, MessageCircle, X, Minimize2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function FloatingJarvis() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: language === "uz" ? 
        "Salom! Men Jarvis, sizning AI yordamchingizman. Kameralar va xavfsizlik tizimlari bo'yicha har qanday savolingizga javob bera olaman. Qanday yordam kerak?" :
        language === "ru" ?
        "Привет! Я Джарвис, ваш ИИ-помощник. Я могу ответить на любые вопросы о камерах и системах безопасности. Чем могу помочь?" :
        "Hello! I'm Jarvis, your AI assistant. I can answer any questions about cameras and security systems. How can I help?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/chat", { message: userMessage });
      return response.json();
    },
    onSuccess: (data) => {
      const newMessage = {
        id: Date.now().toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Show notification if chat is closed or minimized
      if (!isOpen || isMinimized) {
        setHasNewMessage(true);
      }
    },
    onError: () => {
      const errorMessage = {
        id: Date.now().toString(),
        content: language === "uz" ? 
          "Kechirasiz, hozirda xizmat mavjud emas. Iltimos, keyinroq urinib ko'ring." :
          language === "ru" ?
          "Извините, сервис временно недоступен. Пожалуйста, попробуйте позже." :
          "Sorry, service is temporarily unavailable. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Show notification if chat is closed or minimized
      if (!isOpen || isMinimized) {
        setHasNewMessage(true);
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    const userMessage = message.trim();
    if (!userMessage) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    }]);

    setMessage("");
    chatMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          className="relative w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          {hasNewMessage && (
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 animate-pulse">
              <span className="sr-only">New message</span>
            </Badge>
          )}
        </Button>
        
        {/* Floating tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            {language === "uz" && "Jarvis yordamchi"}
            {language === "ru" && "Помощник Джарвис"}
            {language === "en" && "Jarvis Assistant"}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      </div>
    );
  }

  // Minimized chat header
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-xl border-primary/20">
          <CardHeader 
            className="bg-primary text-white p-3 cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={handleMaximize}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">Jarvis AI</CardTitle>
                  <p className="text-xs text-blue-100">
                    {language === "uz" && "Onlayn"}
                    {language === "ru" && "Онлайн"}
                    {language === "en" && "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {hasNewMessage && (
                  <Badge className="w-3 h-3 p-0 bg-red-500 animate-pulse">
                    <span className="sr-only">New message</span>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Full chat widget
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 shadow-xl border-primary/20 flex flex-col">
        {/* Chat Header */}
        <CardHeader className="bg-primary text-white p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm">Jarvis AI</CardTitle>
                <p className="text-xs text-blue-100">
                  {language === "uz" && "Onlayn"}
                  {language === "ru" && "Онлайн"}
                  {language === "en" && "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={handleMinimize}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${msg.isUser ? "justify-end" : ""}`}
              >
                {!msg.isUser && (
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3" />
                  </div>
                )}
                
                <div className={`rounded-lg p-2 shadow-sm max-w-[200px] ${
                  msg.isUser 
                    ? "bg-primary text-white" 
                    : "bg-white text-gray-800"
                }`}>
                  <p className="text-xs leading-relaxed">{msg.content}</p>
                </div>
                
                {msg.isUser && (
                  <div className="bg-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "uz" ? "Xabar yozing..." :
                  language === "ru" ? "Напишите сообщение..." :
                  "Type a message..."
                }
                className="flex-1 text-sm"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || chatMutation.isPending}
                className="bg-primary hover:bg-primary/90 px-3"
                size="sm"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}