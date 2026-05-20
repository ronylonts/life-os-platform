const BUBBLES = [
  { size: 80, left: "8%", delay: "0s", duration: "14s", opacity: 0.35 },
  { size: 120, left: "18%", delay: "2s", duration: "18s", opacity: 0.25 },
  { size: 60, left: "28%", delay: "1s", duration: "12s", opacity: 0.4 },
  { size: 100, left: "72%", delay: "3s", duration: "16s", opacity: 0.3 },
  { size: 140, left: "82%", delay: "0.5s", duration: "20s", opacity: 0.2 },
  { size: 50, left: "88%", delay: "4s", duration: "11s", opacity: 0.45 },
  { size: 90, left: "5%", delay: "5s", duration: "15s", opacity: 0.28 },
  { size: 70, left: "45%", delay: "2.5s", duration: "13s", opacity: 0.32 },
  { size: 110, left: "55%", delay: "1.5s", duration: "17s", opacity: 0.22 },
  { size: 40, left: "35%", delay: "6s", duration: "10s", opacity: 0.5 },
  { size: 65, left: "62%", delay: "3.5s", duration: "14s", opacity: 0.38 },
  { size: 95, left: "92%", delay: "7s", duration: "19s", opacity: 0.26 },
  { size: 55, left: "12%", delay: "8s", duration: "12s", opacity: 0.42 },
  { size: 130, left: "38%", delay: "4.5s", duration: "21s", opacity: 0.18 },
  { size: 75, left: "78%", delay: "6.5s", duration: "15s", opacity: 0.33 },
];

export function FloatingBubbles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {BUBBLES.map((bubble, index) => (
        <span
          key={index}
          className="bubble absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            bottom: "-10%",
            opacity: bubble.opacity,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
    </div>
  );
}
