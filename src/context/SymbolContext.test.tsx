import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SymbolProvider, useSymbolContext } from "../context/SymbolContext";

function renderUseSymbolContext() {
  const wrapper = ({ children }: any) => (
    <SymbolProvider>{children}</SymbolProvider>
  );
  return renderHook(() => useSymbolContext(), { wrapper });
}

describe("SymbolContext", () => {
  it("adds symbol", () => {
    const { result } = renderUseSymbolContext();

    act(() => {
      result.current.addSymbol("AAPL");
    });

    expect(result.current.symbolList).toContain("AAPL");
  });

  it("edit symbol", () => {
    const { result } = renderUseSymbolContext();

    act(() => {
      result.current.addSymbol("AAPL");
      result.current.editSymbol("AAPL", "TSLA");
    });

    expect(result.current.symbolList).toContain("TSLA");
    expect(result.current.symbolList).not.toContain("AAPL");
  });

  it("remove symbol", () => {
    const { result } = renderUseSymbolContext();

    act(() => {
      result.current.addSymbol("AAPL");
      result.current.removeSymbol("AAPL");
    });

    expect(result.current.symbolList).not.toContain("AAPL");
  });

  it("hard refresh", () => {
    const wrapper = ({ children }: any) => (
      <SymbolProvider>{children}</SymbolProvider>
    );
    const { result, unmount } = renderHook(() => useSymbolContext(), {
      wrapper,
    });

    act(() => {
      result.current.addSymbol("AAPL");
    });
    expect(result.current.symbolList).toContain("AAPL");

    unmount();
    const { result: newResult } = renderHook(() => useSymbolContext(), {
      wrapper,
    });
    expect(newResult.current.symbolList).toEqual([]);
  });
});
