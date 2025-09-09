# Software Requirements Specification (SRS)
**Project:** Starboard Write  
**Version:** 0.1 (Draft)  
**Prepared by:** Chris Minnick  

---

## 1. Introduction

### 1.1 Purpose
Starboard Write is a standalone web application designed to support writers of all types. The app provides a professional-style publishing environment by assembling a panel of AI “advisors” (editor, copyeditor, reader) who can review and comment on the writer’s work when requested. The goal is to give writers productivity tools and a taste of the professional publishing process without replacing their creative role.

### 1.2 Scope
The initial release (MVP) will allow users to:
- Create writing projects with guided setup questions.
- Write in a rich text editor with autosave, versioning, and export capabilities.
- Consult a small team of AI advisors (editor, copyeditor, reader).
- Interact with advisors through chat, structured feedback, and inline comments.
- Work on one document at a time, stored locally on the user’s device.

Future versions may expand to:
- Collaboration with other human writers.
- Expanded advisor roles (research assistant, graphic artist, agent, etc.).
- Model selection per advisor.
- Cloud storage, multi-language support, and plugins for external platforms.

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone responsive web application built on the MERN stack. Drafts stored locally on the user’s machine initially.

### 2.2 Product Functions
- Guided onboarding with project setup questions.
- Rich text editor with autosave, versioning, and export (Word, PDF, Markdown).
- Advisor panel (sidebar) for role-specific feedback.
- Templates for different writing formats (novel, blog post, research paper, screenplay).

### 2.3 User Characteristics
- Target audience: writers of all kinds (novelists, journalists, screenwriters, academics).
- Users may not have professional publishing experience but want exposure to structured editorial workflows.

### 2.4 Constraints
- Advisors initially use the same LLM backend, differentiated only by prompts.
- Single user only in v1.
- No cloud storage or multi-language support at launch.

---

## 3. Specific Requirements

### 3.1 Functional Requirements
1. **Project Setup**
   - The system shall present the user with setup questions before creating a new project.
   - The system shall allow skipping templates or choosing one from predefined categories.

2. **Writing Environment**
   - The system shall provide a rich text editor with formatting tools (headings, bold, italics, footnotes).
   - The system shall autosave drafts locally.
   - The system shall support document versioning and export (PDF, DOCX, Markdown).

3. **Advisor Panel**
   - The system shall include three advisor roles: editor, copyeditor, and reader.
   - The system shall allow users to add, remove, or replace advisors.
   - The system shall support advisor memory across project sessions.
   - Advisors shall provide both structured (checklists, suggestions) and free-form feedback.
   - The system shall support multiple interaction modes: chat interface, inline comments, and structured reports.

4. **User Flow**
   - The system shall require project setup before entering the writing environment.
   - The advisor panel shall be visible in a sidebar by default and hideable by the user.

5. **Templates**
   - The system shall provide predefined templates (novel, blog post, research paper, screenplay).

### 3.2 Non-Functional Requirements
- **Performance**: Editor must handle documents up to 100,000 words smoothly.
- **Security/Privacy**: Drafts stored only on user’s machine for v1.
- **Scalability**: MERN stack chosen to allow future cloud-based features.
- **Usability**: Responsive design for desktop, tablet, and mobile.
- **Subscription**: Access controlled by login/subscription with 7-day free trial.

---

## 4. Future Enhancements
- Collaboration between multiple writers.
- Expanded advisor roles (research assistant, agent, illustrator).
- Cloud storage and sync.
- Multi-language advisor support.
- Model selection per advisor role.
