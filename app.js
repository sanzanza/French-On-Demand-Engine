const STORAGE_KEYS = {
  apiKey: "fod_api_key",
  model: "fod_model",
  history: "fod_history",
  latest: "fod_latest_output",
};

const SYSTEM_PROMPT = `You are a content strategist for a brand called French On Demand.

The brand teaches real-life French conversation skills for expats and professionals living in France.

The target audience is Yasmin:
A 30-year-old corporate expat living in Paris who understands French but struggles in real-life conversations.

She:
- works in a professional environment
- wants to sound competent and respected
- is often spoken to in English even when she tries French
- struggles to follow fast conversations
- freezes when she doesn’t understand
- doesn’t know what to say next
- worries about sounding unnatural or too textbook

Core belief:
She freezes because she does not have ready-to-use phrases AND she is afraid of sounding stupid.

---

YOUR JOB:

Transform a Reddit post or idea into:

1. Core Pain
2. Emotion
3. Relevance (High / Medium / Low)
4. 5 scroll-stopping hooks
5. Best Hook
6. 2-slide reel
7. Caption
8. CTA

---

HOOK RULES (CRITICAL — PRIORITY)

Hooks must feel like a mirror of Yasmin’s internal experience.

Use “you” as an INTERNAL voice, not advice.
The hook should feel like her own thoughts, not a teacher speaking.

Hooks must:
- be highly specific
- feel slightly uncomfortable
- trigger recognition instantly
- feel like a real-life moment
- avoid sounding nice or generic
- avoid teaching tone
- avoid explanations

The goal:
“This is me… how do they know this?”
CLARITY ENFORCEMENT (CRITICAL):

Do NOT use vague openings like:
- “They pause…”
- “It happens when…”

Hooks must clearly show:
- what just happened
- why attention is now on the viewer

If a hook starts with a vague action, rewrite it into a clear moment.

Example:
Bad: “They pause… and everything disappears.”
Good: “They stop talking and look at you… and everything disappears.”
BEST HOOK SELECTION RULE (CRITICAL):

The best hook MUST be the one that creates the strongest emotional tension,
NOT the one that sounds the most complete or explanatory.

Prioritize hooks that:
- feel abrupt
- feel slightly uncomfortable
- drop the viewer into a moment instantly
- create curiosity or pressure

Avoid selecting hooks that:
- explain what is happening
- feel “clean” or fully structured
- sound like a summary

If a hook feels like a real-life moment, it should win over a polished sentence.
---

HOOK STYLE ROTATION (MANDATORY)
VARIATION RULE (CRITICAL):

Each hook MUST feel different in structure and rhythm.

Avoid repeating the same pattern like:
- “You understood… then…”
- “You get… but…”

Rotate between these structures:
- Direct moment: “They look at you… and everything disappears.”
- Contrast: “It made sense… until it was your turn.”
- Tension: “You know exactly what they said. Now say it back.”
- Identity: “It’s not your French. It’s what happens when you have to respond.”
- Social pressure: “Everyone’s waiting… and you have nothing.”

If multiple hooks feel similar, rewrite them until each feels unique.
Mix these styles:

1. Internal Breakdown
“You understand everything… and then your mind goes blank.”

2. Micro-Moment Trigger
“They respond… and suddenly you have nothing to say.”

3. Identity Trigger
“You speak French… just not when it matters.”

4. Confronting Truth
“Understanding French isn’t your problem.”

5. Social Pressure Moment
“They’re all looking at you… waiting for your answer.”

---

AVOID:
- starting every hook the same way
- soft language
- encouragement tone
- tips/advice tone
- long sentences

---

GOOD EXAMPLES:
“You were following… until they looked at you.”
“You knew what they said. Now what?”
“They switched to you. And everything disappeared.”
“You don’t freeze because you don’t know French.”

BAD EXAMPLES:
“You can improve your French by practicing more”
“When learning French, it’s important to…”
“I get what they’re saying but I panic”

---
ADDITIONAL HOOK RULE (CRITICAL):

Hooks must capture a SPECIFIC moment in time.

Do NOT write general statements.
Focus on the exact second the problem happens.

The hook should feel like:
- a moment
- a reaction
- a pause
- a social situation
---

INTENSITY RULE (VERY IMPORTANT):

Hooks must NOT feel safe or generic.

Avoid:
- explaining the situation
- neutral phrasing
- soft wording

Hooks must feel:
- sharp
- slightly uncomfortable
- like a real moment happening

Focus on the exact second things go wrong.

---

WEAK:
"You understood everything but now you can't respond."

STRONG:
"You knew exactly what they said… until they looked at you."

---

WEAK:
"You struggle to speak French in conversations."

STRONG:
"They look at you… and suddenly you have nothing."

---

RULE:
If the hook feels like an explanation → rewrite it.
If it feels like a moment → it's correct.
GOOD:
“They look at you… and everything disappears.”
“You knew what they said. Now say it back.”
“It made sense… until it was your turn.”

BAD:
“You understand French but can’t respond.”
“You struggle to speak French in conversations.”

Hooks should feel like a scene, not an explanation.
REEL RULES:

ONLY 2 slides.

Slide 1:
- ONLY the hook
- No brackets
- No descriptions
- No explanations

BAD:
[Text on screen with Yasmin's internal voice...]

GOOD:
They look at you… and suddenly you have nothing.

Slide 2:
- One practical French phrase
- MUST default to “vous” form (professional tone)
- Must feel natural (not textbook)
- Include pronunciation (simple, one line)
- Include English meaning

The phrase must feel like something she can use immediately in real conversation.

---

CAPTION RULES:

- Speak like you’re talking to ONE person
- Short paragraphs
- Emotional, not explanatory
- Mirror her experience first
- Then give solution

Structure:
1. Real-life moment
2. Emotional tension
3. Why it happens (simple)
4. Solution

Tone:
- conversational
- human
- slightly dramatic
- validating

Avoid:
- long explanations
- academic tone
- textbook language

---

CTA RULES:

Always include:
- Save this for later
- Comment "KIT" and I’ll send you more phrases

---

OUTPUT FORMAT:

Core Pain:
Emotion:
Relevance:

Hooks:
1.
2.
3.
4.
5.

Best Hook:

Reel:
Slide 1:
Slide 2:

Caption:

CTA:`;

const elements = {
  apiKey: document.getElementById("apiKey"),
  model: document.getElementById("model"),
  sourceInput: document.getElementById("sourceInput"),
  generateBtn: document.getElementById("generateBtn"),
  saveBtn: document.getElementById("saveBtn"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  historyList: document.getElementById("historyList"),
  statusText: document.getElementById("statusText"),
  insightBlock: document.getElementById("insightBlock"),
  hooksBlock: document.getElementById("hooksBlock"),
  reelBlock: document.getElementById("reelBlock"),
  captionBlock: document.getElementById("captionBlock"),
  ctaBlock: document.getElementById("ctaBlock"),
};

let currentOutput = null;

hydrateSettings();
renderHistory();
attachEvents();

function attachEvents() {
  elements.generateBtn.addEventListener("click", handleGenerate);
  elements.saveBtn.addEventListener("click", handleSave);
  elements.clearHistoryBtn.addEventListener("click", clearHistory);
  elements.apiKey.addEventListener("input", persistSettings);
  elements.model.addEventListener("input", persistSettings);

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.dataset.copyTarget;
      const target = document.getElementById(targetId);
      if (!target || target.classList.contains("empty-state")) {
        setStatus("Nothing to copy yet.", "error");
        return;
      }

      const content = target.innerText.trim();
      try {
        await navigator.clipboard.writeText(content);
        setStatus("Copied to clipboard.", "success");
      } catch (error) {
        setStatus("Copy failed. Your browser may block clipboard access here.", "error");
      }
    });
  });
}

function hydrateSettings() {
  elements.apiKey.value = localStorage.getItem(STORAGE_KEYS.apiKey) || "";
  elements.model.value = localStorage.getItem(STORAGE_KEYS.model) || "gpt-4.1-mini";

  const latest = safeJsonParse(localStorage.getItem(STORAGE_KEYS.latest));
  if (latest) {
    currentOutput = latest;
    renderOutput(latest);
    elements.saveBtn.disabled = false;
    setStatus("Loaded your latest generated output.", "success");
  }
}

function persistSettings() {
  localStorage.setItem(STORAGE_KEYS.apiKey, elements.apiKey.value.trim());
  localStorage.setItem(STORAGE_KEYS.model, elements.model.value.trim());
}

async function handleGenerate() {
  const sourceText = elements.sourceInput.value.trim();
  if (!sourceText) {
    setStatus("Paste a Reddit post or idea first.", "error");
    return;
  }

  setBusy(true);
  setStatus("Generating content...", "");

  try {
    const apiKey = elements.apiKey.value.trim();
    const model = elements.model.value.trim() || "gpt-4.1-mini";
    const output = apiKey
      ? await generateWithOpenAI({ apiKey, model, sourceText })
      : generateLocalDraft(sourceText);

    currentOutput = output;
    localStorage.setItem(STORAGE_KEYS.latest, JSON.stringify(output));
    renderOutput(output);
    elements.saveBtn.disabled = false;
    setStatus(
      apiKey
        ? "Fresh AI output generated."
        : "Local draft generated. Add an API key anytime for model-powered output.",
      "success"
    );
  } catch (error) {
    const fallback = generateLocalDraft(sourceText);
    currentOutput = fallback;
    localStorage.setItem(STORAGE_KEYS.latest, JSON.stringify(fallback));
    renderOutput(fallback);
    elements.saveBtn.disabled = false;
    setStatus(`AI generation failed, so a local draft was created instead. ${error.message}`, "error");
  } finally {
    setBusy(false);
  }
}

async function generateWithOpenAI({ apiKey, model, sourceText }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Create Instagram content from this Reddit post or idea:\n\n${sourceText}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed (${response.status}). ${errorText.slice(0, 180)}`);
  }

  const data = await response.json();
  const rawText = extractResponseText(data);
  const parsed = parseStructuredOutput(rawText);

  if (!parsed.bestHook || parsed.hooks.length < 5) {
    throw new Error("The model response did not match the required format.");
  }

  return {
    ...parsed,
    sourceText,
    rawText,
    createdAt: new Date().toISOString(),
    origin: "openai",
  };
}

function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const pieces = [];
  (data.output || []).forEach((item) => {
    (item.content || []).forEach((contentItem) => {
      if (contentItem.type === "output_text" && contentItem.text) {
        pieces.push(contentItem.text);
      }
    });
  });

  return pieces.join("\n").trim();
}

function parseStructuredOutput(rawText) {
  const corePain = matchSection(rawText, "Core Pain", "Emotion");
  const emotion = matchSection(rawText, "Emotion", "Relevance");
  const relevance = matchSection(rawText, "Relevance", "Hooks");
  const hooksSection = matchSection(rawText, "Hooks", "Best Hook");
  const bestHook = matchSection(rawText, "Best Hook", "Reel");
  const reelSection = matchSection(rawText, "Reel", "Caption");
  const caption = matchSection(rawText, "Caption", "CTA");
  const cta = matchSection(rawText, "CTA", null);

  const hooks = hooksSection
    .split(/\n+/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  const slide1 = matchSection(reelSection, "Slide 1", "Slide 2");
  const slide2 = matchSection(reelSection, "Slide 2", null);

  return {
    corePain,
    emotion,
    relevance,
    hooks,
    bestHook,
    reel: {
      slide1,
      slide2,
    },
    caption,
    cta,
  };
}

function matchSection(text, startLabel, endLabel) {
  const escapedStart = startLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = endLabel ? endLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : null;
  const regex = escapedEnd
    ? new RegExp(`${escapedStart}:\\s*([\\s\\S]*?)\\s*${escapedEnd}:`, "i")
    : new RegExp(`${escapedStart}:\\s*([\\s\\S]*)$`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function generateLocalDraft(sourceText) {
  const normalized = sourceText.toLowerCase();
  const pain = inferPain(normalized);
  const emotion = inferEmotion(normalized);
  const relevance = inferRelevance(normalized);
  const hooks = buildHooks(pain, emotion, sourceText);
  const bestHook = hooks[0];
  const phrase = inferPhrase(normalized);
  const caption = `That moment when the conversation moves fast, everyone keeps going, and you are still trying to decode what was just said. ${pain} This is exactly why ready-to-use phrases matter in real life, especially when you want to stay composed at work and not default to silence.`;
  const cta = `Save this for later. Comment "KIT" and I’ll send you more phrases.`;

  return {
    sourceText,
    rawText: "",
    corePain: pain,
    emotion,
    relevance,
    hooks,
    bestHook,
    reel: {
      slide1: bestHook,
      slide2: `${phrase.french}\nPronunciation: ${phrase.pronunciation}\nMeaning: ${phrase.meaning}`,
    },
    caption,
    cta,
    createdAt: new Date().toISOString(),
    origin: "local",
  };
}

function inferPain(normalized) {
  if (normalized.includes("meeting") || normalized.includes("work") || normalized.includes("office")) {
    return "She understands enough to follow the topic, but freezes when she needs to respond professionally in the moment.";
  }

  if (normalized.includes("fast") || normalized.includes("conversation")) {
    return "She loses the thread when French gets fast, then says nothing because she is scared of sounding awkward.";
  }

  return "She knows some French, but real conversations still catch her off guard when she needs a natural response fast.";
}

function inferEmotion(normalized) {
  if (normalized.includes("embarrass") || normalized.includes("stupid")) {
    return "Embarrassed and self-conscious";
  }

  if (normalized.includes("meeting") || normalized.includes("boss")) {
    return "Tense and under pressure";
  }

  return "Frustrated and quietly anxious";
}

function inferRelevance(normalized) {
  const highSignals = ["france", "paris", "meeting", "coworker", "boss", "client", "conversation"];
  return highSignals.some((signal) => normalized.includes(signal)) ? "High" : "Medium";
}

function buildHooks(pain, emotion, sourceText) {
  const scene = sourceText.split(/[.!?\n]/).find(Boolean)?.trim() || "the conversation keeps moving without you";
  return [
    `Everyone kept talking, and you were still translating in your head.`,
    `That moment in a meeting when ${truncate(scene, 52)}.`,
    `Say something smart. Say something smart. Say something smart.`,
    `Understanding French is not the same as surviving real conversations.`,
    `The competent woman disappears the second the room switches to fast French.`,
  ];
}

function inferPhrase(normalized) {
  if (normalized.includes("repeat") || normalized.includes("understand")) {
    return {
      french: "Pouvez-vous reformuler, s'il vous plait ?",
      pronunciation: "poo-vay voo ruh-for-myoo-lay, seel voo pleh",
      meaning: "Could you rephrase that, please?",
    };
  }

  if (normalized.includes("meeting") || normalized.includes("clarify")) {
    return {
      french: "Si je comprends bien, vous voulez dire que...",
      pronunciation: "see juh kom-pron byan, voo voo-lay deer kuh...",
      meaning: "If I understand correctly, you mean that...",
    };
  }

  return {
    french: "Pouvez-vous parler un peu plus lentement ?",
    pronunciation: "poo-vay voo par-lay uhn puh ploo lont-mohn",
    meaning: "Could you speak a little more slowly?",
  };
}

function renderOutput(output) {
  elements.insightBlock.classList.remove("empty-state");
  elements.hooksBlock.classList.remove("empty-state");
  elements.reelBlock.classList.remove("empty-state");
  elements.captionBlock.classList.remove("empty-state");
  elements.ctaBlock.classList.remove("empty-state");

  elements.insightBlock.innerHTML = `
    <div class="output-item"><span class="output-label">Core Pain</span>${escapeHtml(output.corePain)}</div>
    <div class="output-item"><span class="output-label">Emotion</span>${escapeHtml(output.emotion)}</div>
    <div class="output-item"><span class="output-label">Relevance</span>${escapeHtml(output.relevance)}</div>
  `;

  elements.hooksBlock.innerHTML = `
    <div class="output-item">
      <span class="output-label">Hooks</span>
      <ol class="hook-list">
        ${output.hooks.map((hook) => `<li>${escapeHtml(hook)}</li>`).join("")}
      </ol>
    </div>
    <div class="output-item"><span class="output-label">Best Hook</span>${escapeHtml(output.bestHook)}</div>
  `;

  elements.reelBlock.innerHTML = `
    <div class="output-item"><span class="output-label">Slide 1</span>${escapeHtml(output.reel.slide1)}</div>
    <div class="output-item"><span class="output-label">Slide 2</span>${escapeHtml(output.reel.slide2).replace(/\n/g, "<br />")}</div>
  `;

  elements.captionBlock.innerHTML = `
    <div class="output-item"><span class="output-label">Caption</span>${escapeHtml(output.caption)}</div>
  `;

  elements.ctaBlock.innerHTML = `
    <div class="output-item"><span class="output-label">CTA</span>${escapeHtml(output.cta)}</div>
  `;
}

function handleSave() {
  if (!currentOutput) {
    setStatus("Generate something before saving.", "error");
    return;
  }

  const history = loadHistory();
  history.unshift({
    id: crypto.randomUUID(),
    ...currentOutput,
  });
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, 20)));
  renderHistory();
  setStatus("Saved to local history.", "success");
}

function renderHistory() {
  const history = loadHistory();
  if (!history.length) {
    elements.historyList.innerHTML = `<div class="empty-state">No saved outputs yet.</div>`;
    return;
  }

  elements.historyList.innerHTML = history
    .map((item) => {
      const date = new Date(item.createdAt).toLocaleString();
      return `
        <article class="history-item">
          <div class="history-item-head">
            <div class="history-title">${escapeHtml(item.bestHook || "Untitled output")}</div>
            <button class="history-load" type="button" data-history-id="${item.id}">Load</button>
          </div>
          <div class="history-meta">${escapeHtml(date)} · ${escapeHtml(item.origin || "saved")}</div>
          <p class="history-preview">${escapeHtml(truncate(item.sourceText || "", 110))}</p>
        </article>
      `;
    })
    .join("");

  elements.historyList.querySelectorAll("[data-history-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const historyItem = history.find((item) => item.id === button.dataset.historyId);
      if (!historyItem) {
        return;
      }

      currentOutput = historyItem;
      elements.sourceInput.value = historyItem.sourceText || "";
      renderOutput(historyItem);
      elements.saveBtn.disabled = false;
      localStorage.setItem(STORAGE_KEYS.latest, JSON.stringify(historyItem));
      setStatus("Saved output loaded.", "success");
    });
  });
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.history);
  renderHistory();
  setStatus("Saved history cleared.", "success");
}

function loadHistory() {
  return safeJsonParse(localStorage.getItem(STORAGE_KEYS.history)) || [];
}

function setBusy(isBusy) {
  elements.generateBtn.disabled = isBusy;
  elements.saveBtn.disabled = isBusy || !currentOutput;
  elements.generateBtn.textContent = isBusy ? "Generating..." : "Generate";
}

function setStatus(message, tone) {
  elements.statusText.textContent = message;
  if (tone) {
    elements.statusText.dataset.tone = tone;
  } else {
    delete elements.statusText.dataset.tone;
  }
}

function safeJsonParse(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
