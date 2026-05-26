import { SHOW_ERRORS } from "@/constants";
import { getErrorMessage } from "@/shared/errorMapper";

describe("getErrorMessage", () => {
  it("should return correct message for NOT_FOUND", () => {
    const error = { type: "NOT_FOUND" } as const;
    expect(getErrorMessage(error)).toBe(SHOW_ERRORS.SHOW_NOT_FOUND);
  });

  it("should return null for ABORTED errors", () => {
    const error = { type: "ABORTED" } as const;
    expect(getErrorMessage(error)).toBeNull();
  });

  it("should return a parse error message for PARSE type", () => {
    const error = { type: "PARSE" } as const;
    expect(getErrorMessage(error)).toBe(SHOW_ERRORS.RESPONSE_PARSE_ERROR);
  });

  it("should return a timeout message for TIMEOUT type", () => {
    const error = { type: "TIMEOUT" } as const;
    expect(getErrorMessage(error)).toBe(SHOW_ERRORS.REQUEST_TIMEOUT);
  });

  it("should handle SERVER errors with status codes", () => {
    const error = { type: "SERVER", status: 500 } as const;
    expect(getErrorMessage(error)).toBe(SHOW_ERRORS.SHOW_DETAIL_FETCH_ERROR);
  });
});
