import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function JarvisChat() {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState("");
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
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      }]);
    },
    onError: () => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: language === "uz" ? 
          "Kechirasiz, hozirda xizmat mavjud emas. Iltimos, keyinroq urinib ko'ring." :
          language === "ru" ?
          "Извините, сервис временно недоступен. Пожалуйста, попробуйте позже." :
          "Sorry, service is temporarily unavailable. Please try again later.",
        isUser: false,
        timestamp: new Date()
      }]);
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

  return (
    <section id="jarvis" className="py-16 bg-primary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4">
            {t("chat-title")}
          </h3>
          <p className="text-blue-100 text-lg">
            {t("chat-desc")}
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-gray-800">
              <Bot className="mr-2 h-5 w-5 text-primary" />
              Jarvis AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${msg.isUser ? "justify-end" : ""}`}
                >
                  {!msg.isUser && (
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-3 shadow-sm max-w-xs lg:max-w-md ${
                    msg.isUser 
                      ? "bg-primary text-white" 
                      : "bg-white text-gray-800"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  
                  {msg.isUser && (
                    <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t">
              <div className="flex space-x-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chat-placeholder")}
                  className="flex-1"
                  disabled={chatMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || chatMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
