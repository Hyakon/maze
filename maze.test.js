const { expect } = require("@jest/globals");
const { describe } = require("yargs");

test("Somme", () => {
  const a = 2 + 2;
  expect(a).toBe(4);
});

describe("maze", () => {
  it("Somme", () => {
    const a = 2 + 2;
    expect(a).toBe(4);
  });
  test("Somme", () => {
    const a = 2 + 2;
    expect(a).toBe(4);
  });
});
