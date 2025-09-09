# Test Plan for Starboard Write (v0.1 MVP)

## 1. Introduction

This test plan outlines the strategy, scope, and test cases for validating the functional and non-functional requirements of the Starboard Write application as described in the SRS.

## 2. Test Strategy

- **Manual Testing** for UI/UX, onboarding, and advisor interactions.
- **Automated Testing** for backend APIs, autosave, versioning, and export features.
- **Performance Testing** for editor scalability.
- **Security Testing** for local storage and privacy.

## 3. Test Scope

Covers all MVP features:

- Project setup
- Writing environment
- Advisor panel
- Templates
- User flow
- Non-functional requirements

## 4. Test Cases

### 4.1 Functional Tests

#### Project Setup

- **TC1:** Verify setup questions are presented before project creation.
- **TC2:** Verify user can skip or select a template.
- **TC3:** Validate project creation with/without template.

#### Writing Environment

- **TC4:** Verify rich text editor supports headings, bold, italics, footnotes.
- **TC5:** Test autosave functionality (local storage).
- **TC6:** Validate document versioning (create, view, restore versions).
- **TC7:** Test export to PDF, DOCX, Markdown.

#### Advisor Panel

- **TC8:** Verify presence of editor, copyeditor, reader advisors.
- **TC9:** Test adding, removing, replacing advisors.
- **TC10:** Validate advisor memory across sessions.
- **TC11:** Test structured feedback (checklists, suggestions).
- **TC12:** Test free-form feedback (chat, comments).
- **TC13:** Test multiple interaction modes (chat, inline comments, reports).

#### User Flow

- **TC14:** Verify project setup is required before writing.
- **TC15:** Advisor panel is visible by default and can be hidden.

#### Templates

- **TC16:** Verify predefined templates are available and selectable.

### 4.2 Non-Functional Tests

#### Performance

- **TC17:** Editor handles documents up to 100,000 words without lag.

#### Security/Privacy

- **TC18:** Drafts are stored only locally; no data sent to cloud.

#### Usability

- **TC19:** Responsive design works on desktop, tablet, mobile.

#### Subscription

- **TC20:** Access is controlled by login/subscription; 7-day free trial is enforced.

## 5. Test Environment

- Browsers: Chrome, Firefox, Safari, Edge
- Devices: Desktop, tablet, mobile
- OS: macOS, Windows, Linux

## 6. Out of Scope

- Collaboration features
- Cloud storage
- Multi-language support

## 7. Acceptance Criteria

All test cases must pass for MVP release. Critical bugs must be resolved before launch.
