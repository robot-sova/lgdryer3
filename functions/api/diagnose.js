export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { userInput } = await request.json();

    if (!userInput || typeof userInput !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Truncate input to prevent abuse
    const sanitizedInput = userInput.slice(0, 1000);

    const systemPrompt = `You are an expert LG dryer repair technician with 15 years of experience.
A customer is describing a problem with their LG dryer.
Provide a helpful diagnosis in 3-4 sentences.
Mention the most likely cause, estimated repair cost range ($150-$480),
and recommend calling (323) 990-7550 for same-day professional service.
Be specific about LG models when relevant.
End with: actual prices are often lower due to bulk parts discounts.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `${systemPrompt}\n\nCustomer issue: ${sanitizedInput}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Please call (323) 990-7550 for a free phone diagnosis.';

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      result: 'Could not connect to AI service. Please call (323) 990-7550 for a free phone diagnosis.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
