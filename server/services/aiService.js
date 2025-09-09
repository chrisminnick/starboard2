// AI Service for Starboard Write
// This service handles communication with AI providers (OpenAI, etc.)

const advisorPersonalities = {
  editor: {
    name: 'Editorial Assistant',
    personality:
      'Professional, constructive, and focused on story structure, character development, and narrative flow.',
    systemPrompt: `You are a professional editor with years of experience in publishing. You focus on:
    - Story structure and narrative flow
    - Character development and consistency
    - Plot pacing and tension
    - Theme and messaging
    - Genre conventions and reader expectations
    
    Provide constructive, specific feedback that helps improve the work while maintaining the author's voice.`,
  },
  copyeditor: {
    name: 'Copy Editor',
    personality:
      'Detail-oriented, precise, and focused on technical writing aspects.',
    systemPrompt: `You are a meticulous copyeditor who specializes in:
    - Grammar, spelling, and punctuation
    - Style consistency and clarity
    - Fact-checking and accuracy
    - Formatting and style guide adherence
    - Readability and flow
    
    Provide specific, actionable suggestions to improve clarity and correctness.`,
  },
  reader: {
    name: 'Reader Representative',
    personality:
      'Enthusiastic, honest, and represents the target audience perspective.',
    systemPrompt: `You are an engaged reader who represents the target audience. You focus on:
    - Overall enjoyment and engagement
    - Clarity and understanding
    - Emotional impact and connection
    - Accessibility and appeal
    - Questions and confusions from a reader's perspective
    
    Provide honest, reader-focused feedback about the experience of reading this work.`,
  },
};

// Mock AI service - replace with actual OpenAI integration
async function getAIResponse(advisorRole, prompt, project) {
  try {
    // In a real implementation, you would call OpenAI or another AI service here
    // For MVP purposes, we'll return mock responses

    const advisor = advisorPersonalities[advisorRole];
    if (!advisor) {
      throw new Error(`Unknown advisor role: ${advisorRole}`);
    }

    // Mock response based on advisor role
    const mockResponses = {
      editor: generateEditorResponse(prompt, project),
      copyeditor: generateCopyeditorResponse(prompt, project),
      reader: generateReaderResponse(prompt, project),
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockResponses[advisorRole];
  } catch (error) {
    console.error('AI Service error:', error);
    throw new Error('Failed to get AI response');
  }
}

function generateEditorResponse(prompt, project) {
  const responses = [
    `Thank you for sharing this ${project.template} with me. I can see you're working on an engaging piece. Here are my thoughts:

**Structure & Pacing:**
- The opening draws readers in effectively
- Consider varying your sentence structure for better rhythm
- The plot progression feels natural

**Character Development:**
- Your characters have distinct voices
- Consider adding more internal conflict to deepen characterization
- The dialogue feels authentic

**Overall Impression:**
This shows promise. Focus on tightening the narrative arc and ensuring each scene serves the larger story purpose.`,

    `I've reviewed your latest work, and there's definitely potential here. Let me share some observations:

**Narrative Flow:**
- Strong opening that establishes the premise quickly
- Middle section could benefit from increased tension
- Consider the pacing of revelations

**Voice & Style:**
- Your writing voice is developing nicely
- Some passages feel rushed - take time to develop key moments
- The tone is consistent with your chosen genre

Keep pushing forward with the story. The foundation is solid.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateCopyeditorResponse(prompt, project) {
  const responses = [
    `I've completed my review of your ${project.template}. Here are the technical notes:

**Grammar & Mechanics:**
- Watch for comma splices in longer sentences
- Consistent tense usage throughout
- A few typos to address (see specific comments)

**Style & Clarity:**
- Some sentences could be simplified for better readability
- Consider breaking up longer paragraphs
- Maintain consistency in character name formatting

**Formatting:**
- Chapter headings are consistent
- Dialogue formatting follows standard conventions
- Check quotation mark consistency

Overall, the technical aspects are solid with minor refinements needed.`,

    `Technical review complete. Here's what I found:

**Language & Grammar:**
- Strong command of grammar fundamentals
- A few instances of passive voice to consider revising
- Punctuation is generally correct

**Readability:**
- Sentence variety keeps the text engaging
- Some technical terms may need clarification for your audience
- Paragraph breaks work well for pacing

**Consistency:**
- Character descriptions remain consistent
- Timeline is clear and logical
- Style choices are maintained throughout

Clean, professional writing with attention to detail.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateReaderResponse(prompt, project) {
  const responses = [
    `As a reader, I'm really enjoying this ${project.template}! Here's my honest reaction:

**Engagement Level:**
- I was hooked from the first chapter
- Some sections made me want to keep reading past my bedtime
- A couple of slower parts, but they served the story

**Emotional Connection:**
- I found myself caring about the characters
- The conflicts felt real and relatable
- Some moments genuinely surprised me

**Questions & Thoughts:**
- I'm curious about [specific plot point]
- The world-building is immersive
- I want to know what happens next!

This is the kind of ${project.template} I'd recommend to friends. Keep going!`,

    `From a reader's perspective, this is compelling work:

**First Impressions:**
- The premise grabbed my attention immediately
- Characters feel like real people I might know
- The setting is vivid and believable

**Reading Experience:**
- Easy to follow without being predictable
- Good balance of action and reflection
- Chapters end with nice hooks

**Overall Appeal:**
- This fits well in the ${project.genre || 'genre'} category
- Perfect for your target audience
- Has that "just one more chapter" quality

I'm invested in seeing where this story goes. The foundation is strong!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// Function to integrate with actual OpenAI API (for future implementation)
async function getOpenAIResponse(advisorRole, prompt, project) {
  // This would be implemented when integrating with OpenAI
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const completion = await openai.chat.completions.create({
  //   model: process.env.AI_MODEL || 'gpt-3.5-turbo',
  //   messages: [
  //     { role: 'system', content: advisorPersonalities[advisorRole].systemPrompt },
  //     { role: 'user', content: `Project: ${project.title}\nContent: ${project.content}\n\nPrompt: ${prompt}` }
  //   ],
  //   max_tokens: 500,
  //   temperature: 0.7
  // });
  // return completion.choices[0].message.content;
}

module.exports = {
  getAIResponse,
  advisorPersonalities,
};
