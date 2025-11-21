import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SymbolProvider, useSymbolContext } from "../context/SymbolContext";
import DataTable from "./DataTable";

let contextRef: any = null;

function ProviderHelper({ children }: any) {
  contextRef = useSymbolContext();
  return <>{children}</>;
}

function renderDataTable() {
  return render(
    <SymbolProvider>
      <ProviderHelper>
        <DataTable />
        <div data-testid="symbols">{contextRef?.symbolList.join(",")}</div>
      </ProviderHelper>
    </SymbolProvider>
  );
}

describe("DataTable", () => {
  it("shows price in green when price increase", () => {
    const { rerender } = renderDataTable();

    contextRef.addSymbol("AAPL");
    contextRef.updatePrice("AAPL", "100", "2025-11-21T10:00:00Z");
    contextRef.updatePrice("AAPL", "120", "2025-11-21T10:01:00Z");

    rerender(
      <SymbolProvider>
        <ProviderHelper>
          <DataTable />
          <div data-testid="symbols">{contextRef?.symbolList.join(",")}</div>
        </ProviderHelper>
      </SymbolProvider>
    );

    const priceCell = screen.getByText("120");
    expect(priceCell.className).toContain("text-green-500");
  });

  it("shows price in red when price decreases", () => {
    const { rerender } = renderDataTable();

    contextRef.addSymbol("AAPL");
    contextRef.updatePrice("AAPL", "120", "2025-11-21T10:01:00Z");
    contextRef.updatePrice("AAPL", "80", "2025-11-21T10:02:00Z");

    rerender(
      <SymbolProvider>
        <ProviderHelper>
          <DataTable />
          <div data-testid="symbols">{contextRef?.symbolList.join(",")}</div>
        </ProviderHelper>
      </SymbolProvider>
    );

    const priceCellNew = screen.getByText("80");
    expect(priceCellNew.className).toContain("text-red-500");
  });
});
