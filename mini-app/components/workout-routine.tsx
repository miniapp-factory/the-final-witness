"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Difficulty = "beginner" | "intermediate" | "advanced";
type LengthOption = 3 | 5 | 7 | 10;

type Exercise = {
  name: string;
  description: string;
  reps: string;
};

const exercises = {
  cardio: [
    { name: "Jumping Jacks", description: "Full body cardio exercise", reps: "30 seconds" },
    { name: "High Knees", description: "Run in place raising knees high", reps: "30 seconds" },
    { name: "Burpees", description: "Full body strength and cardio", reps: "10 reps" },
  ],
  strength: [
    { name: "Push Ups", description: "Upper body strength", reps: "15 reps" },
    { name: "Squats", description: "Lower body strength", reps: "20 reps" },
    { name: "Lunges", description: "Lower body strength", reps: "12 reps each leg" },
  ],
  core: [
    { name: "Plank", description: "Core stability", reps: "45 seconds" },
    { name: "Russian Twists", description: "Oblique strength", reps: "20 reps" },
    { name: "Bicycle Crunches", description: "Core and obliques", reps: "15 reps each side" },
  ],
  stretching: [
    { name: "Hamstring Stretch", description: "Lower back and hamstrings", reps: "30 seconds each leg" },
    { name: "Quad Stretch", description: "Front thigh stretch", reps: "30 seconds each leg" },
    { name: "Shoulder Stretch", description: "Upper body stretch", reps: "30 seconds each arm" },
  ],
};

function getRandomExercises(difficulty: Difficulty, length: LengthOption): Exercise[] {
  const categories = Object.keys(exercises);
  const routine: Exercise[] = [];
  const count = length;
  while (routine.length < count) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const list = exercises[cat as keyof typeof exercises];
    const ex = list[Math.floor(Math.random() * list.length)];
    if (!routine.find((e) => e.name === ex.name)) {
      routine.push(ex);
    }
  }
  return routine;
}

export default function WorkoutRoutine() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [length, setLength] = useState<LengthOption>(5);
  const [routine, setRoutine] = useState<Exercise[]>(getRandomExercises(difficulty, length));
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRest, setIsRest] = useState<boolean>(false);
  const [restTime] = useState<number>(30);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startWorkout = () => {
    setCurrentIndex(0);
    setCompleted(Array(routine.length).fill(false));
    setTimeLeft(getExerciseDuration(routine[0]));
    setIsRest(false);
  };

  const getExerciseDuration = (ex: Exercise): number => {
    const match = ex.reps.match(/(\\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    if (currentIndex === -1) return;
    if (isRest) {
      if (timeLeft <= 0) {
        setIsRest(false);
        setTimeLeft(getExerciseDuration(routine[currentIndex]));
      } else {
        timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      }
    } else {
      if (timeLeft <= 0) {
        setCompleted((prev) => {
          const newArr = [...prev];
          newArr[currentIndex] = true;
          return newArr;
        });
        if (currentIndex + 1 < routine.length) {
          setCurrentIndex((i) => i + 1);
          setIsRest(true);
          setTimeLeft(restTime);
        }
      } else {
        timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, timeLeft, isRest]);

  const generate = () => setRoutine(getRandomExercises(difficulty, length));

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-center">Workout Routine Randomizer</h1>
      <div className="flex flex-col gap-2 w-full max-w-md">
        <label className="text-sm font-medium">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="border rounded p-2"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label className="text-sm font-medium">Routine Length</label>
        <select
          value={length}
          onChange={(e) => setLength(Number(e.target.value) as LengthOption)}
          className="border rounded p-2"
        >
          <option value={3}>3 Exercises</option>
          <option value={5}>5 Exercises</option>
          <option value={7}>7 Exercises</option>
          <option value={10}>10 Exercises</option>
        </select>

        <Button onClick={generate} className="self-center mt-4">
          Generate New Routine
        </Button>
      </div>
      <Button onClick={startWorkout} className="self-center mt-2">
        Start Workout
      </Button>
      {currentIndex >= 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{routine[currentIndex].name}</h2>
          <p>{routine[currentIndex].description}</p>
          <p className="mt-2">
            {isRest ? `Rest: ${timeLeft}s` : `Time left: ${timeLeft}s`}
          </p>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={completed[currentIndex]}
              onChange={() => {}}
              className="mr-2"
            />
            Completed
          </label>
        </div>
      )}
      <div className="grid gap-4">
        {routine.map((ex, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{ex.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{ex.description}</CardDescription>
              <p className="mt-2 font-medium">Reps / Duration: {ex.reps}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
