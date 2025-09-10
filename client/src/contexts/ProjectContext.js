import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advisorInteractions, setAdvisorInteractions] = useState([]);
  const [autosaveStatus, setAutosaveStatus] = useState('saved');

  useEffect(() => {
    if (id) {
      loadProject();
      loadAdvisorInteractions();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const loadAdvisorInteractions = async () => {
    try {
      const response = await axios.get(`/api/advisors/${id}/interactions`);
      setAdvisorInteractions(response.data.interactions);
    } catch (error) {
      console.error('Error loading advisor interactions:', error);
    }
  };

  const updateProject = async (updates, shouldAutosave = false) => {
    try {
      if (shouldAutosave) {
        setAutosaveStatus('saving');
      }

      const response = await axios.patch(`/api/projects/${id}`, updates);
      setProject(response.data.project);

      if (shouldAutosave) {
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus(''), 2000);
      } else {
        toast.success('Project updated successfully');
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating project:', error);
      setAutosaveStatus('error');
      setTimeout(() => setAutosaveStatus(''), 2000);

      if (!shouldAutosave) {
        toast.error('Failed to update project');
      }
      return { success: false };
    }
  };

  const chatWithAdvisor = async (advisorRole, message) => {
    try {
      const response = await axios.post(`/api/advisors/${id}/chat`, {
        advisorRole,
        message,
      });

      // Reload interactions to get the latest chat
      loadAdvisorInteractions();

      return {
        success: true,
        response: response.data.response,
      };
    } catch (error) {
      console.error('Error chatting with advisor:', error);
      toast.error('Failed to get advisor response');
      return { success: false };
    }
  };

  const getStructuredFeedback = async (advisorRole) => {
    try {
      const response = await axios.post(`/api/advisors/${id}/feedback`, {
        advisorRole,
      });

      loadAdvisorInteractions();

      return {
        success: true,
        feedback: response.data.feedback,
      };
    } catch (error) {
      console.error('Error getting structured feedback:', error);
      toast.error('Failed to get advisor feedback');
      return { success: false };
    }
  };

  const addInlineComment = async (advisorRole, selectedText, position) => {
    try {
      const response = await axios.post(`/api/advisors/${id}/comment`, {
        advisorRole,
        selectedText,
        position,
      });

      loadAdvisorInteractions();

      return {
        success: true,
        comment: response.data.comment,
      };
    } catch (error) {
      console.error('Error adding inline comment:', error);
      toast.error('Failed to add advisor comment');
      return { success: false };
    }
  };

  const resolveInteraction = async (interactionId, showToast = true) => {
    try {
      await axios.patch(
        `/api/advisors/${id}/interactions/${interactionId}/resolve`
      );

      // Update local state
      setAdvisorInteractions((prev) =>
        prev.map((interaction) =>
          interaction._id === interactionId
            ? { ...interaction, resolved: true }
            : interaction
        )
      );

      if (showToast) {
        toast.success('Interaction resolved');
      }
      return { success: true };
    } catch (error) {
      console.error('Error resolving interaction:', error);
      if (showToast) {
        toast.error('Failed to resolve interaction');
      }
      return { success: false };
    }
  };

  const exportProject = async (format) => {
    try {
      const response = await axios.get(`/api/projects/${id}/export/${format}`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project.title}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Project exported as ${format.toUpperCase()}`);
      return { success: true };
    } catch (error) {
      console.error('Error exporting project:', error);
      toast.error('Failed to export project');
      return { success: false };
    }
  };

  const value = {
    project,
    loading,
    advisorInteractions,
    autosaveStatus,
    updateProject,
    chatWithAdvisor,
    getStructuredFeedback,
    addInlineComment,
    resolveInteraction,
    exportProject,
    refreshProject: loadProject,
    refreshInteractions: loadAdvisorInteractions,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
