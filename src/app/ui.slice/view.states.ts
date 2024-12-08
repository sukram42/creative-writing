export type Views = "outline" | "idea" | "final"

export const StepMapping: Record<string, Views[]> = {
    "outlining": ["idea", "outline"],
    "finalizing": ["outline", "final"]
}

export const Steps = Object.keys(StepMapping)
export type StepsType = keyof typeof StepMapping
