import { useState } from "react";

const quizData = [
  {
    topic: "Multilayer Perceptrons (MLPs)",
    color: "#E86F3C",
    questions: [
      {
        q: "An MLP with no activation functions (only linear transformations) can learn any complex, nonlinear decision boundary. True or False?",
        answer: "False",
        explanation:
          "Without activation functions, every layer just performs a linear transformation (multiply and add). Stacking linear transformations only produces another linear transformation — so the whole network collapses into a single-layer linear model. You NEED nonlinear activations (ReLU, sigmoid, tanh, etc.) to learn nonlinear patterns.",
      },
      {
        q: "Adding more hidden layers to an MLP will always improve its performance on unseen data. True or False?",
        answer: "False",
        explanation:
          "More layers increase the model's capacity, which makes it more prone to overfitting — memorizing training data instead of learning general patterns. A deeper network also becomes harder to train (vanishing gradients, longer training time). The right depth depends on the complexity of the problem and the amount of data you have.",
      },
      {
        q: "In an MLP, what is the primary role of the bias term in each neuron?",
        options: [
          "A) It regularizes the weights to prevent overfitting",
          "B) It allows the activation function to shift left or right, so the neuron can activate even when inputs are zero",
          "C) It scales the learning rate during backpropagation",
          "D) It normalizes the output of each layer",
        ],
        answer: "B",
        explanation:
          "The bias is an extra learnable parameter added before the activation function. Without it, the neuron's activation is anchored at the origin — a ReLU neuron with no bias can only 'turn on' when the weighted sum of inputs is positive. The bias lets the neuron shift its threshold, making the network much more flexible.",
      },
    ],
  },
  {
    topic: "Neural Networks (Training & Architecture)",
    color: "#5B8DBE",
    questions: [
      {
        q: "A neural network achieves 99.8% accuracy on training data but only 61% on test data. Which is the most likely issue?",
        options: [
          "A) Underfitting",
          "B) Overfitting",
          "C) High bias",
          "D) The learning rate is too low",
        ],
        answer: "B",
        explanation:
          "The huge gap between training accuracy (99.8%) and test accuracy (61%) is the textbook signature of overfitting. The model memorized the training data but can't generalize. Remedies include dropout, early stopping, more training data, regularization, or reducing model complexity. Underfitting / high bias would show POOR performance on BOTH sets.",
      },
      {
        q: "Using a sigmoid activation in every layer of a deep network (20+ layers) is a good default choice. True or False?",
        answer: "False",
        explanation:
          "Sigmoid squishes outputs to (0, 1). In deep networks, gradients get multiplied through many layers during backpropagation. Since sigmoid's maximum gradient is only 0.25, these multiplications shrink the gradient toward zero — the 'vanishing gradient problem.' Early layers barely learn. ReLU and its variants (Leaky ReLU, ELU) are preferred because their gradients don't shrink the same way.",
      },
      {
        q: "Dropout randomly removes neurons during training. Why does this HELP the network instead of hurting it?",
        options: [
          "A) It speeds up each training step by reducing computation",
          "B) It forces the network to learn redundant, distributed representations so it doesn't rely on any single neuron",
          "C) It increases the learning rate automatically",
          "D) It eliminates the need for a validation set",
        ],
        answer: "B",
        explanation:
          "By randomly 'turning off' neurons each batch, dropout prevents co-adaptation — where specific neurons only work as a team and are useless alone. Each neuron must learn to be useful on its own, which creates more robust features. Think of it like cross-training: if you can't rely on one teammate, everyone gets better individually. At test time, all neurons are used (with scaled weights).",
      },
    ],
  },
  {
    topic: "K-Means Clustering",
    color: "#6BAF6B",
    questions: [
      {
        q: "K-Means is a classification algorithm. True or False?",
        answer: "False",
        explanation:
          "K-Means is an UNSUPERVISED CLUSTERING algorithm, not classification. Classification requires labeled data and predicts predefined categories. K-Means has no labels — it groups data points by similarity (distance to centroids). The question might try to trick you with the phrase 'KMeans Classification,' but clustering ≠ classification.",
      },
      {
        q: "K-Means is guaranteed to find the globally optimal clustering every time. True or False?",
        answer: "False",
        explanation:
          "K-Means only guarantees convergence to a LOCAL minimum, not the global one. Because the initial centroids are chosen randomly, different starting positions can lead to different final clusters. This is why we run K-Means multiple times with different initializations (the 'n_init' parameter in scikit-learn) and keep the best result. K-Means++ improves initialization but still doesn't guarantee the global optimum.",
      },
      {
        q: "You run K-Means on customer data with features: 'annual income ($10,000–$200,000)' and 'age (18–80).' The algorithm clusters almost entirely based on income. What went wrong?",
        options: [
          "A) K is too small",
          "B) The features aren't scaled — income's range dominates the distance calculation",
          "C) K-Means can't handle numerical features",
          "D) You need to use Manhattan distance instead",
        ],
        answer: "B",
        explanation:
          "K-Means uses distance (usually Euclidean) to assign points to clusters. Income ranges from 10,000 to 200,000, while age ranges from 18 to 80. A difference of $50,000 in income will completely dwarf a difference of 30 years in age. The fix: ALWAYS scale/normalize your features before running K-Means (StandardScaler, MinMaxScaler, etc.).",
      },
    ],
  },
  {
    topic: "Gradient Descent",
    color: "#9B6BA6",
    questions: [
      {
        q: "A very high learning rate will cause gradient descent to converge faster and find a better solution. True or False?",
        answer: "False",
        explanation:
          "A learning rate that's too high causes the updates to OVERSHOOT the minimum. Instead of converging, the loss oscillates wildly or even diverges to infinity. Think of it like taking huge steps down a valley — you keep jumping past the bottom to the other side. Too low is also bad (painfully slow convergence). The right learning rate balances speed and stability.",
      },
      {
        q: "What is the key difference between Batch Gradient Descent and Stochastic Gradient Descent (SGD)?",
        options: [
          "A) Batch uses the entire dataset to compute each gradient update; SGD uses one sample (or a mini-batch)",
          "B) SGD always finds the global minimum; Batch does not",
          "C) Batch only works for linear models",
          "D) SGD doesn't use gradients at all",
        ],
        answer: "A",
        explanation:
          "Batch GD computes the gradient over ALL training examples before making one update — accurate but slow for large datasets. SGD computes the gradient on a single sample (or small mini-batch), making it faster and noisier. The noise in SGD actually helps — it can escape shallow local minima. Mini-batch GD (the practical default) is a compromise: small batches (32, 64, 128 samples) balance noise and stability.",
      },
      {
        q: "You're training a model and the loss decreases very quickly at first but then plateaus at a high value. The model performs poorly. What is the most likely cause?",
        options: [
          "A) The learning rate is too high — it's stuck oscillating around a minimum",
          "B) The model is overfitting",
          "C) You need more epochs",
          "D) The learning rate is too low — it's stuck in a local minimum or saddle point",
        ],
        answer: "D",
        explanation:
          "The fast initial drop followed by a plateau at a HIGH loss suggests the model got trapped. A too-low learning rate makes updates so tiny that the model can't escape flat regions (saddle points) or poor local minima. Solutions: increase the learning rate, use a learning rate scheduler, or use optimizers like Adam that adapt the rate per-parameter. If the learning rate were too high, you'd typically see erratic loss, not a smooth plateau.",
      },
    ],
  },
  {
    topic: "Data Preprocessing",
    color: "#D4A843",
    questions: [
      {
        q: "You should fit your scaler (e.g., StandardScaler) on the ENTIRE dataset before splitting into train/test. True or False?",
        answer: "False",
        explanation:
          "This is DATA LEAKAGE. If you fit the scaler on all data, the test set's statistics (mean, std) influence the training process. The correct workflow: split first, then fit the scaler on the TRAINING set only, and use that fitted scaler to transform both train and test. This simulates real-world conditions where you don't have access to future data.",
      },
      {
        q: "You have a feature with values [1, 2, 3, 1000]. Which is more robust to that outlier?",
        options: [
          "A) StandardScaler (z-score normalization)",
          "B) MinMaxScaler",
          "C) RobustScaler",
          "D) No scaling needed",
        ],
        answer: "C",
        explanation:
          "RobustScaler uses the median and interquartile range (IQR) instead of the mean and standard deviation. Since median and IQR are not affected by extreme values, the outlier (1000) won't distort the scaling. StandardScaler's mean/std get pulled by the outlier. MinMaxScaler maps to [0,1], so the outlier compresses all other values near 0. RobustScaler is designed for exactly this scenario.",
      },
      {
        q: "One-hot encoding a feature with 10,000 unique categories (like zip codes) is always the best approach. True or False?",
        answer: "False",
        explanation:
          "One-hot encoding 10,000 categories creates 10,000 new binary columns — a massive, sparse feature space. This causes the 'curse of dimensionality,' slow training, and potential overfitting. Better approaches: target encoding, frequency encoding, grouping rare categories, embeddings (for neural networks), or using domain knowledge to bucket the categories into meaningful groups.",
      },
    ],
  },
  {
    topic: "Dimensionality Reduction",
    color: "#CF5C6F",
    questions: [
      {
        q: "PCA finds the directions of maximum VARIANCE in the data. If you apply PCA and keep only the first 2 components, what are you losing?",
        options: [
          "A) The features with the smallest values",
          "B) The directions along which the data varies the least",
          "C) Randomly selected features",
          "D) The most important features",
        ],
        answer: "B",
        explanation:
          "PCA ranks components by how much variance they capture. The first few components capture the most variance (the 'signal'). By dropping later components, you're discarding directions where the data barely varies — often noise. Important: PCA components are NOT original features. They're linear combinations of ALL features, rotated to align with variance directions.",
      },
      {
        q: "You must always scale your features before applying PCA. True or False?",
        answer: "True",
        explanation:
          "PCA finds directions of maximum variance. If one feature ranges 0–1,000,000 and another ranges 0–1, PCA will be dominated by the large-scale feature regardless of its actual importance. Standardizing (mean=0, std=1) puts all features on equal footing so PCA captures meaningful patterns, not just scale differences. Skipping this is one of the most common PCA mistakes.",
      },
      {
        q: "After applying PCA, the principal components are easy to interpret as real-world features. True or False?",
        answer: "False",
        explanation:
          "Each principal component is a LINEAR COMBINATION of all original features. PC1 might be something like 0.4×height + 0.3×weight − 0.5×age + ... It doesn't map neatly to any single real-world concept. This is the main tradeoff of PCA: you gain efficiency and noise reduction but lose interpretability. If interpretability matters, consider feature selection (picking actual features) instead of PCA.",
      },
    ],
  },
];

function QuestionCard({ question, topicColor, index }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: "10px",
        padding: "24px",
        marginBottom: "16px",
        borderLeft: `4px solid ${topicColor}`,
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: topicColor,
          marginBottom: "8px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Q{index + 1}
      </div>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.6,
          color: "var(--text-primary)",
          margin: "0 0 16px 0",
          fontWeight: 500,
        }}
      >
        {question.q}
      </p>

      {question.options && (
        <div style={{ marginBottom: "16px" }}>
          {question.options.map((opt, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                marginBottom: "6px",
                borderRadius: "6px",
                fontSize: "14px",
                color: "var(--text-secondary)",
                background: revealed && opt.startsWith(question.answer)
                  ? `${topicColor}22`
                  : "var(--option-bg)",
                border: revealed && opt.startsWith(question.answer)
                  ? `1.5px solid ${topicColor}`
                  : "1.5px solid transparent",
                fontWeight: revealed && opt.startsWith(question.answer) ? 600 : 400,
                transition: "all 0.3s ease",
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setRevealed(!revealed)}
        style={{
          background: revealed ? "var(--option-bg)" : topicColor,
          color: revealed ? "var(--text-secondary)" : "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 20px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          transition: "all 0.2s ease",
        }}
      >
        {revealed ? "Hide" : "Reveal Answer"}
      </button>

      {revealed && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            borderRadius: "8px",
            background: "var(--explanation-bg)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: topicColor,
              marginBottom: "8px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Answer: {question.answer}
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MLQuizGuide() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        padding: "32px 20px",
        "--bg": "#0f1117",
        "--card-bg": "#1a1d27",
        "--option-bg": "#222533",
        "--explanation-bg": "#161925",
        "--text-primary": "#e8e9ed",
        "--text-secondary": "#a0a3b1",
        "--border": "#2a2d3a",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-color-scheme: light) {
          :root {
            --bg: #f4f5f7 !important;
            --card-bg: #ffffff !important;
            --option-bg: #f0f1f4 !important;
            --explanation-bg: #f7f8fa !important;
            --text-primary: #1a1d27 !important;
            --text-secondary: #555968 !important;
            --border: #dcdee5 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 6px 0",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ML Quiz Prep
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            18 conceptual questions · Click to reveal answers & explanations
          </p>
        </div>

        {/* Topic tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          {quizData.map((section, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                background: activeTab === i ? section.color : "var(--card-bg)",
                color: activeTab === i ? "#fff" : "var(--text-secondary)",
                border: activeTab === i
                  ? `1.5px solid ${section.color}`
                  : "1.5px solid var(--border)",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {section.topic}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: quizData[activeTab].color,
              fontWeight: 700,
              marginBottom: "16px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {quizData[activeTab].topic}
          </div>
          {quizData[activeTab].questions.map((q, i) => (
            <QuestionCard
              key={`${activeTab}-${i}`}
              question={q}
              topicColor={quizData[activeTab].color}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}