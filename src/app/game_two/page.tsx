"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GameTwo: React.FC = () => {
  const router = useRouter();
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
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

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="flex items-center min-h-screen w-full">
      <div className="h-screen fixed left-0">
        <Image
          src="/strip.jpg"
          alt="Strip image"
          width={300}
          height={400}
          className="h-screen w-auto object-cover"
        />
      </div>
      <div className="flex w-full pl-[300px]">
        <div className="flex flex-col items-center justify-center gap-4 w-[35%]">
          <div className="flex justify-center items-center gap-4">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="object-contain"
            />
            <div className="flex">
              <div className="border-2 border-black w-[100px] h-[140px] flex items-center justify-center bg-white">
                <Image
                  src="/MyXCartoon.png"
                  alt="Cartoon icon"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="border-2 border-black w-[160px] h-[140px] flex items-center justify-center bg-white">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border-2 border-black w-[100px] h-[140px] flex items-center justify-center bg-white">
                <Image
                  src="/EST.png"
                  alt="EST icon"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            <Image
              src="/MovementButton.png"
              alt="Movement Button"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="text-4xl font-mono border-8 border-black rounded-2xl p-6 w-[32rem] text-center mt-8">
            {formatTime(time)}
          </div>
          <div className="flex gap-8 mt-8">
            <button
              onClick={handleStart}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-4 rounded-xl text-3xl font-bold border-4 border-black"
            >
              Start
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-xl text-3xl font-bold border-4 border-black"
            >
              Stop
            </button>
          </div>
        </div>
        <div className="w-[65%] h-screen flex items-center justify-center">
          <div className="h-[90%] aspect-auto">
            <Image
              src="/right.png"
              alt="Right side image"
              width={1000}
              height={1000}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTwo;
