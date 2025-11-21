"use client";

import { useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Question {
  text: string;
  options: { label: string; animal: Animal }[];
}

const questions: Question[] = [
  {
    text: "What is your favorite type of activity?",
    options: [
      { label: "Chasing mice", animal: "cat" },
      { label: "Playing fetch", animal: "dog" },
      { label: "Hunting in the woods", animal: "fox" },
      { label: "Nibbling on seeds", animal: "hamster" },
      { label: "Racing across fields", animal: "horse" },
    ],
  },
  {
    text: "How do you prefer to spend your free time?",
    options: [
      { label: "Lounging on a sunny windowsill", animal: "cat" },
      { label: "Going for a walk with friends", animal: "dog" },
      { label: "Exploring new trails", animal: "fox" },
      { label: "Staying cozy in a nest", animal: "hamster" },
      { label: "Galloping in open spaces", animal: "horse" },
    ],
  },
  {
    text: "What is your ideal sleeping position?",
    options: [
      { label: "On a soft cushion", animal: "cat" },
      { label: "Snuggled up with a buddy", animal: "dog" },
      { label: "In a hidden burrow", animal: "fox" },
      { label: "In a tight ball", animal: "hamster" },
      { label: "Standing tall", animal: "horse" },
    ],
  },
  {
    text: "Which trait describes you best?",
    options: [
      { label: "Independent", animal: "cat" },
      { label: "Loyal", animal: "dog" },
      { label: "Clever", animal: "fox" },
      { label: "Curious", animal: "hamster" },
      { label: "Strong", animal: "horse" },
    ],
  },
  {
    text: "What kind of environment do you thrive in?",
    options: [
      { label: "Quiet and cozy", animal: "cat" },
      { label: "Social and active", animal: "dog" },
      { label: "Wild and free", animal: "fox" },
      { label: "Small and safe", animal: "hamster" },
      { label: "Open and expansive", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Animal, number>>({
    cat: 0,
    dog: 0,
    fox: 0,
    hamster: 0,
    horse: 0,
  });
  const [shuffledOptions, setShuffledOptions] = useState(
    questions.map((q) => shuffleArray(q.options))
  );
  const [result, setResult] = useState<Animal | null>(null);

  const handleAnswer = (animal: Animal) => {
    setScores((prev) => ({ ...prev, [animal]: prev[animal] + 1 }));
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const max = Math.max(...Object.values(scores));
      const topAnimals = Object.entries(scores)
        .filter(([, v]) => v === max)
        .map(([k]) => k as Animal);
      setResult(topAnimals[0]); // pick first in case of tie
    }
  };

  const retake = () => {
    setCurrent(0);
    setScores({
      cat: 0,
      dog: 0,
      fox: 0,
      hamster: 0,
      horse: 0,
    });
    setShuffledOptions(questions.map((q) => shuffleArray(q.options)));
    setResult(null);
  };

  if (result) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">You are a {result}!</h2>
        <img
          src={`/${result}.png`}
          alt={result}
          width={256}
          height={256}
          className="rounded"
        />
        <Share text={`I am a ${result}! ${url}`} />
        <button
          onClick={retake}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];
  const opts = shuffledOptions[current];

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">{q.text}</h2>
      <div className="flex flex-col gap-2">
        {opts.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt.animal)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
