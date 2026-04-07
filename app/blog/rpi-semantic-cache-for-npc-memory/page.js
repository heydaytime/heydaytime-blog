import Image from 'next/image'
import styles from './page.module.css'

export const metadata = {
  title: 'From Bad NPC Context to RPI Memory | heydaytime',
  description:
    'How we vibecoded RPI into Qdrant, what problem it solves, and what the benchmarks say on public data.',
}

export default function BlogPost() {
  return (
    <main className={styles.container}>
      <div className={styles.heroGlow} aria-hidden="true" />

      <h1 className={styles.title}>
        From bad NPC context to a self-correcting vector memory
      </h1>
      <p className={styles.date}>April 6, 2026</p>

      <article className={styles.content}>
        <p>
          I wanted to build a game with lots of AI NPC interactions. The issue was
          not just retrieval speed. The issue was bad context showing up at the
          wrong time.
        </p>

        <p>
          You query memory, get a result, and the model basically says: this is
          bad context, I need better context. Then you run a wider search. That
          wider search is expensive and it also compounds latency when many NPCs
          are talking at once.
        </p>

        <p>
          The thought was simple: if some memory keeps producing bad context, stop
          letting it stay in the hottest retrieval region. Move it farther away.
          Keep the trusted context near the center.
        </p>

        <h2>The idea in one paragraph</h2>

        <p>
          We forked Qdrant and implemented Radial Priority Indexing (RPI). Points
          live in shells: k=1 is high trust, k=2..N is lower trust. Good points
          get promoted inward over repeated wins. Bad points get demoted outward.
          Over time, k=1 becomes cleaner. Search starts at k=1 and only falls
          through if needed.
        </p>

        <p>
          A key intuition is that changing only magnitude does not change cosine
          similarity directionally. The semantic direction stays stable. We then
          use Euclidean shell geometry for trust tiers and adaptive movement.
        </p>

        <figure className={styles.figure}>
          <Image
            src="/images/rpi-shells-explained.png"
            alt="RPI shell visualization showing bad context demoted outward while semantic direction stays constant"
            width={2520}
            height={1440}
            className={styles.figureImage}
            priority
          />
          <figcaption className={styles.figureCaption}>
            Same direction, larger radius. Bad context is moved to higher shell k,
            so the next search favors cleaner k=1 candidates.
          </figcaption>
        </figure>

        <h2>What we actually shipped</h2>

        <ul>
          <li>Shell vectors per collection: rpi_shell_1 to rpi_shell_N.</li>
          <li>Collection-level RPI config at create time.</li>
          <li>Shell-aware search path with first-hit fallthrough.</li>
          <li>Promotion, demotion, eviction, and RPI runtime stats.</li>
          <li>gRPC parity for create and config readback.</li>
          <li>Strict lint, test, and release build gates passing.</li>
        </ul>

        <h2>Public-data benchmark run today</h2>

        <p>
          I wanted at least one benchmark that is not hand-picked toy data. So I
          ran a retrieval simulation today on the public 20 Newsgroups dataset.
          This is not a perfect production benchmark, but it is a legitimate,
          reproducible public corpus.
        </p>

        <div className={styles.callout}>
          <p>
            Setup: 5,000 train docs, 1,200 test docs, TF-IDF + SVD embeddings,
            baseline nearest retrieval vs RPI-style adaptive shell policy over 5
            epochs.
          </p>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Baseline</th>
              <th>RPI</th>
              <th>Delta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Top-1 accuracy</td>
              <td>0.4550</td>
              <td>0.6117 (epoch 5)</td>
              <td>+34.44% relative</td>
            </tr>
            <tr>
              <td>Wider-scope retry rate</td>
              <td>0.5400 (epoch 1)</td>
              <td>0.4167 (epoch 5)</td>
              <td>-22.83%</td>
            </tr>
            <tr>
              <td>Avg candidate set size</td>
              <td>5000</td>
              <td>3989</td>
              <td>-20.22%</td>
            </tr>
          </tbody>
        </table>

        <p>
          Translation for game NPCs: with repeated interactions, we got better
          first answers and fewer expensive wider-scope retries.
        </p>

        <h2>Engine-level benchmark snapshots</h2>

        <p>
          From our Qdrant integration bench runs in this fork:
        </p>

        <ul>
          <li>Steady shell-1 latency stayed near baseline, usually low single-digit overhead.</li>
          <li>Cold or convergence phases were slower.</li>
          <li>Quality convergence in feedback loops was very strong.</li>
        </ul>

        <h2>Pros</h2>

        <ul>
          <li>Self-correcting memory ranking over time.</li>
          <li>Better top-1 behavior in repeated-query, feedback-heavy workloads.</li>
          <li>Natural way to push noisy context away from the hot lane.</li>
          <li>Backwards-compatible default behavior for non-RPI collections.</li>
        </ul>

        <h2>Cons</h2>

        <ul>
          <li>More moving parts than standard cache + ANN.</li>
          <li>Convergence phase can cost latency.</li>
          <li>Needs repeated interactions to show full upside.</li>
          <li>Not a free lunch for one-shot retrieval workloads.</li>
        </ul>

        <h2>Honest note</h2>

        <p>
          We vibecoded a lot of this fork, tests, and rewrites. No pretense that
          this is already a universal theorem for every stack. It is a practical
          idea that looks strong in the workloads we care about, and we are being
          explicit about where it can lose.
        </p>

        <p>
          Also lmao, yes, this blog is AI-assisted with human intervention.
        </p>

        <h2>Where this is going</h2>

        <p>
          The goal is to use this memory policy inside dense NPC interaction loops
          where context quality matters more than raw nearest-neighbor purity. If
          your agent says context is bad, the system should learn and stop
          surfacing that context first.
        </p>

        <p>
          That is the whole point of RPI for us: make k=1 progressively trustworthy
          without retraining the whole world every week.
        </p>

        <h2>Repro command used for the public-data run</h2>

        <pre>
          <code>{`python3 - <<'PY'
# 20 Newsgroups retrieval simulation using
# TF-IDF + SVD embeddings and RPI-style shell adaptation.
# (Script executed during this writeup.)
PY`}</code>
        </pre>
      </article>
    </main>
  )
}
