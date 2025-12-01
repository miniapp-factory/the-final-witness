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
  group: string;
};

const exercises = {
  cardio: [
    { name: "Jumping Jacks", description: "Full body cardio exercise", reps: "30 seconds", group: "cardio" },
    { name: "High Knees", description: "Run in place raising knees high", reps: "30 seconds", group: "cardio" },
    { name: "Burpees", description: "Full body strength and cardio", reps: "10 reps", group: "cardio" },
  ],
  strength: [
    { name: "Push Ups", description: "Upper body strength", reps: "15 reps", group: "strength" },
    { name: "Squats", description: "Lower body strength", reps: "20 reps", group: "strength" },
    { name: "Lunges", description: "Lower body strength", reps: "12 reps each leg", group: "strength" },
  ],
  core: [
    { name: "Plank", description: "Core stability", reps: "45 seconds", group: "core" },
    { name: "Russian Twists", description: "Oblique strength", reps: "20 reps", group: "core" },
    { name: "Bicycle Crunches", description: "Core and obliques", reps: "15 reps each side", group: "core" },
  ],
  stretching: [
    { name: "Hamstring Stretch", description: "Lower back and hamstrings", reps: "30 seconds each leg", group: "stretching" },
    { name: "Quad Stretch", description: "Front thigh stretch", reps: "30 seconds each leg", group: "stretching" },
    { name: "Shoulder Stretch", description: "Upper body stretch", reps: "30 seconds each arm", group: "stretching" },
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

function getIcon(group: string): string {
  switch (group) {
    case "cardio":
      return "🏃‍♂️";
    case "strength":
      return "💪";
    case "core":
      return "🧘‍♂️";
    case "stretching":
      return "🤸‍♂️";
    default:
      return "";
  }
}

export default function WorkoutRoutine() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [length, setLength] = useState<LengthOption>(5);
  const [routine, setRoutine] = useState<Exercise[]>(getRandomExercises(difficulty, length));
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [locked, setLocked] = useState<boolean[]>(Array(routine.length).fill(false));
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRest, setIsRest] = useState<boolean>(false);
  const [restTime] = useState<number>(30);
  const [completed, setCompleted] = useState<boolean[]>([]);

  useEffect(() => {
    setLocked(Array(routine.length).fill(false));
  }, [routine]);
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

  const generate = () => {
    setRoutine((prev) => {
      const newRoutine = getRandomExercises(difficulty, length);
      return prev.map((ex, idx) => (locked[idx] ? ex : newRoutine[idx]));
    });
    setLocked(Array(routine.length).fill(false));
  };

  const displayedRoutine = filterGroup ? routine.filter((e) => e.group === filterGroup) : routine;
  const totalTime = routine.reduce((sum, ex) => sum + getExerciseDuration(ex), 0);
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-center">Workout Routine Randomizer</h1>
      <div className="text-center text-sm text-muted-foreground">
        Total Exercises: {routine.length} | Total Time: {totalTime}s
      </div>
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

        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {Array.from(new Set(routine.map((e) => e.group))).map((g) => (
            <Button
              key={g}
              variant={filterGroup === g ? "default" : "outline"}
              onClick={() => setFilterGroup(g)}
            >
              {g}
            </Button>
          ))}
          <Button variant="outline" onClick={() => setFilterGroup(null)}>
            Clear All
          </Button>
        </div>
        <Button onClick={generate} className="self-center mt-4 w-full sm:w-auto">
          Generate New Routine
        </Button>
      </div>
      <Button onClick={startWorkout} className="self-center mt-2 w-full sm:w-auto">
        Start Workout
      </Button>
      {currentIndex >= 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{routine[currentIndex].name}</h2>
          <p>{routine[currentIndex].description}</p>
          <p className="mt-2">
            {isRest ? `Rest: ${timeLeft}s` : `Time left: ${timeLeft}s`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Rest recommendation: {restTime}s between sets
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedRoutine.map((ex, idx) => (
          <Card key={idx} className="shadow-md rounded-lg p-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{ex.name}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setLocked((prev) =>
                      prev.map((l, i) => (i === idx ? !l : l))
                    );
                  }}
                >
                  {locked[idx] ? "🔓" : "🔒"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setRoutine((prev) => {
                      const newEx = getRandomExercises(difficulty, 1)[0];
                      return prev.map((e, i) => (i === idx ? newEx : e));
                    });
                  }}
                >
                  🔄
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{ex.description}</CardDescription>
              <p className="mt-2 font-medium">
                <span className="inline-block bg-muted rounded px-2 py-1 text-xs mr-2">
                  {getIcon(ex.group)} {ex.reps}
                </span>
                {ex.reps}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
