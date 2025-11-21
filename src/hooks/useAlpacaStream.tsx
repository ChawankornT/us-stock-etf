import { useEffect, useRef } from "react";
import { useSymbolContext } from "../context/SymbolContext";
import config from "../utils/alpacaConfig";

export default function useAlpacaStream() {
  const { symbolList, updatePrice } = useSymbolContext();
  const socket = useRef<WebSocket | null>(null);
  const prevSymbols = useRef<string[]>([]);

  useEffect(() => {
    socket.current = new WebSocket("wss://stream.data.alpaca.markets/v2/iex");
    socket.current.onopen = () => {
      console.log("WebSocket connecting");

      socket.current?.send(
        JSON.stringify({
          action: "auth",
          key: config.KEY,
          secret: config.SECRET,
        })
      );
    };

    socket.current.onmessage = (event) => {
      const res = JSON.parse(event.data);

      res.forEach((msg: any) => {
        if (msg.T === "success" && msg.msg === "authenticated") {
          console.log("WebSocket authenticated");
        }

        if (msg.T === "t") {
          updatePrice(msg.S, msg.p, msg.t);
        }
      });
    };

    return () => {
      console.log("Cleanup previous");
      socket.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!socket.current) return;
    if (socket.current.readyState !== 1)
      return console.log("WebSocket not ready");

    const newSymbol = symbolList.filter(
      (s) => !prevSymbols.current.includes(s)
    );
    const removed = prevSymbols.current.filter((s) => !symbolList.includes(s));

    subscribe(newSymbol);
    unsubscribe(removed);

    prevSymbols.current = symbolList;
  }, [symbolList]);

  const subscribe = (symbols) => {
    if (symbols.length > 0) {
      socket.current?.send(
        JSON.stringify({
          action: "subscribe",
          trades: symbols,
        })
      );
      console.log(`subscribe: ${symbols}`);
    }
  };

  const unsubscribe = (symbols) => {
    if (symbols.length > 0) {
      socket.current?.send(
        JSON.stringify({
          action: "unsubscribe",
          trades: symbols,
        })
      );
      console.log(`unsubscribe: ${symbols}`);
    }
  };
}
