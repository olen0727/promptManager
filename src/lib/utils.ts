import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Variable {
  key: string;
  raw: string;
  options: string[];
}

/**
 * Extract variables from prompt content
 * Variables are in the format {{variableName}} or {{variableName:Option1,Option2}}
 */
export function extractVariables(content: string): Variable[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = [...content.matchAll(regex)];

  const uniqueVars = new Map<string, Variable>();

  for (const match of matches) {
    const rawContent = match[1]?.trim();
    if (!rawContent) continue;

    const parts = rawContent.split(":");
    const keyPart = parts[0];
    const rest = parts.slice(1);

    if (!keyPart) continue;

    const key = keyPart.trim();
    const optionsString = rest.join(":"); // Re-join in case options contain colons (though unlikely for this syntax)

    // Parse options if present
    const options = optionsString
      ? optionsString.split(",").map(o => o.trim()).filter(Boolean)
      : [];

    // If variable not seen yet, or if this instance has options and previous didn't, update it
    if (!uniqueVars.has(key) || (options.length > 0 && uniqueVars.get(key)!.options.length === 0)) {
      uniqueVars.set(key, {
        key,
        raw: rawContent,
        options
      });
    }
  }

  return Array.from(uniqueVars.values());
}

/**
 * Fill variables in prompt content
 */
export function fillVariables(content: string, values: Record<string, string>): string {
  return content.replace(/\{\{([^}]+)\}\}/g, (_, rawContent) => {
    // Handle both {{Key}} and {{Key:Opt1,Opt2}}
    const key = rawContent.split(":")[0].trim();
    return values[key] ?? `{{${rawContent}}}`;
  });
}
