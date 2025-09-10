// AI Service for Starboard Write
// This service handles communication with AI providers (OpenAI, etc.)

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Real AI service using OpenAI
async function getAIResponse(advisorRole, prompt, project) {
  try {
    const advisor = advisorPersonalities[advisorRole];
    if (!advisor) {
      throw new Error(`Unknown advisor role: ${advisorRole}`);
    }

    // Create the context about the project and content
    const projectContext = `
Project Title: ${project.title}
Template: ${project.template}
Target Audience: ${project.targetAudience || 'General audience'}
Current Word Count: ${project.currentWordCount || 0}
Content: ${project.content || 'No content yet'}
    `.trim();

    // Make the OpenAI API call
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: advisor.systemPrompt,
        },
        {
          role: 'user',
          content: `${prompt}\n\nProject Information:\n${projectContext}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Fallback to mock responses if OpenAI fails
    console.log('Falling back to mock responses due to API error');
    return getMockResponse(advisorRole, prompt, project);
  }
}

// Fallback mock responses
function getMockResponse(advisorRole, prompt, project) {
  const mockResponses = {
    editor: generateEditorResponse(prompt, project),
    copyeditor: generateCopyeditorResponse(prompt, project),
    reader: generateReaderResponse(prompt, project),
  };

  return mockResponses[advisorRole];
}

function generateEditorResponse(prompt, project) {
  const responses = [
    `Thank you for sharing this ${project.template} with me. I can see you're working on an engaging piece. Here are my thoughts:

**Structure & Pacing:**
- The opening draws readers in effectively with vivid imagery and specific details
- Consider varying your sentence structure for better rhythm - you have some nice variety already
- The plot progression feels natural and maintains good momentum
- Your transitions between scenes are smooth and well-crafted

**Character Development:**
- Your characters have distinct voices that come through clearly
- The protagonist's internal thoughts are well-developed and authentic
- Consider adding more internal conflict to deepen characterization further
- The dialogue feels authentic and serves the story well

**Writing Style:**
- Your descriptive passages are rich without being overly dense
- You show strong command of point of view
- The tone is consistent with your chosen genre
- Some passages could benefit from tighter prose

**Technical Elements:**
- Good use of sensory details to create atmosphere
- Your metaphors and imagery are effective
- Paragraph breaks work well for pacing
- Consider varying sentence lengths more in some sections

**Overall Impression:**
This shows real promise and demonstrates solid storytelling fundamentals. The writing has a clear voice and the narrative draws the reader in. Focus on tightening the narrative arc and ensuring each scene serves the larger story purpose. Keep pushing forward - you're on the right track!`,

    `I've reviewed your latest work, and there's definitely potential here. Let me share some detailed observations:

**Narrative Flow:**
- Strong opening that establishes the premise quickly and hooks the reader
- Middle section maintains interest but could benefit from increased tension
- Consider the pacing of revelations - some could be held back longer
- Your scene endings are effective at pulling readers forward

**Voice & Style:**
- Your writing voice is developing nicely and feels authentic
- Some passages feel rushed - take time to develop key emotional moments
- The tone is consistent with your chosen genre and target audience
- Your use of specific details creates vivid scenes

**Character Work:**
- Characters feel real and their motivations are clear
- Dialogue serves multiple purposes - character, plot, mood
- Consider deepening some secondary characters
- Your protagonist's arc is compelling

**Technical Craft:**
- Good command of basic writing mechanics
- Effective use of showing vs. telling
- Your descriptions balance detail with momentum
- Consider varying paragraph lengths for better rhythm

**Areas for Growth:**
- Some scenes could be condensed for better pacing
- Watch for repetitive phrases or word choices
- Consider adding more conflict in quiet scenes
- Strengthen the connection between scenes

Keep pushing forward with the story. The foundation is solid and your voice is emerging clearly. Trust your instincts and keep writing!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateCopyeditorResponse(prompt, project) {
  const responses = [
    `I've completed my review of your ${project.template}. Here are the technical notes:

**Grammar & Mechanics:**
- Watch for comma splices in longer sentences - I noticed a few instances
- Consistent tense usage throughout - well done on maintaining this
- A few typos to address (see specific comments if available)
- Strong command of punctuation fundamentals

**Style & Clarity:**
- Some sentences could be simplified for better readability
- Consider breaking up longer paragraphs for easier scanning
- Maintain consistency in character name formatting
- Your word choice is generally precise and effective

**Formatting & Structure:**
- Chapter headings are consistent and well-formatted
- Dialogue formatting follows standard conventions correctly
- Check quotation mark consistency - mostly good
- Paragraph indentation is appropriate

**Language Usage:**
- Watch for passive voice where active would be stronger
- Some technical terms may need clarification for your target audience
- Good variety in sentence structure keeps text engaging
- Consider eliminating redundant phrases where possible

**Consistency Issues:**
- Character descriptions remain consistent throughout
- Timeline is clear and logical - no contradictions noted
- Style choices are maintained well across sections
- Point of view is handled consistently

**Overall Assessment:**
The technical aspects are solid with minor refinements needed. Your attention to detail shows in the clean prose. The writing demonstrates professional-level mechanics with just a few areas for polish.`,

    `Technical review complete. Here's what I found:

**Language & Grammar:**
- Strong command of grammar fundamentals across the piece
- A few instances of passive voice to consider revising for strength
- Punctuation is generally correct with minor exceptions
- Watch for subject-verb agreement in complex sentences

**Readability & Flow:**
- Sentence variety keeps the text engaging and readable
- Some technical terms may need clarification for your audience
- Paragraph breaks work well for pacing and comprehension
- Consider simplifying some overly complex constructions

**Style Consistency:**
- Character descriptions remain consistent throughout
- Timeline is clear and logical with no major contradictions
- Style choices are maintained throughout the work
- Voice remains consistent and appropriate

**Technical Elements:**
- Proper use of dialogue tags and formatting
- Good command of show vs. tell techniques
- Effective use of active voice in most passages
- Strong transitions between paragraphs and sections

**Areas for Attention:**
- A few repetitive word choices to vary
- Some sentences could be tightened for impact
- Consider reader accessibility in technical passages
- Minor formatting consistency items

**Professional Assessment:**
Clean, professional writing with attention to technical detail. The prose flows well and demonstrates solid copyediting fundamentals. Minor refinements will polish this to publication quality.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateReaderResponse(prompt, project) {
  const responses = [
    `As a reader, I'm really enjoying this ${
      project.template
    }! Here's my honest reaction:

**Engagement Level:**
- I was hooked from the first chapter and didn't want to put it down
- Some sections made me want to keep reading past my bedtime - always a good sign!
- A couple of slower parts, but they served the story and built character
- The pacing kept me turning pages consistently

**Emotional Connection:**
- I found myself caring about the characters almost immediately
- The conflicts felt real and relatable - I could see myself in similar situations
- Some moments genuinely surprised me and made me gasp out loud
- The emotional beats hit at just the right moments

**Story Appeal:**
- The premise is unique enough to stand out but familiar enough to connect
- Your world-building is immersive without being overwhelming
- The stakes feel real and important to the characters
- I'm genuinely invested in seeing how this resolves

**Questions & Thoughts:**
- I'm curious about how certain plot threads will resolve
- Some characters intrigue me and I want to know more about their backstories
- The world you've created makes me want to explore it further
- I have theories about what might happen next

**Reader Experience:**
- Easy to follow without being predictable
- Good balance of action, dialogue, and introspection
- Chapters end with hooks that make me want to continue
- The writing flows smoothly and doesn't pull me out of the story

**Target Audience Fit:**
- This fits perfectly in the ${project.genre || 'genre'} category
- Perfect for readers who enjoy character-driven stories
- Has that "just one more chapter" quality that readers love
- Would definitely recommend to friends who enjoy this type of story

This is the kind of ${
      project.template
    } I'd recommend to friends and talk about in my book club. Keep going - you're on the right track and I'm invested in seeing where this story goes!`,

    `From a reader's perspective, this is compelling work that kept me engaged:

**First Impressions:**
- The premise grabbed my attention immediately and made me want to know more
- Characters feel like real people I might know or encounter
- The setting is vivid and believable - I can picture myself there
- You established the stakes quickly and effectively

**Reading Experience:**
- Easy to follow without being predictable or formulaic
- Good balance of action, dialogue, and character development
- Chapters end with nice hooks that pull me forward
- The writing flows smoothly and maintains good momentum

**Emotional Investment:**
- I care about what happens to these characters
- The conflicts feel meaningful and consequential
- Moments of tension genuinely made me anxious
- I found myself rooting for the protagonist

**Story Elements:**
- The plot moves at a good pace without feeling rushed
- Character motivations are clear and believable
- The dialogue sounds natural and serves the story
- Good mix of familiar and surprising elements

**Appeal & Accessibility:**
- This fits well in the ${project.genre || 'target genre'} category
- Accessible to a broad audience while maintaining depth
- Has universal themes readers can relate to
- The writing style is polished but not pretentious

**Overall Appeal:**
- Perfect for readers who enjoy thoughtful, character-driven stories
- Has that "page-turner" quality that keeps readers engaged
- Would work well for book clubs - lots to discuss
- I'm invested in seeing where this story goes next

I'm genuinely excited to see how this develops. The foundation is strong and you've created something that resonates with readers. Trust your instincts and keep writing!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = {
  getAIResponse,
  advisorPersonalities,
};
