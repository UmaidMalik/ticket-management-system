import type { User } from "@/types.ts";

export function getUserNameById(users: User[], userId: number | null): string {
    if (userId === null) {
        return "Unassigned";
    }

    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
}

