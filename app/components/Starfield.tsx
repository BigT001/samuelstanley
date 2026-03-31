import { BRIGHT_STARS } from "./data";

export function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {/* Nebula colour gradients */}
      <div className="starfield-nebula" />
      {/* Layer 3: individually twinkling bright stars */}
      {BRIGHT_STARS.map((s, i) => (
        <div
          key={i}
          className="star-bright"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            color: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            ["--dur" as string]: s.dur,
            ["--delay" as string]: s.delay,
          }}
        />
      ))}
    </div>
  );
}
