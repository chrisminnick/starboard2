import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  ArrowLeft,
  Save,
  Download,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import AdvisorPanel from './AdvisorPanel';

const WritingEnvironment = () => {
  const { project, loading, autosaveStatus, updateProject, addInlineComment } =
    useProject();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [showAdvisors, setShowAdvisors] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [showCommentMenu, setShowCommentMenu] = useState(false);
  const [commentMenuPosition, setCommentMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isAddingComment, setIsAddingComment] = useState(false);
  const autosaveTimeoutRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (project) {
      setContent(project.content || '');
      setShowAdvisors(project.settings?.advisorPanelVisible !== false);
    }
  }, [project]);

  useEffect(() => {
    // Calculate word count
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  const handleContentChange = (value) => {
    setContent(value);

    // Clear existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Set new autosave timeout
    autosaveTimeoutRef.current = setTimeout(() => {
      handleAutosave(value);
    }, 2000); // Autosave after 2 seconds of inactivity
  };

  const handleAutosave = async (contentValue) => {
    if (project && contentValue !== project.content) {
      await updateProject({ content: contentValue }, true);
      setLastSaved(new Date());
    }
  };

  const handleManualSave = async () => {
    if (project) {
      const result = await updateProject({ content });
      if (result.success) {
        setLastSaved(new Date());
      }
    }
  };

  const toggleAdvisorPanel = () => {
    const newShowAdvisors = !showAdvisors;
    setShowAdvisors(newShowAdvisors);

    // Update project settings
    if (project) {
      updateProject({
        settings: {
          ...project.settings,
          advisorPanelVisible: newShowAdvisors,
        },
      });
    }
  };

  const getAutosaveIcon = () => {
    switch (autosaveStatus) {
      case 'saving':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'saved':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getAutosaveText = () => {
    switch (autosaveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : '';
    }
  };

  // Handle text selection for inline comments
  const handleSelectionChange = () => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();

    if (range && range.length > 0) {
      const text = quill.getText(range.index, range.length).trim();
      if (text.length > 0) {
        setSelectedText(text);
        setSelectionRange(range);

        // Position the comment menu near the selection
        const bounds = quill.getBounds(range.index, range.length);
        const editorContainer = quill.container.getBoundingClientRect();

        setCommentMenuPosition({
          x: editorContainer.left + bounds.left + bounds.width / 2,
          y: editorContainer.top + bounds.top - 10,
        });
        setShowCommentMenu(true);
      } else {
        setShowCommentMenu(false);
      }
    } else {
      setShowCommentMenu(false);
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  const hideCommentMenu = () => {
    setShowCommentMenu(false);
    setSelectedText('');
    setSelectionRange(null);
  };

  const handleAddInlineComment = async (advisorRole) => {
    if (!selectedText || !selectionRange) return;

    setIsAddingComment(true);
    hideCommentMenu();

    try {
      const result = await addInlineComment(advisorRole, selectedText, {
        start: selectionRange.index,
        end: selectionRange.index + selectionRange.length,
      });

      if (result.success) {
        // Comment added successfully - the advisor panel will refresh automatically
      }
    } catch (error) {
      console.error('Error adding inline comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
  ];

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <p style={{ color: '#666' }}>Project not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e1e5e9',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          <div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
              }}
            >
              {project.title}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '2px',
              }}
            >
              <span style={{ fontSize: '12px', color: '#666' }}>
                {wordCount.toLocaleString()} words
                {project.wordCountGoal && (
                  <span style={{ color: '#94a3b8' }}>
                    {' '}
                    / {project.wordCountGoal.toLocaleString()}
                  </span>
                )}
              </span>

              {autosaveStatus && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#666',
                  }}
                >
                  {getAutosaveIcon()}
                  {getAutosaveText()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleManualSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <Save size={16} />
            Save
          </button>

          <button
            onClick={toggleAdvisorPanel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: showAdvisors ? '#667eea' : 'transparent',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              color: showAdvisors ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {showAdvisors ? <EyeOff size={16} /> : <Eye size={16} />}
            Advisors
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: '#666' }} />
            <span style={{ fontSize: '14px', color: '#666' }}>
              {user?.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Editor */}
        <div
          style={{
            flex: showAdvisors ? '1 1 70%' : '1 1 100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleContentChange}
                onChangeSelection={handleSelectionChange}
                modules={quillModules}
                formats={quillFormats}
                style={{
                  height: 'calc(100vh - 200px)',
                  fontSize: '16px',
                }}
                placeholder="Start writing your story..."
              />
            </div>
          </div>
        </div>

        {/* Floating Comment Menu */}
        {showCommentMenu && (
          <>
            {/* Backdrop to close menu */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 998,
              }}
              onClick={hideCommentMenu}
            />
            {/* Comment Menu */}
            <div
              style={{
                position: 'fixed',
                top: commentMenuPosition.y,
                left: commentMenuPosition.x,
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '8px',
                zIndex: 999,
                display: 'flex',
                gap: '4px',
              }}
            >
              <button
                onClick={() => handleAddInlineComment('editor')}
                disabled={isAddingComment}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isAddingComment ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: isAddingComment ? 0.6 : 1,
                }}
                title="Ask Editor about this text"
              >
                <FileText size={12} />
                Editor
              </button>
              <button
                onClick={() => handleAddInlineComment('copyeditor')}
                disabled={isAddingComment}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isAddingComment ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: isAddingComment ? 0.6 : 1,
                }}
                title="Ask Copyeditor about this text"
              >
                <FileText size={12} />
                Copy
              </button>
              <button
                onClick={() => handleAddInlineComment('reader')}
                disabled={isAddingComment}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isAddingComment ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: isAddingComment ? 0.6 : 1,
                }}
                title="Ask Reader about this text"
              >
                <UserIcon size={12} />
                Reader
              </button>
            </div>
          </>
        )}

        {/* Advisor Panel */}
        {showAdvisors && (
          <div
            style={{
              flex: '0 0 400px',
              borderLeft: '1px solid #e1e5e9',
              backgroundColor: '#f8fafc',
            }}
          >
            <AdvisorPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingEnvironment;
