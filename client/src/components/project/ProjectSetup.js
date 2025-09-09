import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Newspaper,
  Film,
  Target,
  Users,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const ProjectSetup = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: '',
    genre: '',
    targetAudience: '',
    wordCountGoal: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const templates = [
    {
      id: 'novel',
      name: 'Novel',
      description: 'Long-form fiction with rich character development',
      icon: BookOpen,
      color: '#667eea',
    },
    {
      id: 'blog',
      name: 'Blog Post',
      description: 'Engaging articles and opinion pieces',
      icon: Newspaper,
      color: '#10b981',
    },
    {
      id: 'research',
      name: 'Research Paper',
      description: 'Academic or professional research documents',
      icon: FileText,
      color: '#f59e0b',
    },
    {
      id: 'screenplay',
      name: 'Screenplay',
      description: 'Scripts for film, TV, or stage productions',
      icon: Film,
      color: '#ef4444',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTemplateSelect = (templateId) => {
    setFormData((prev) => ({
      ...prev,
      template: templateId,
    }));

    if (errors.template) {
      setErrors((prev) => ({
        ...prev,
        template: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.template) {
      newErrors.template = 'Please select a template';
    }

    if (
      formData.wordCountGoal &&
      (isNaN(formData.wordCountGoal) || parseInt(formData.wordCountGoal) < 1)
    ) {
      newErrors.wordCountGoal = 'Word count goal must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        ...formData,
        wordCountGoal: formData.wordCountGoal
          ? parseInt(formData.wordCountGoal)
          : undefined,
      };

      const response = await axios.post('/api/projects', projectData);
      const projectId = response.data.project._id;

      toast.success('Project created successfully!');
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

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
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
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
            Back
          </button>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              margin: 0,
            }}
          >
            Create New Project
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px',
              }}
            >
              Let's set up your project
            </h2>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Tell us about your writing project so our AI advisors can provide
              the best guidance.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Project Title */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '16px',
                }}
              >
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.title
                    ? '2px solid #ef4444'
                    : '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.title
                    ? '#ef4444'
                    : '#e1e5e9')
                }
                placeholder="Enter your project title"
              />
              {errors.title && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '4px',
                  }}
                >
                  {errors.title}
                </p>
              )}
            </div>

            {/* Project Description */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '16px',
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  resize: 'vertical',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e1e5e9')}
                placeholder="Briefly describe your project (optional)"
              />
            </div>

            {/* Template Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '16px',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '16px',
                }}
              >
                Choose a Template *
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {templates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = formData.template === template.id;

                  return (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      style={{
                        padding: '20px',
                        border: isSelected
                          ? `2px solid ${template.color}`
                          : '2px solid #e1e5e9',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: isSelected
                          ? `${template.color}05`
                          : 'white',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        <Icon size={24} style={{ color: template.color }} />
                        <h4
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#333',
                            margin: 0,
                          }}
                        >
                          {template.name}
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: 0,
                          lineHeight: '1.4',
                        }}
                      >
                        {template.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              {errors.template && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '8px',
                  }}
                >
                  {errors.template}
                </p>
              )}
            </div>

            {/* Additional Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '16px',
                  }}
                >
                  <Target size={16} />
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.target.style.borderColor = '#e1e5e9')}
                  placeholder="e.g., Fantasy, Romance, Tech"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '16px',
                  }}
                >
                  <Users size={16} />
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.target.style.borderColor = '#e1e5e9')}
                  placeholder="e.g., Young Adults, Professionals"
                />
              </div>
            </div>

            {/* Word Count Goal */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '16px',
                }}
              >
                Word Count Goal (optional)
              </label>
              <input
                type="number"
                name="wordCountGoal"
                value={formData.wordCountGoal}
                onChange={handleChange}
                min="1"
                style={{
                  width: '200px',
                  padding: '12px 16px',
                  border: errors.wordCountGoal
                    ? '2px solid #ef4444'
                    : '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.wordCountGoal
                    ? '#ef4444'
                    : '#e1e5e9')
                }
                placeholder="50000"
              />
              {errors.wordCountGoal && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '4px',
                  }}
                >
                  {errors.wordCountGoal}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '16px 32px',
                backgroundColor: loading ? '#94a3b8' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!loading) e.target.style.backgroundColor = '#5a67d8';
              }}
              onMouseOut={(e) => {
                if (!loading) e.target.style.backgroundColor = '#667eea';
              }}
            >
              {loading ? (
                <>
                  <LoadingSpinner size={20} />
                  Creating Project...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProjectSetup;
