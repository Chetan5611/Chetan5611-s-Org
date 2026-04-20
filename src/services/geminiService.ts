import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// We define it as genAI here...
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface TaskJSON {
  task_name: string;
  priority: "Low" | "Medium" | "High";
  category: "Personal" | "Work" | "Academic" | "NGO";
  action_items: string[];
  estimated_hours: number;
}

// ...so we must use genAI here!
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        task_name: { type: SchemaType.STRING },
        priority: { type: SchemaType.STRING, enum: ["Low", "Medium", "High"] },
        category: { type: SchemaType.STRING, enum: ["Personal", "Work", "Academic", "NGO"] },
        action_items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        estimated_hours: { type: SchemaType.NUMBER },
      },
      required: ["task_name", "priority", "category", "action_items", "estimated_hours"],
    },
  },
  systemInstruction: "You are a backend JSON parser for a Management System. Extract task details precisely. Only output valid JSON.",
});

export async function parseTask(input: string): Promise<TaskJSON> {
  // Use the 'model' we defined above
  const result = await model.generateContent(`Parse this natural language task: "${input}"`);
  const response = await result.response;
  const text = response.text();
  
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as TaskJSON;
}
