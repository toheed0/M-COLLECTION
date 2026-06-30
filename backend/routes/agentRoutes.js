const express = require("express");
const Groq = require("groq-sdk");
const Product = require("../models/product");

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Tool definition — Groq is se DB search karega
const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description: "Search products in the store database. Call this for any product-related query.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "Product type e.g. coat, shirt, pant, dress",
          },
          color: {
            type: "string",
            description: "Color e.g. black, white, red",
          },
          category: {
            type: "string",
            description: "Category e.g. Top Wear, Bottom Wear",
          },
          gender: {
            type: "string",
            enum: ["Men", "Women", "Unisex"],
            description: "Men or Women or Unisex",
          },
        },
        required: [],
      },
    },
  },
];

// Synonym map — har category alag rakhi hai taake cross-match na ho
const synonyms = {
  jeans: ["jeans", "denim"],
  pant: ["pant", "pants", "trouser", "trousers", "chino"],
  pants: ["pant", "pants", "trouser", "trousers", "chino"],
  trouser: ["trouser", "trousers", "pant", "pants", "chino"],
  tshirt: ["tshirt", "t-shirt", "t shirt"],
  "t-shirt": ["tshirt", "t-shirt", "t shirt"],
  shirt: ["shirt"],
  top: ["top", "blouse"],
  dress: ["dress", "frock", "gown", "maxi"],
  jacket: ["jacket", "coat", "blazer", "overcoat"],
  coat: ["coat", "jacket", "blazer", "overcoat"],
  blazer: ["blazer", "coat", "jacket"],
  hoodie: ["hoodie", "sweatshirt", "sweater"],
  shoes: ["shoes", "sneakers", "boots", "sandals"],
  kurta: ["kurta", "kameez"],
  shalwar: ["shalwar", "shalwar kameez"],
};

function expandKeywords(keyword) {
  if (!keyword) return [];
  const words = keyword.toLowerCase().split(/\s+/);
  const expanded = new Set(words);
  words.forEach((w) => {
    if (synonyms[w]) synonyms[w].forEach((s) => expanded.add(s));
  });
  return [...expanded];
}

// DB search function
async function searchProducts({ keyword, color, category, gender }) {
  const query = { isPublished: true };

  if (keyword) {
    const terms = expandKeywords(keyword);
    const regexConditions = terms.flatMap((term) => [
      { name: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
      { tag: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
      { collections: { $regex: term, $options: "i" } },
      { materials: { $regex: term, $options: "i" } },
    ]);
    query.$or = regexConditions;
  }

  if (color) query.colors = { $regex: color, $options: "i" };
  if (category) query.category = { $regex: category, $options: "i" };
  if (gender) query.gender = new RegExp(`^${gender}$`, "i");

  let products = await Product.find(query)
    .select("name price discountPrice colors sizes category gender images collections")
    .limit(20)
    .lean();

  // Fallback: agar kuch na mile toh color/gender ke bina broad search
  if (products.length === 0 && keyword) {
    const terms = expandKeywords(keyword);
    const broadQuery = {
      $or: terms.flatMap((term) => [
        { name: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ]),
    };
    products = await Product.find(broadQuery)
      .select("name price discountPrice colors sizes category gender images collections")
      .limit(20)
      .lean();
  }

  return products;
}

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) return res.status(400).json({ message: "Message required" });

    const systemPrompt = `You are a shopping assistant for M-Collection fashion store. Always use the searchProducts tool when user asks about any clothing or product. Extract keyword (product type only, no gender words) and gender (man/mard/gents=Men, woman/aurat/lady=Women) separately. After tool returns results, list all products by name and price. If found:0, say not available. Respond in user's language (Urdu/English).`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6), // last 3 exchanges for context
      { role: "user", content: message },
    ];

    // First call — let Groq decide if tool is needed
    const firstResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
      tool_choice: "auto",
      max_tokens: 1024,
    });

    const firstChoice = firstResponse.choices[0].message;

    // If Groq wants to call the tool
    if (firstChoice.tool_calls && firstChoice.tool_calls.length > 0) {
      const toolCall = firstChoice.tool_calls[0];
      const rawArgs = JSON.parse(toolCall.function.arguments);

      // Empty strings clean karo
      const clean = (v) => (v === "" || v == null ? undefined : v);
      const args = {
        keyword: clean(rawArgs.keyword),
        color: clean(rawArgs.color),
        category: clean(rawArgs.category),
        gender: clean(rawArgs.gender),
      };

      const products = await searchProducts(args);

      const productSummary =
        products.length > 0
          ? products.map((p) => ({
              name: p.name,
              price: p.price,
              discountPrice: p.discountPrice,
              colors: p.colors,
              sizes: p.sizes,
              category: p.category,
              gender: p.gender,
              id: p._id,
            }))
          : [];

      // Second call — with tool results
      const secondResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          ...messages,
          firstChoice,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(
              productSummary.length > 0
                ? {
                    found: productSummary.length,
                    instruction: `EXACTLY ${productSummary.length} products found. List ALL of them. Do not say 1 if found is ${productSummary.length}.`,
                    products: productSummary,
                  }
                : { found: 0, instruction: "No products found. Tell user politely." }
            ),
          },
        ],
        max_tokens: 1024,
      });

      const finalReply = secondResponse.choices[0].message.content;
      return res.json({ reply: finalReply, products: productSummary });
    }

    // No tool call — direct answer
    return res.json({ reply: firstChoice.content, products: [] });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ message: "Agent error: " + error.message });
  }
});

module.exports = router;
