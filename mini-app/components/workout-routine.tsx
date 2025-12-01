"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

function getRandomExercises() {
  const categories = Object.keys(exercises);
  const routine = [];
  const count = Math.floor(Math.random() * 3) + 5; // 5-7 exercises
  while (routine.length < count) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const list = exercises[cat];
    const ex = list[Math.floor(Math.random() * list.length)];
    if (!routine.find((e) => e.name === ex.name)) {
      routine.push(ex);
    }
  }
  return routine;
}

export default function WorkoutRoutine() {
  const [routine, setRoutine] = useState(getRandomExercises());

  const generate = () => setRoutine(getRandomExercises());

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-center">Workout Routine Randomizer</h1>
      <Button onClick={generate} className="self-center">
        Generate New Routine
      </Button>
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
