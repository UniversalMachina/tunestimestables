"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Question {
  question: string;
  answer: string;
}

interface GameResults {
  questions: Question[];
  userAnswers: string[];
  score: number;
}

const ResultsPage = () => {
  const [results, setResults] = useState<GameResults | null>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("gameResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  if (!results) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <Image
        src="/Logo.png"
        alt="Logo"
        width={300}
        height={300}
        className="object-contain mb-8"
      />

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Question</th>
                <th className="px-6 py-4 text-left">Your Answer</th>
                <th className="px-6 py-4 text-left">Correct Answer</th>
                <th className="px-6 py-4 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.questions.map((question, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{question.question}</td>
                  <td className="px-6 py-4">
                    {results.userAnswers[index] || "-"}
                  </td>
                  <td className="px-6 py-4">{question.answer}</td>
                  <td className="px-6 py-4">
                    {results.userAnswers[index] === question.answer ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <div className="text-2xl font-bold">
            Final Score: {results.score}/10
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
