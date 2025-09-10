import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import {
  MessageCircle,
  FileText,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  User,
  Bot,
  X,
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdvisorPanel = () => {
  const {
    advisorInteractions,
    chatWithAdvisor,
    getStructuredFeedback,
    resolveInteraction,
  } = useProject();

  const [activeAdvisor, setActiveAdvisor] = useState('editor');
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const advisors = [
    {
      id: 'editor',
      name: 'Editor',
      description: 'Story structure & narrative flow',
      color: '#667eea',
      icon: FileText,
    },
    {
      id: 'copyeditor',
      name: 'Copy Editor',
      description: 'Grammar, style & clarity',
      color: '#10b981',
      icon: FileText,
    },
    {
      id: 'reader',
      name: 'Reader',
      description: 'Audience perspective & engagement',
      color: '#f59e0b',
      icon: User,
    },
  ];

  useEffect(() => {
    // Load chat history for current advisor
    const currentAdvisorChats = advisorInteractions.filter(
      (interaction) =>
        interaction.advisorRole === activeAdvisor &&
        interaction.interactionType === 'chat' &&
        !interaction.resolved // Only show unresolved (active) interactions
    );

    // Parse chat messages
    const messages = [];
    currentAdvisorChats.forEach((interaction) => {
      const content = interaction.content;

      // Split content into user and advisor parts
      const parts = content.split(/\n(?=(?:User|Advisor): )/);

      parts.forEach((part) => {
        const trimmedPart = part.trim();
        if (trimmedPart.startsWith('User: ')) {
          messages.push({
            type: 'user',
            content: trimmedPart.substring(6).trim(),
            timestamp: interaction.createdAt,
          });
        } else if (trimmedPart.startsWith('Advisor: ')) {
          messages.push({
            type: 'advisor',
            content: trimmedPart.substring(9).trim(),
            timestamp: interaction.createdAt,
          });
        }
      });
    });

    setChatHistory(messages);
  }, [advisorInteractions, activeAdvisor]);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const message = chatMessage.trim();
    setChatMessage('');
    setIsLoading(true);

    // Add user message to chat history immediately
    setChatHistory((prev) => [
      ...prev,
      {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const result = await chatWithAdvisor(activeAdvisor, message);

      if (result.success) {
        // Add advisor response to chat history
        setChatHistory((prev) => [
          ...prev,
          {
            type: 'advisor',
            content: result.response,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await getStructuredFeedback(activeAdvisor);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      // Get all chat interactions for current advisor
      const chatInteractions = advisorInteractions.filter(
        (interaction) =>
          interaction.advisorRole === activeAdvisor &&
          interaction.interactionType === 'chat' &&
          !interaction.resolved
      );

      if (chatInteractions.length === 0) {
        return;
      }

      // Mark all as resolved (suppress individual success toasts)
      const resolvePromises = chatInteractions.map(async (interaction) => {
        try {
          await resolveInteraction(interaction._id, false); // Don't show individual toasts
        } catch (error) {
          // Let individual errors still show
          throw error;
        }
      });

      await Promise.all(resolvePromises);

      // Clear local chat history immediately for better UX
      setChatHistory([]);

      // Show single success message
      toast.success(
        `Cleared ${chatInteractions.length} chat message${
          chatInteractions.length === 1 ? '' : 's'
        }`
      );
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Failed to clear chat');
    }
  };

  const clearFeedback = async () => {
    try {
      // Get all feedback interactions for current advisor
      const feedbackInteractions = advisorInteractions.filter(
        (interaction) =>
          interaction.advisorRole === activeAdvisor &&
          interaction.interactionType === 'structured_feedback' &&
          !interaction.resolved
      );

      if (feedbackInteractions.length === 0) {
        return;
      }

      // Mark all as resolved (suppress individual success toasts)
      const resolvePromises = feedbackInteractions.map(async (interaction) => {
        try {
          await resolveInteraction(interaction._id, false); // Don't show individual toasts
        } catch (error) {
          // Let individual errors still show
          throw error;
        }
      });

      await Promise.all(resolvePromises);

      // Show single success message
      toast.success(
        `Cleared ${feedbackInteractions.length} feedback item${
          feedbackInteractions.length === 1 ? '' : 's'
        }`
      );
    } catch (error) {
      console.error('Error clearing feedback:', error);
      toast.error('Failed to clear feedback');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentAdvisor = advisors.find((a) => a.id === activeAdvisor);
  const Icon = currentAdvisor?.icon || FileText;

  return (
    <div
      style={{
        height: '100%',
        maxHeight: '100vh', // Ensure it doesn't exceed viewport height
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        overflow: 'hidden', // Prevent the panel itself from overflowing
      }}
    >
      {/* Advisor Selection */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: 'white',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 12px 0',
          }}
        >
          AI Advisors
        </h3>

        <div style={{ display: 'flex', gap: '8px' }}>
          {advisors.map((advisor) => (
            <button
              key={advisor.id}
              onClick={() => setActiveAdvisor(advisor.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor:
                  activeAdvisor === advisor.id ? advisor.color : 'transparent',
                color: activeAdvisor === advisor.id ? 'white' : '#666',
                border: `1px solid ${
                  activeAdvisor === advisor.id ? advisor.color : '#e1e5e9'
                }`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              {advisor.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Advisor Info */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: `${currentAdvisor.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} style={{ color: currentAdvisor.color }} />
          </div>
          <div>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
              }}
            >
              {currentAdvisor.name}
            </h4>
            <p
              style={{
                fontSize: '12px',
                color: '#666',
                margin: 0,
              }}
            >
              {currentAdvisor.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: 'white',
        }}
      >
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: activeTab === 'chat' ? '#f8fafc' : 'transparent',
            color: activeTab === 'chat' ? '#333' : '#666',
            border: 'none',
            borderBottom:
              activeTab === 'chat'
                ? '2px solid #667eea'
                : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <MessageCircle size={16} />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor:
              activeTab === 'feedback' ? '#f8fafc' : 'transparent',
            color: activeTab === 'feedback' ? '#333' : '#666',
            border: 'none',
            borderBottom:
              activeTab === 'feedback'
                ? '2px solid #667eea'
                : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <FileText size={16} />
          Feedback
        </button>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {activeTab === 'chat' ? (
          <>
            {/* Chat Header */}
            {chatHistory.length > 0 && (
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e1e5e9',
                  backgroundColor: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    margin: 0,
                  }}
                >
                  Chat History
                </h4>
                <button
                  onClick={clearChat}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <X size={12} />
                  Clear Chat
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: 0, // Important for flexbox scrolling
              }}
            >
              {chatHistory.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#666',
                  }}
                >
                  <MessageSquare
                    size={48}
                    style={{
                      color: '#cbd5e1',
                      margin: '0 auto 16px',
                    }}
                  />
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    Start a conversation with your{' '}
                    {currentAdvisor.name.toLowerCase()}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      margin: '8px 0 0 0',
                      color: '#94a3b8',
                    }}
                  >
                    Ask for feedback, suggestions, or advice about your writing
                  </p>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding:
                        message.type === 'user'
                          ? '12px 16px 12px 40px'
                          : '12px 16px',
                      backgroundColor:
                        message.type === 'user' ? '#667eea10' : 'white',
                      borderRadius: '8px',
                      marginLeft: message.type === 'user' ? '20px' : '0',
                      marginRight: message.type === 'advisor' ? '20px' : '0',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor:
                          message.type === 'user'
                            ? '#667eea'
                            : currentAdvisor.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {message.type === 'user' ? (
                        <User size={12} style={{ color: 'white' }} />
                      ) : (
                        <Bot size={12} style={{ color: 'white' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#333',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {message.content}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginTop: '4px',
                        }}
                      >
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginRight: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: currentAdvisor.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bot size={12} style={{ color: 'white' }} />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <LoadingSpinner size={16} />
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {currentAdvisor.name} is thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div
              style={{
                padding: '16px',
                borderTop: '1px solid #e1e5e9',
                backgroundColor: 'white',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${currentAdvisor.name.toLowerCase()} for feedback...`}
                  rows={2}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.target.style.borderColor = '#e1e5e9')}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isLoading}
                  style={{
                    padding: '8px 12px',
                    backgroundColor:
                      !chatMessage.trim() || isLoading ? '#94a3b8' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor:
                      !chatMessage.trim() || isLoading
                        ? 'not-allowed'
                        : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Feedback Tab */
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              minHeight: 0, // Important for flexbox scrolling
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333',
                  margin: 0,
                }}
              >
                Structured Feedback
              </h4>
              <button
                onClick={handleGetFeedback}
                disabled={isLoading}
                style={{
                  padding: '6px 12px',
                  backgroundColor: isLoading ? '#94a3b8' : currentAdvisor.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={12} />
                    Analyzing...
                  </>
                ) : (
                  'Get Feedback'
                )}
              </button>
            </div>

            {/* Feedback History */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '8px',
              }}
            >
              {/* Clear Feedback Button */}
              {advisorInteractions.filter(
                (interaction) =>
                  interaction.advisorRole === activeAdvisor &&
                  interaction.interactionType === 'structured_feedback' &&
                  !interaction.resolved
              ).length > 0 && (
                <button
                  onClick={() => clearFeedback()}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    alignSelf: 'flex-end',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <X size={12} />
                  Clear Feedback
                </button>
              )}

              {advisorInteractions
                .filter(
                  (interaction) =>
                    interaction.advisorRole === activeAdvisor &&
                    interaction.interactionType === 'structured_feedback' &&
                    !interaction.resolved
                )
                .map((interaction) => (
                  <div
                    key={interaction._id}
                    style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e1e5e9',
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Clock size={12} />
                        {formatTimestamp(interaction.createdAt)}
                      </div>

                      {!interaction.resolved && (
                        <button
                          onClick={() => resolveInteraction(interaction._id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckCircle size={12} />
                          Resolve
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '14px',
                        color: '#333',
                        lineHeight: '1.6',
                      }}
                    >
                      {(() => {
                        try {
                          // Parse the JSON feedback object
                          const feedbackData = JSON.parse(interaction.content);
                          return (
                            <div>
                              <div style={{ marginBottom: '16px' }}>
                                <strong style={{ color: '#1f2937' }}>
                                  Overall Feedback:
                                </strong>
                                <div
                                  style={{
                                    marginTop: '8px',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                  }}
                                >
                                  {feedbackData.overall}
                                </div>
                              </div>
                              {feedbackData.rating && (
                                <div
                                  style={{
                                    marginTop: '12px',
                                    padding: '8px 12px',
                                    backgroundColor: '#f0f9ff',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    border: '1px solid #e0f2fe',
                                  }}
                                >
                                  <strong>Rating:</strong> {feedbackData.rating}
                                  /5 ⭐
                                </div>
                              )}
                            </div>
                          );
                        } catch (e) {
                          // Fallback for plain text content
                          return (
                            <div
                              style={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.6',
                              }}
                            >
                              {interaction.content}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ))}

              {advisorInteractions.filter(
                (interaction) =>
                  interaction.advisorRole === activeAdvisor &&
                  interaction.interactionType === 'structured_feedback'
              ).length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#666',
                  }}
                >
                  <FileText
                    size={48}
                    style={{
                      color: '#cbd5e1',
                      margin: '0 auto 16px',
                    }}
                  />
                  <p style={{ fontSize: '14px', margin: 0 }}>No feedback yet</p>
                  <p
                    style={{
                      fontSize: '12px',
                      margin: '8px 0 0 0',
                      color: '#94a3b8',
                    }}
                  >
                    Click "Get Feedback" to receive structured analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorPanel;
