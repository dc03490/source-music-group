import { Stagger, StaggerItem } from "@source/ui";

/* Stateless server-rendered editorial list of the label's three principles —
   copy carried over verbatim from the original FeatureCards.
   Safe inside Stagger/StaggerItem because it holds no state. */

const principles = [
  {
    n: "01",
    title: "Marketing Guidance",
    body: "Strategy that cuts through the noise — rollout planning, audience growth, playlist and social positioning, and the data to know what's actually working.",
  },
  {
    n: "02",
    title: "Unique Music",
    body: "We champion artists with a distinct voice. No chasing trends — we help you sharpen what already makes you different and put it in front of the right ears.",
  },
  {
    n: "03",
    title: "Artist Partnership",
    body: "An independent, business-partner relationship — transparent terms, shared upside, and decisions made together. You stay in control of your art and your career.",
  },
];

export function LabelPrinciples() {
  return (
    <Stagger>
      {principles.map((p) => (
        <StaggerItem key={p.n}>
          <div className="border-t border-border py-7">
            <p className="font-mono text-sm text-gold">{p.n}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
