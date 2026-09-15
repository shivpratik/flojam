import { describe, expect, it } from "vitest";
import {
  fromRoomId,
  generateCode,
  isValidCode,
  normalizeCode,
  toRoomId,
} from "./rooms";

describe("generateCode", () => {
  it("produces valid codes", () => {
    for (let i = 0; i < 100; i++) {
      expect(isValidCode(generateCode())).toBe(true);
    }
  });
});

describe("isValidCode", () => {
  it("accepts the xxx-xxx format", () => {
    expect(isValidCode("k7x-92p")).toBe(true);
  });

  it("rejects look-alike characters, wrong case and wrong shape", () => {
    expect(isValidCode("k0x-92p")).toBe(false);
    expect(isValidCode("K7X-92P")).toBe(false);
    expect(isValidCode("k7x92p")).toBe(false);
    expect(isValidCode("k7x-92pp")).toBe(false);
  });
});

describe("room ids", () => {
  it("round-trips a code", () => {
    expect(fromRoomId(toRoomId("k7x-92p"))).toBe("k7x-92p");
  });

  it("rejects foreign or malformed room ids", () => {
    expect(fromRoomId("other:k7x-92p")).toBeNull();
    expect(fromRoomId("flowchart:nope")).toBeNull();
  });
});

describe("normalizeCode", () => {
  it.each([
    ["k7x-92p", "k7x-92p"],
    ["K7X 92P", "k7x-92p"],
    ["  k7x92p ", "k7x-92p"],
    ["k7x_92p", "k7x-92p"],
    ["https://flojam.app/room/k7x-92p", "k7x-92p"],
    ["https://flojam.app/room/k7x-92p?x=1#y", "k7x-92p"],
  ])("normalizes %j", (input, expected) => {
    expect(normalizeCode(input)).toBe(expected);
  });

  it.each(["", "k7x-92", "k7x-92pq", "o0o-111", "https://flojam.app/"])(
    "rejects %j",
    (input) => {
      expect(normalizeCode(input)).toBeNull();
    }
  );
});
