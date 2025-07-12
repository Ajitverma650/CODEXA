import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        // Add user message to chat
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }]
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Sorry, I encountered an error. Please try again later." }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Quick questions to help users get started
    const quickQuestions = [
        `Explain the problem: "${problem.title}"`,
        `What's the optimal approach for this problem?`,
        `Give me a hint for "${problem.title}"`,
        `What are edge cases I should consider?`,
        `Show me a sample solution in JavaScript`
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-primary-focus p-4 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-white text-primary p-2 rounded-full">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                        <p className="text-primary-content text-opacity-80 text-sm">
                            Ask anything about "{problem.title}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-base-100 space-y-4">
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="bg-base-200 p-6 rounded-2xl max-w-md w-full">
                            <div className="bg-primary text-primary-content p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">How can I help you today?</h3>
                            <p className="text-base-content text-opacity-70 mb-6">
                                Ask questions about the problem, request hints, or get help debugging your code.
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        className="btn btn-outline btn-sm justify-start text-left whitespace-normal h-auto py-2"
                                        onClick={() => reset({ message: question })}
                                    >
                                        <span className="flex-1">{question}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 ${
                                msg.role === "user"
                                    ? "bg-primary text-primary-content rounded-br-none"
                                    : "bg-base-200 border border-base-300 rounded-bl-none"
                            }`}
                        >
                            <div className="flex items-start gap-2 mb-1">
                                {msg.role === "model" ? (
                                    <Bot size={16} className="mt-0.5 flex-shrink-0" />
                                ) : (
                                    <User size={16} className="mt-0.5 flex-shrink-0" />
                                )}
                                <span className="font-semibold">
                                    {msg.role === "model" ? "CodeBot" : "You"}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap mt-2">
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-base-200 border border-base-300 rounded-2xl rounded-bl-none p-4 max-w-[85%]">
                            <div className="flex items-center gap-2 mb-1">
                                <Bot size={16} />
                                <span className="font-semibold">CodeBot</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-base-300 bg-base-100">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Ask a question about the problem..."
                        className="flex-1 input input-bordered"
                        {...register("message", { required: true, minLength: 2 })}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}
                        disabled={isLoading}
                    >
                        <Send size={20} />
                    </button>
                </form>
                <div className="mt-2 flex items-center text-xs text-base-content text-opacity-50">
                    <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                    <span>AI responses may contain inaccuracies. Always verify solutions.</span>
                </div>
            </div>
        </div>
    );
}

export default ChatAi;