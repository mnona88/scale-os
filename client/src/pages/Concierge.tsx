import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Mic, MicOff, RotateCcw } from "lucide-react";
import { Streamdown } from "streamdown";

const businessTypes = [
  { value: "clinic", label: "Medical Clinic" },
  { value: "realestate", label: "Real Estate" },
  { value: "retail", label: "Retail" },
  { value: "restaurant", label: "Restaurant" },
  { value: "general", label: "General Business" },
];

const starterPrompts = [
  "My minimum wage costs are killing my margins. What can I do?",
  "How much time does AI actually save in a business like mine?",
  "I'm worried about California's new labor laws. How does Scale OS help?",
  "Can you walk me through what automation would look like for my business?",
  "What's the typical return on investment I can expect?",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Concierge() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [businessType, setBusinessType] = useState("general");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const chat = trpc.concierge.chat.useMutation({
    onSuccess: (data) => {
      const content = typeof data.content === "string" ? data.content : String(data.content);
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    },
    onError: () => {
      toast.error("Connection issue. Please try again.");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chat.isPending]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    chat.mutate({ messages: newMessages, businessType });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      toast.error("Voice recognition error. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const resetConversation = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="page-enter flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div className="border-b border-border/40 bg-card flex-shrink-0">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-primary mb-3">24/7 AI Concierge</p>
              <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
                Ask anything about your business.
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Speak or type. This is how Scale OS responds to your customers — around the clock.
              </p>
            </div>

            {/* Business Type Selector */}
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {businessTypes.map((bt) => (
                <button
                  key={bt.value}
                  onClick={() => setBusinessType(bt.value)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-body transition-all duration-150 touch-target ${
                    businessType === bt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {bt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="ql-card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-display text-sm">S</span>
                  </div>
                  <div>
                    <p className="font-body text-sm text-foreground leading-relaxed">
                      Good day. I'm your Scale OS advisor. I understand that California's rising labor costs are putting real pressure on businesses like yours — and I'm here to help you see a clear path forward.
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                      What's weighing on you most right now? You can speak or type your question below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Starter Prompts */}
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-3 px-1">Common questions from South Bay owners</p>
                <div className="space-y-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-150 touch-target"
                    >
                      <p className="font-body text-sm text-foreground">{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-foreground font-display text-xs">S</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/60"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="font-body text-sm text-foreground leading-relaxed prose prose-sm max-w-none">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                    ) : (
                      <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {chat.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-display text-xs">S</span>
                  </div>
                  <div className="bg-card border border-border/60 rounded-xl px-4 py-3">
                    <div className="flex gap-1 items-center h-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border/40 bg-card/95 backdrop-blur-sm">
        <div className="container py-4 max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your margins, staffing costs, or how automation works..."
                className="font-body text-sm resize-none min-h-[48px] max-h-32 pr-4 touch-target"
                rows={1}
              />
            </div>

            {/* Voice Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVoice}
              className={`flex-shrink-0 touch-target bg-card h-12 w-12 ${isRecording ? "border-destructive text-destructive recording-pulse" : ""}`}
              title={isRecording ? "Stop recording" : "Speak your question"}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {/* Send Button */}
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || chat.isPending}
              size="icon"
              className="flex-shrink-0 touch-target h-12 w-12"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {messages.length > 0 && (
            <div className="flex justify-center mt-3">
              <button
                onClick={resetConversation}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Start a new conversation
              </button>
            </div>
          )}

          {isRecording && (
            <p className="text-center text-xs text-destructive font-body mt-2 animate-pulse">
              Listening... speak your question now
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
