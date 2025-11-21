import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import AddModal from "./AddModal";
import { SymbolProvider, useSymbolContext } from "../context/SymbolContext";
import "@testing-library/jest-dom/vitest";

function TestReader() {
  const { symbolList } = useSymbolContext();
  return <div data-testid="test-symbols">{symbolList.join(",")}</div>;
}

function renderAddModal(defaultSymbol?: string) {
  return render(
    <SymbolProvider>
      <AddModal
        isOpen={true}
        onClose={() => {}}
        defaultSymbol={defaultSymbol}
      />
      <TestReader />
    </SymbolProvider>
  );
}

describe("AddModal", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it("search symbol the add", async () => {
    renderAddModal();

    (globalThis.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        symbol: "AAPL",
        name: "Apple Inc",
        class: "us_equity",
      }),
    });

    fireEvent.change(screen.getByPlaceholderText("AAPL,TSLA"), {
      target: { value: "AAPL" },
    });

    await screen.findByTestId("test-data");
    fireEvent.click(screen.getByText("Add"));

    const symbols = await screen.findByTestId("test-symbols");
    expect(symbols.textContent).toContain("AAPL");
  });

  it("prevent duplicate symbol", async () => {
    renderAddModal();

    (globalThis.fetch as any).mockResolvedValue({
      json: async () => ({
        symbol: "AAPL",
        name: "Apple Inc",
        class: "us_equity",
      }),
    });

    // First add
    fireEvent.change(screen.getByPlaceholderText("AAPL,TSLA"), {
      target: { value: "AAPL" },
    });

    await screen.findByTestId("test-data");
    fireEvent.click(screen.getByText("Add"));

    const symbols1 = await screen.findByTestId("test-symbols");
    expect(symbols1.textContent).toContain("AAPL");

    // Second add
    fireEvent.change(screen.getByPlaceholderText("AAPL,TSLA"), {
      target: { value: "AAPL" },
    });

    await screen.findByTestId("test-data");
    fireEvent.click(screen.getByText("Add"));

    const symbols2 = await screen.findByTestId("test-symbols");
    expect(symbols2.textContent?.split("AAPL").length - 1).toBe(1);

    const errorMessage = await screen.findByText("Duplicate symbol");
    expect(errorMessage).toBeInTheDocument();
  });

  it("limits to 30 symbol", async () => {
    renderAddModal();

    const fetchMock = globalThis.fetch as any;
    for (let i = 1; i <= 31; i++) {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          symbol: `Symbol${i}`,
          name: `Symbol ${i}`,
          class: "us_equity",
        }),
      });
    }

    for (let i = 1; i <= 30; i++) {
      fireEvent.change(screen.getByPlaceholderText("AAPL,TSLA"), {
        target: { value: `Symbol${i}` },
      });

      await screen.findByText(`Symbol${i}`);
      fireEvent.click(screen.getByText("Add"));
    }

    const symbols = await screen.findByTestId("test-symbols");
    expect(symbols.textContent?.split("SYMBOL").length - 1).toBe(30);

    fireEvent.change(screen.getByPlaceholderText("AAPL,TSLA"), {
      target: { value: "Symbol31" },
    });

    // Add 31
    await screen.findByText("Symbol31");
    fireEvent.click(screen.getByText("Add"));
    expect(symbols.textContent?.split("SYMBOL").length - 1).toBe(30);

    const errorMessage = await screen.findByText("Limit 30 symbols");
    expect(errorMessage).toBeInTheDocument();
  });

  it("prevent add non Stock/ETF", async () => {
    renderAddModal();

    (globalThis.fetch as any).mockResolvedValue({
      json: async () => ({
        symbol: "BTC",
        name: "Bit Coin",
        class: "crypto",
      }),
    });

    fireEvent.change(screen.getByPlaceholderText("AAPL,TSLA"), {
      target: { value: "BTC" },
    });

    await screen.findByTestId("test-data");
    fireEvent.click(screen.getByText("Add"));

    const symbols = await screen.findByTestId("test-symbols");
    expect(symbols.textContent).toEqual("");

    const errorMessage = await screen.findByText(
      "This Symbol is not 'US Stock / ETF'"
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
