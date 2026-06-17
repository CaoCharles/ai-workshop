import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";

export type Bubble = { text: string; count: number };

type Node = SimulationNodeDatum & {
  text: string;
  count: number;
  r: number;
};

const PALETTE = ["#0E5A38", "#1C8B5A", "#37A871", "#0a3a26", "#5aa17a"];

export default function BubbleChart({ data }: { data: Bubble[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [nodes, setNodes] = useState<Node[]>([]);

  // 監看容器寬度做 RWD。
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ w: cr.width, h: Math.max(420, Math.min(cr.width * 0.7, 640)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 依詞頻換算半徑：用 sqrt 讓面積大致正比於次數。
  const seedNodes = useMemo<Node[]>(() => {
    const counts = data.map((d) => d.count);
    const totalCount = counts.reduce((a, b) => a + b, 0) || 1;

    // 依「容器面積」自動換算半徑：泡泡越多顆，每顆就越小，總面積維持在容器的一定比例內，
    // 這樣不管 1 顆還是 30 顆都不會爆出框。半徑正比於 sqrt(count)（面積正比於 count）。
    const fill = 0.62; // 泡泡總面積約佔容器的 62%
    const k = Math.sqrt((fill * size.w * size.h) / (Math.PI * totalCount));
    const minR = Math.max(16, Math.min(size.w, size.h) / 16);
    const maxR = Math.min(size.w, size.h) / 3;

    return data.map((d) => ({
      text: d.text,
      count: d.count,
      r: Math.max(minR, Math.min(maxR, k * Math.sqrt(d.count))),
      x: size.w / 2 + (Math.random() - 0.5) * 40,
      y: size.h / 2 + (Math.random() - 0.5) * 40,
    }));
  }, [data, size.w, size.h]);

  // 用 d3-force 做泡泡碰撞排列。
  useEffect(() => {
    if (seedNodes.length === 0) {
      setNodes([]);
      return;
    }
    const pad = 4;
    const clamp = (n: Node) => {
      // 把每顆泡泡夾在容器邊界內，避免被切到框外（跑版）。
      n.x = Math.max(n.r + pad, Math.min(size.w - n.r - pad, n.x ?? size.w / 2));
      n.y = Math.max(n.r + pad, Math.min(size.h - n.r - pad, n.y ?? size.h / 2));
    };
    const sim = forceSimulation<Node>(seedNodes)
      .force("charge", forceManyBody().strength(3))
      .force("center", forceCenter(size.w / 2, size.h / 2))
      .force("x", forceX(size.w / 2).strength(0.08))
      .force("y", forceY(size.h / 2).strength(0.12))
      .force("collide", forceCollide<Node>((d) => d.r + 3).iterations(4))
      .on("tick", () => {
        for (const n of sim.nodes()) clamp(n);
        setNodes([...sim.nodes()]);
      });
    sim.alpha(1).restart();
    return () => {
      sim.stop();
    };
  }, [seedNodes, size.w, size.h]);

  if (data.length === 0) {
    return (
      <div
        ref={wrapRef}
        className="flex items-center justify-center text-brand-dark/40 text-lg"
        style={{ height: 420 }}
      >
        還沒有人填寫，等第一個泡泡出現…
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="w-full">
      <svg width={size.w} height={size.h} className="overflow-visible">
        {nodes.map((n, i) => {
          const fontSize = Math.max(11, Math.min(n.r / 2.4, 30));
          return (
            <g key={n.text} transform={`translate(${n.x ?? 0}, ${n.y ?? 0})`}>
              <circle r={n.r} fill={PALETTE[i % PALETTE.length]} opacity={0.9} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={fontSize}
                fontWeight={600}
                style={{ pointerEvents: "none" }}
              >
                {n.text}
              </text>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={fontSize + 2}
                fill="white"
                fontSize={Math.max(9, fontSize * 0.6)}
                opacity={0.85}
                style={{ pointerEvents: "none" }}
              >
                {n.count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
