import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"];
const LIGHT_COLORS = ["#fed7aa", "#bfdbfe", "#bbf7d0", "#e9d5ff", "#fbcfe8"];

// ─── Math helpers ───────────────────────────────────────────────
function euclidean(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
function mean(points) {
  if (!points.length) return null;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / points.length,
    y: points.reduce((s, p) => s + p.y, 0) / points.length,
  };
}
function wcss(points, centroids) {
  return points.reduce((sum, p) => {
    const c = centroids[p.cluster];
    if (!c) return sum;
    return sum + euclidean(p, c) ** 2;
  }, 0);
}
function assignClusters(points, centroids) {
  return points.map((p) => {
    let best = 0, bestD = Infinity;
    centroids.forEach((c, i) => {
      const d = euclidean(p, c);
      if (d < bestD) { bestD = d; best = i; }
    });
    return { ...p, cluster: best };
  });
}
function moveCentroids(points, k) {
  return Array.from({ length: k }, (_, i) => {
    const group = points.filter((p) => p.cluster === i);
    return group.length ? mean(group) : null;
  }).filter(Boolean);
}
function randomPoints(n, w, h) {
  const groups = 3;
  return Array.from({ length: n }, (_, i) => {
    const g = i % groups;
    const cx = [w * 0.25, w * 0.65, w * 0.45][g];
    const cy = [h * 0.35, h * 0.3, h * 0.72][g];
    return {
      x: cx + (Math.random() - 0.5) * w * 0.22,
      y: cy + (Math.random() - 0.5) * h * 0.22,
      cluster: -1, id: i,
    };
  });
}

// ─── Concept cards ───────────────────────────────────────────────
const CONCEPTS = [
  {
    id: "intro",
    title: "What is K-Means Clustering?",
    icon: "🔵",
    content: (
      <div className="space-y-3">
        <p>K-means is an <strong>unsupervised</strong> machine learning algorithm that groups similar data points into <em>k</em> clusters.</p>
        <div className="bg-slate-800 rounded-lg p-4 text-sm font-mono text-green-300">
          <div className="text-slate-400 mb-1">// Key idea</div>
          <div>Points close together → same cluster</div>
          <div>Points far apart → different clusters</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-orange-400 font-bold text-xs uppercase mb-1">Cluster</div>
            <p className="text-sm text-slate-300">A group of data points that are similar to each other (close in space)</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-blue-400 font-bold text-xs uppercase mb-1">Centroid</div>
            <p className="text-sm text-slate-300">The "center" of a cluster — the mean (average) position of all its points</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm">💡 <em>K</em> is a hyperparameter — <strong>you</strong> choose how many clusters to find.</p>
      </div>
    ),
  },
  {
    id: "euclidean",
    title: "Euclidean Distance",
    icon: "📐",
    content: <EuclideanCard />,
  },
  {
    id: "algorithm",
    title: "The K-Means Algorithm",
    icon: "⚙️",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300">K-means repeats two steps until nothing changes:</p>
        <div className="space-y-2">
          {[
            { n: "1", label: "Initialize", desc: "Randomly place k centroids in the data space", color: "text-orange-400" },
            { n: "2", label: "Assign", desc: "Each point joins the cluster of its nearest centroid", color: "text-blue-400" },
            { n: "3", label: "Update", desc: "Move each centroid to the mean of its assigned points", color: "text-green-400" },
            { n: "4", label: "Repeat", desc: "Go back to step 2 until centroids stop moving (convergence)", color: "text-purple-400" },
          ].map((s) => (
            <div key={s.n} className="flex gap-3 bg-slate-800 rounded-lg p-3">
              <div className={`${s.color} font-bold text-lg w-6 shrink-0`}>{s.n}</div>
              <div>
                <div className={`${s.color} font-semibold text-sm`}>{s.label}</div>
                <div className="text-slate-300 text-sm">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-orange-950 border border-orange-800 rounded-lg p-3 text-sm">
          ⚠️ K-means is sensitive to initial centroid placement — results can vary! This is why we often run it multiple times.
        </div>
      </div>
    ),
  },
  {
    id: "wcss",
    title: "WCSS & The Elbow Method",
    icon: "📉",
    content: <WCSSCard />,
  },
  {
    id: "sklearn",
    title: "scikit-learn Implementation",
    icon: "🐍",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300">Here's how to implement K-means in Python:</p>
        <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
          <div className="text-slate-500"># 1. Import</div>
          <div><span className="text-blue-400">from</span> <span className="text-green-300">sklearn.cluster</span> <span className="text-blue-400">import</span> KMeans</div>
          <div><span className="text-blue-400">import</span> <span className="text-green-300">numpy as np</span></div>
          <br />
          <div className="text-slate-500"># 2. Create model (k=3 clusters)</div>
          <div><span className="text-yellow-300">kmeans</span> = KMeans(</div>
          <div className="pl-4"><span className="text-orange-300">n_clusters</span>=<span className="text-purple-300">3</span>,</div>
          <div className="pl-4"><span className="text-orange-300">n_init</span>=<span className="text-purple-300">10</span>,  <span className="text-slate-500"># run 10 times, keep best</span></div>
          <div className="pl-4"><span className="text-orange-300">random_state</span>=<span className="text-purple-300">42</span></div>
          <div>)</div>
          <br />
          <div className="text-slate-500"># 3. Fit and predict</div>
          <div><span className="text-yellow-300">labels</span> = <span className="text-yellow-300">kmeans</span>.fit_predict(<span className="text-green-300">X</span>)</div>
          <br />
          <div className="text-slate-500"># 4. Get results</div>
          <div><span className="text-yellow-300">centroids</span> = <span className="text-yellow-300">kmeans</span>.cluster_centers_</div>
          <div><span className="text-yellow-300">inertia</span>  = <span className="text-yellow-300">kmeans</span>.inertia_  <span className="text-slate-500"># = WCSS</span></div>
          <br />
          <div className="text-slate-500"># 5. Elbow method</div>
          <div><span className="text-yellow-300">wcss_vals</span> = []</div>
          <div><span className="text-blue-400">for</span> k <span className="text-blue-400">in</span> range(<span className="text-purple-300">1</span>, <span className="text-purple-300">11</span>):</div>
          <div className="pl-4"><span className="text-yellow-300">km</span> = KMeans(<span className="text-orange-300">n_clusters</span>=k, <span className="text-orange-300">n_init</span>=<span className="text-purple-300">10</span>)</div>
          <div className="pl-4"><span className="text-yellow-300">km</span>.fit(<span className="text-green-300">X</span>)</div>
          <div className="pl-4"><span className="text-yellow-300">wcss_vals</span>.append(<span className="text-yellow-300">km</span>.inertia_)</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { param: "n_clusters", desc: "Number of clusters (k)" },
            { param: "n_init", desc: "Times to run with different seeds" },
            { param: "random_state", desc: "For reproducibility" },
            { param: "inertia_", desc: "The WCSS score after fitting" },
          ].map((p) => (
            <div key={p.param} className="bg-slate-800 rounded p-2">
              <div className="text-orange-300 font-mono">{p.param}</div>
              <div className="text-slate-400">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function EuclideanCard() {
  const [p1, setP1] = useState({ x: 1, y: 2 });
  const [p2, setP2] = useState({ x: 4, y: 6 });
  const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  return (
    <div className="space-y-3">
      <p className="text-slate-300">Distance between two points <strong>(x₁,y₁)</strong> and <strong>(x₂,y₂)</strong>:</p>
      <div className="bg-slate-900 rounded-lg p-4 text-center">
        <div className="text-yellow-300 text-lg font-mono">d = √( (x₂−x₁)² + (y₂−y₁)² )</div>
      </div>
      <p className="text-slate-400 text-sm">Try it — edit the coordinates:</p>
      <div className="grid grid-cols-2 gap-3">
        {[{ label: "Point A", p: p1, set: setP1, color: "text-orange-400" }, { label: "Point B", p: p2, set: setP2, color: "text-blue-400" }].map(({ label, p, set, color }) => (
          <div key={label} className="bg-slate-800 rounded-lg p-3">
            <div className={`${color} font-semibold text-sm mb-2`}>{label}</div>
            {["x", "y"].map((ax) => (
              <div key={ax} className="flex items-center gap-2 mb-1">
                <span className="text-slate-400 text-xs w-4">{ax}:</span>
                <input type="number" value={p[ax]}
                  onChange={(e) => set((prev) => ({ ...prev, [ax]: parseFloat(e.target.value) || 0 }))}
                  className="bg-slate-700 text-white rounded px-2 py-1 text-sm w-16 border border-slate-600 focus:border-blue-400 outline-none" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-lg p-3 text-center">
        <div className="text-slate-400 text-xs mb-1">Calculation:</div>
        <div className="font-mono text-sm text-slate-300">
          √( ({p2.x}−{p1.x})² + ({p2.y}−{p1.y})² ) = √( {(p2.x-p1.x)**2} + {(p2.y-p1.y)**2} )
        </div>
        <div className="text-green-400 font-bold text-xl mt-1">= {dist.toFixed(3)}</div>
      </div>
    </div>
  );
}

function WCSSCard() {
  const elbowData = [
    { k: 1, wcss: 920 }, { k: 2, wcss: 480 }, { k: 3, wcss: 180 },
    { k: 4, wcss: 155 }, { k: 5, wcss: 138 }, { k: 6, wcss: 128 },
    { k: 7, wcss: 122 }, { k: 8, wcss: 118 },
  ];
  const max = 920; const h = 120; const w = 280;
  return (
    <div className="space-y-3">
      <p className="text-slate-300"><strong>WCSS (Within-Cluster Sum of Squares)</strong> measures how tight the clusters are:</p>
      <div className="bg-slate-900 rounded-lg p-3 text-center font-mono text-yellow-300 text-sm">
        WCSS = Σ Σ distance(point, centroid)²
      </div>
      <p className="text-slate-400 text-sm">Lower WCSS = tighter, better-defined clusters. But adding more clusters always reduces WCSS...</p>
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="text-slate-300 text-xs font-semibold mb-2 text-center">Elbow Plot — pick k at the "elbow" 📍</div>
        <svg viewBox={`0 0 ${w} ${h + 30}`} className="w-full">
          <polyline
            points={elbowData.map((d, i) => `${30 + i * 34},${10 + (d.wcss / max) * h}`).join(" ")}
            fill="none" stroke="#3b82f6" strokeWidth="2" />
          {elbowData.map((d, i) => (
            <g key={d.k}>
              <circle cx={30 + i * 34} cy={10 + (d.wcss / max) * h} r={d.k === 3 ? 6 : 4}
                fill={d.k === 3 ? "#f97316" : "#3b82f6"} />
              <text x={30 + i * 34} y={h + 25} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.k}</text>
            </g>
          ))}
          <text x={10} y={10 + h / 2} fontSize="9" fill="#64748b" transform={`rotate(-90, 10, ${10 + h / 2})`} textAnchor="middle">WCSS</text>
          <text x={w / 2} y={h + 38} fontSize="9" fill="#64748b" textAnchor="middle">k (clusters)</text>
        </svg>
        <div className="text-orange-400 text-xs text-center">↑ The "elbow" at k=3 is the best choice here</div>
      </div>
      <p className="text-slate-400 text-sm">After the elbow, adding more clusters gives diminishing returns — the curve flattens out.</p>
    </div>
  );
}

// ─── Interactive sandbox ─────────────────────────────────────────
function Sandbox() {
  const canvasRef = useRef(null);
  const [k, setK] = useState(3);
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [step, setStep] = useState("idle"); // idle | assigned | updated | converged
  const [iteration, setIteration] = useState(0);
  const [history, setHistory] = useState([]);
  const [showWCSS, setShowWCSS] = useState(false);
  const W = 420, H = 280;

  const init = useCallback(() => {
    const pts = randomPoints(30, W, H);
    setPoints(pts);
    setCentroids([]);
    setStep("idle");
    setIteration(0);
    setHistory([]);
  }, []);

  useEffect(() => { init(); }, [init]);

  function placeCentroids() {
    const shuffled = [...points].sort(() => Math.random() - 0.5);
    const c = shuffled.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
    setCentroids(c);
    setStep("placed");
    setIteration(0);
    setHistory([]);
  }

  function doAssign() {
    const assigned = assignClusters(points, centroids);
    setPoints(assigned);
    setStep("assigned");
    const w = wcss(assigned, centroids);
    setHistory((h) => [...h, { iter: iteration, wcss: w }]);
  }

  function doUpdate() {
    const newC = moveCentroids(points, k);
    // Check convergence
    const converged = newC.every((c, i) =>
      centroids[i] && Math.abs(c.x - centroids[i].x) < 0.5 && Math.abs(c.y - centroids[i].y) < 0.5
    );
    setCentroids(newC);
    setIteration((i) => i + 1);
    setStep(converged ? "converged" : "updated");
  }

  function runFull() {
    let pts = assignClusters(points, centroids.length ? centroids : (() => {
      const shuffled = [...points].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
    })());
    let c = moveCentroids(pts, k);
    let iters = 0, hist = [];
    while (iters < 20) {
      const newPts = assignClusters(pts, c);
      const newC = moveCentroids(newPts, k);
      hist.push({ iter: iters, wcss: wcss(newPts, newC) });
      const converged = newC.every((nc, i) =>
        Math.abs(nc.x - c[i].x) < 0.5 && Math.abs(nc.y - c[i].y) < 0.5
      );
      pts = newPts; c = newC; iters++;
      if (converged) break;
    }
    setPoints(pts);
    setCentroids(c);
    setIteration(iters);
    setHistory(hist);
    setStep("converged");
  }

  const currentWCSS = points.length && centroids.length ? wcss(points, centroids).toFixed(0) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-slate-400 text-sm">k =</label>
        {[2, 3, 4, 5].map((v) => (
          <button key={v} onClick={() => { setK(v); setCentroids([]); setStep("idle"); }}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${k === v ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>{v}</button>
        ))}
        <button onClick={init} className="ml-auto bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-all">↺ New Data</button>
      </div>

      {/* Canvas */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
          {/* Voronoi-ish background hints */}
          {points.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={5}
              fill={p.cluster >= 0 ? LIGHT_COLORS[p.cluster % LIGHT_COLORS.length] : "#334155"}
              stroke={p.cluster >= 0 ? COLORS[p.cluster % COLORS.length] : "#475569"}
              strokeWidth={1.5} />
          ))}
          {/* Lines from points to centroids */}
          {step === "assigned" && points.map((p) => {
            const c = centroids[p.cluster];
            if (!c) return null;
            return <line key={p.id} x1={p.x} y1={p.y} x2={c.x} y2={c.y}
              stroke={COLORS[p.cluster % COLORS.length]} strokeWidth={0.5} strokeOpacity={0.4} />;
          })}
          {/* Centroids */}
          {centroids.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={10} fill={COLORS[i % COLORS.length]} opacity={0.25} />
              <circle cx={c.x} cy={c.y} r={6} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth={1.5} />
              <text x={c.x} y={c.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="white" fontWeight="bold">✕</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      {centroids.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {centroids.map((_, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-slate-400">Cluster {i + 1}</span>
            </div>
          ))}
          {currentWCSS && <div className="ml-auto text-xs text-slate-500">WCSS: <span className="text-yellow-400">{currentWCSS}</span></div>}
        </div>
      )}

      {/* Step controls */}
      <div className="bg-slate-800 rounded-xl p-4 space-y-3">
        <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Step-by-step</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={placeCentroids}
            className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">
            1. Place Centroids
          </button>
          <button onClick={doAssign} disabled={!centroids.length || step === "idle"}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">
            2. Assign Points
          </button>
          <button onClick={doUpdate} disabled={step !== "assigned"}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">
            3. Update Centroids
          </button>
          <button onClick={runFull}
            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">
            ▶ Run All
          </button>
        </div>

        {step === "converged" && (
          <div className="bg-green-950 border border-green-700 rounded-lg p-3 text-sm text-green-300">
            ✅ Converged after <strong>{iteration}</strong> iteration{iteration !== 1 ? "s" : ""}! Centroids stopped moving.
          </div>
        )}
        {step === "assigned" && (
          <div className="bg-blue-950 border border-blue-700 rounded-lg p-3 text-sm text-blue-300">
            Each point assigned to its nearest centroid. Now update centroids → their new means.
          </div>
        )}
        {step === "placed" && (
          <div className="bg-orange-950 border border-orange-700 rounded-lg p-3 text-sm text-orange-300">
            {k} centroids placed randomly. Now assign each point to the nearest one.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: "What does the 'k' in k-means represent?",
    options: ["The number of data points", "The number of clusters", "The number of iterations", "The distance metric"],
    answer: 1, explain: "k is the number of clusters you want to find. You choose it before running the algorithm."
  },
  {
    q: "Which distance formula does k-means use to find the nearest centroid?",
    options: ["Manhattan distance", "Cosine similarity", "Euclidean distance", "Hamming distance"],
    answer: 2, explain: "K-means uses Euclidean distance: √((x₂−x₁)² + (y₂−y₁)²)"
  },
  {
    q: "What is a centroid?",
    options: ["The furthest point from the cluster", "The median point in a cluster", "The mean (average) position of all points in a cluster", "A randomly chosen data point"],
    answer: 2, explain: "A centroid is the mean of all points in its cluster. After each assign step, centroids move to the average position."
  },
  {
    q: "When does k-means stop iterating?",
    options: ["After exactly 10 iterations", "When WCSS reaches zero", "When centroids no longer move significantly (convergence)", "When all points are equidistant"],
    answer: 2, explain: "K-means converges when centroids stop moving — meaning the cluster assignments didn't change."
  },
  {
    q: "What does WCSS measure?",
    options: ["The distance between centroids", "The sum of squared distances from each point to its centroid", "The number of points per cluster", "The total number of iterations"],
    answer: 1, explain: "WCSS (Within-Cluster Sum of Squares) = Σ distance(point, its centroid)². Lower = tighter clusters."
  },
  {
    q: "In the elbow method, what do you look for?",
    options: ["The k where WCSS is exactly 0", "The k where WCSS is highest", "The k where the WCSS curve bends (diminishing returns begin)", "The largest possible k"],
    answer: 2, explain: "The 'elbow' is where adding more clusters gives diminishing returns — the curve flattens out. That k is your optimal choice."
  },
];

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === QUIZ[current].answer) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 >= QUIZ.length) { setDone(true); return; }
    setCurrent((c) => c + 1);
    setSelected(null);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return (
    <div className="text-center space-y-4 py-6">
      <div className="text-5xl">{score === QUIZ.length ? "🏆" : score >= QUIZ.length * 0.7 ? "🎉" : "📚"}</div>
      <div className="text-2xl font-bold text-white">You scored {score}/{QUIZ.length}</div>
      <div className="text-slate-400">{score === QUIZ.length ? "Perfect! You've mastered k-means." : score >= 4 ? "Great job! Review any missed concepts above." : "Keep studying — use the concept cards above to review."}</div>
      <button onClick={restart} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all">Retry Quiz</button>
    </div>
  );

  const q = QUIZ[current];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">Question {current + 1} of {QUIZ.length}</span>
        <span className="text-slate-400 text-sm">Score: {score}/{current}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1.5">
        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${(current / QUIZ.length) * 100}%` }} />
      </div>
      <p className="text-white font-medium text-lg">{q.q}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 cursor-pointer";
          if (selected !== null) {
            if (i === q.answer) cls = "bg-green-900 border-green-600 text-green-300 cursor-default";
            else if (i === selected) cls = "bg-red-900 border-red-600 text-red-300 cursor-default";
            else cls = "bg-slate-800 border-slate-700 text-slate-500 cursor-default";
          }
          return (
            <button key={i} onClick={() => pick(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${cls}`}>
              <span className="font-mono text-xs mr-2 opacity-60">{["A","B","C","D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`rounded-lg p-3 text-sm ${selected === q.answer ? "bg-green-950 border border-green-700 text-green-300" : "bg-red-950 border border-red-700 text-red-300"}`}>
          {selected === q.answer ? "✅ Correct! " : "❌ Not quite. "}{q.explain}
        </div>
      )}
      {selected !== null && (
        <button onClick={next} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-all">
          {current + 1 >= QUIZ.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
export default function KMeansTutor() {
  const [activeTab, setActiveTab] = useState("concepts");
  const [activeConcept, setActiveConcept] = useState("intro");

  const tabs = [
    { id: "concepts", label: "📖 Concepts" },
    { id: "sandbox", label: "🧪 Sandbox" },
    { id: "quiz", label: "✏️ Quiz" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white" style={{ fontFamily: "'IBM Plex Sans', 'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Intro to Data Science</div>
          <h1 className="text-2xl font-bold text-white">K-Means Clustering</h1>
          <p className="text-slate-400 text-sm mt-1">Interactive tutor — learn, visualize, and test yourself</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 px-6">
        <div className="max-w-3xl mx-auto flex gap-0">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${activeTab === t.id ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* CONCEPTS */}
        {activeTab === "concepts" && (
          <div className="flex gap-4">
            {/* Sidebar */}
            <div className="w-48 shrink-0 space-y-1">
              {CONCEPTS.map((c) => (
                <button key={c.id} onClick={() => setActiveConcept(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${activeConcept === c.id ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`}>
                  <span>{c.icon}</span>
                  <span className="leading-tight">{c.title}</span>
                </button>
              ))}
            </div>
            {/* Content */}
            <div className="flex-1 bg-slate-800 rounded-xl p-5 min-h-96">
              {CONCEPTS.filter((c) => c.id === activeConcept).map((c) => (
                <div key={c.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{c.icon}</span>
                    <h2 className="text-lg font-bold text-white">{c.title}</h2>
                  </div>
                  {c.content}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SANDBOX */}
        {activeTab === "sandbox" && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-1">Interactive K-Means Sandbox</h2>
              <p className="text-slate-400 text-sm">Watch k-means run step-by-step on randomly generated data. Change k and run again to see how results differ.</p>
            </div>
            <Sandbox />
          </div>
        )}

        {/* QUIZ */}
        {activeTab === "quiz" && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-1">Knowledge Check</h2>
              <p className="text-slate-400 text-sm">6 questions covering all key concepts. Get 5+ to pass!</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-5">
              <Quiz />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}