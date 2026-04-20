import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure this matches your variable name from Cloud Run
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface TaskJSON {
  task_name: string;
  priority: "Low" | "Medium" | "High";
  category: "Personal" | "Work" | "Academic" | "NGO";
  action_items: string[];
  estimated_hours: number;
}

export async function parseTask(input: string): Promise<TaskJSON> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse this natural language task description into structured JSON: "${input}"`,
    config: {
      systemInstruction: "You are a backend JSON parser for a Management System. Extract task details precisely. If input is vague, make an educated guess based on keywords. Only output valid JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          task_name: { type: Type.STRING, description: "The title of the task" },
          priority: { 
            type: Type.STRING, 
            enum: ["Low", "Medium", "High"],
            description: "Task priority level"
          },
          category: { 
            type: Type.STRING, 
            enum: ["Personal", "Work", "Academic", "NGO"],
            description: "Task category"
          },
          action_items: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Steps required to complete the task"
          },
          estimated_hours: { 
            type: Type.NUMBER, 
            description: "Estimated time in hours"
          },
        },
        required: ["task_name", "priority", "category", "action_items", "estimated_hours"]
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as TaskJSON;
}
