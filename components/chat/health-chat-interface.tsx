"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Send, Loader2 } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HealthChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat-health",
  })

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Health Assistant</h1>
        <p className="text-muted-foreground">Ask me anything about your health and wellness</p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                <Brain className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">How can I help you today?</h3>
              <p className="mb-6 max-w-md text-sm text-muted-foreground">
                I can help you understand your health metrics, provide wellness advice, and answer health-related
                questions based on your data.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleInputChange({ target: { value: "What do my recent health metrics indicate?" } } as any)
                  }}
                >
                  Analyze my metrics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleInputChange({ target: { value: "Give me tips to improve my sleep quality" } } as any)
                  }}
                >
                  Sleep tips
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleInputChange({ target: { value: "What exercises are good for my health?" } } as any)
                  }}
                >
                  Exercise advice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleInputChange({ target: { value: "How can I manage stress better?" } } as any)
                  }}
                >
                  Stress management
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your health..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
