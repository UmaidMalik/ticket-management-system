import { describe, expect, it } from "vitest";
import { getUserNameById } from "@/lib/users";
import type { User } from "@/types";

const users: User[] = [
  { id: 1, name: "Umaid" },
  { id: 2, name: "Syeda" },
];

describe("getUserNameById", () => {
  it("returns the user name when the user exists", () => {
    expect(getUserNameById(users, 1)).toBe("Umaid");
  });

  it("returns Unassigned when the user id is null", () => {
    expect(getUserNameById(users, null)).toBe("Unassigned");
  });

  it("returns Unknown User when the user does not exist", () => {
    expect(getUserNameById(users, 999)).toBe("Unknown User");
  });
});