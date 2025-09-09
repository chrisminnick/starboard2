import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from './common/LoadingSpinner';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/project/new');
  };

  const handleOpenProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTemplateIcon = (template) => {
    switch (template) {
      case 'novel':
        return <BookOpen size={20} style={{ color: '#667eea' }} />;
      case 'blog':
        return <FileText size={20} style={{ color: '#10b981' }} />;
      case 'research':
        return <FileText size={20} style={{ color: '#f59e0b' }} />;
      case 'screenplay':
        return <FileText size={20} style={{ color: '#ef4444' }} />;
      default:
        return <FileText size={20} style={{ color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return '#f59e0b';
      case 'review':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'archived':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e1e5e9',
          padding: '16px 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                margin: 0,
              }}
            >
              Starboard Write
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} style={{ color: '#666' }} />
              <span style={{ color: '#666', fontSize: '14px' }}>
                {user?.name}
              </span>
              {user?.subscription?.status === 'trial' && (
                <span
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  Trial
                </span>
              )}
            </div>

            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #e1e5e9',
                borderRadius: '6px',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* Welcome Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px',
            }}
          >
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p style={{ color: '#666', fontSize: '18px' }}>
            Ready to continue your writing journey with your AI advisors?
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={handleCreateProject}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 24px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#5a67d8';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#667eea';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={20} />
            Start New Project
          </button>
        </div>

        {/* Projects Section */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                margin: 0,
              }}
            >
              Your Projects
            </h3>
            <span style={{ color: '#666', fontSize: '14px' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
          </div>

          {projects.length === 0 ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '60px 40px',
                textAlign: 'center',
                border: '2px dashed #e1e5e9',
              }}
            >
              <BookOpen
                size={48}
                style={{ color: '#cbd5e1', margin: '0 auto 16px' }}
              />
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                No projects yet
              </h4>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Create your first writing project and start collaborating with
                AI advisors
              </p>
              <button
                onClick={handleCreateProject}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Create First Project
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleOpenProject(project._id)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s',
                    border: '1px solid #f1f5f9',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      {getTemplateIcon(project.template)}
                      <div>
                        <h4
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {project.title}
                        </h4>
                        <span
                          style={{
                            fontSize: '12px',
                            textTransform: 'capitalize',
                            color: '#666',
                          }}
                        >
                          {project.template}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        backgroundColor: getStatusColor(project.status) + '20',
                        color: getStatusColor(project.status),
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p
                    style={{
                      color: '#666',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      margin: '0 0 16px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description || 'No description provided.'}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Calendar size={14} style={{ color: '#666' }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {formatDate(project.updatedAt)}
                      </span>
                    </div>

                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {project.currentWordCount?.toLocaleString() || 0} words
                      {project.wordCountGoal && (
                        <span style={{ color: '#94a3b8' }}>
                          {' '}
                          / {project.wordCountGoal.toLocaleString()}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
