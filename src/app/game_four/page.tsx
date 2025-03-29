"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GameFour: React.FC = () => {
  const router = useRouter();
  const [time, setTime] = useState<number>(60000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 12) + 1; // Random number 1-12
    const num2 = Math.floor(Math.random() * 12) + 1; // Random number 1-12
    return {
      question: `${num1} x ${num2}`,
      answer: (num1 * num2).toString(),
    };
  };

  const [questions, setQuestions] = useState(() =>
    Array(20)
      .fill(null)
      .map(() => generateQuestion())
  );

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop all tracks when component unmounts
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 10) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 10;
        });
      }, 10);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(ms).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleAnswerSubmit = () => {
    if (attemptCount >= 10) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = currentAnswer;
    setUserAnswers(newUserAnswers);

    if (currentAnswer === questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
    }

    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    if (newAttemptCount === 10) {
      localStorage.setItem(
        "gameResults",
        JSON.stringify({
          questions: questions.slice(0, 10),
          userAnswers: newUserAnswers,
          score:
            score +
            (currentAnswer === questions[currentQuestionIndex].answer ? 1 : 0),
          attemptedQuestions: questions
            .slice(0, newAttemptCount)
            .map((q, index) => ({
              question: q.question,
              correctAnswer: q.answer,
              userAnswer: newUserAnswers[index] || "",
              isCorrect: newUserAnswers[index] === q.answer,
            })),
        })
      );
      router.push("/game_four/results");
      return;
    }

    setCurrentAnswer("");
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);

    if (currentQuestionIndex >= questions.length - 2) {
      setQuestions((prev) => [...prev, generateQuestion()]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnswerSubmit();
    }
  };

  return (
    <div className="flex items-center justify-between min-h-screen w-full">
      <Image
        src="/strip.jpg"
        alt="Strip image"
        width={300}
        height={400}
        className="h-screen w-auto object-cover"
      />
      <div className="flex flex-col items-center gap-4 flex-1">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={300}
          height={300}
          className="object-contain mb-6"
        />
        <div className="flex">
          <div className="border-2 border-black w-[140px] h-[180px] flex items-center justify-center bg-white">
            <Image
              src="/MyXCartoon.png"
              alt="Cartoon icon"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="border-2 border-black w-[220px] h-[180px] flex items-center justify-center bg-white">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border-2 border-black w-[140px] h-[180px] flex items-center justify-center bg-white">
            <Image
              src="/EST.png"
              alt="EST icon"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-7xl font-mono border-8 border-black rounded-2xl p-6 w-[48rem] text-center mt-8">
          {formatTime(time)}
        </div>
        <div className="flex items-center gap-8 mt-6">
          <button
            onClick={handleStart}
            className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 rounded-xl text-4xl font-bold border-4 border-black"
          >
            Start
          </button>
          <div className="text-4xl font-bold border-4 border-black rounded-xl px-8 py-6 bg-white">
            Attempts: {attemptCount}/10
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="bg-blue-500 text-white text-3xl font-bold border-4 border-black rounded-xl px-8 py-4">
            {questions[currentQuestionIndex].question} is
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleKeyPress(e);
                } else if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="border-4 border-black rounded-xl py-4 text-center text-4xl w-[250px]"
              placeholder="Type here"
              disabled={!isRunning || attemptCount >= 10}
            />
            <button
              onClick={handleAnswerSubmit}
              className={`${
                isRunning && attemptCount < 10
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-400"
              } text-black p-2 rounded-xl border-4 border-black`}
              disabled={!isRunning || attemptCount >= 10}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFour;
