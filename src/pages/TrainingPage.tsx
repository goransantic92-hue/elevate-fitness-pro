import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell, Home, Zap } from "lucide-react";
import coachTraining from "@/assets/coach-training.jpg";

const gymWorkoutA = {
  title: "TRAINING A — UPPER BODY PUSH",
  focus: "Chest · Shoulders · Triceps",
  warmup: "5 min: Arm circles, band pull-aparts, 10 push-ups",
  exercises: [
    { name: "Barbell / Dumbbell Bench Press", target: "Chest, Shoulders, Triceps", sets: "4", reps: "6–8", rest: "90s", tip: "Keep shoulder blades retracted. Control the descent for 2 sec." },
    { name: "Overhead Press (DB or BB)", target: "Shoulders, Triceps", sets: "3", reps: "8–10", rest: "75s", tip: "Brace your core. Don't lean back — keep ribs down." },
    { name: "Incline Dumbbell Press", target: "Upper Chest", sets: "3", reps: "10–12", rest: "60s", tip: "Set bench to 30-45°. Full stretch at bottom, squeeze at top." },
    { name: "Lateral Raises", target: "Side Delts", sets: "3", reps: "12–15", rest: "45s", tip: "Lead with elbows, not wrists." },
    { name: "Cable / Band Tricep Pushdown", target: "Triceps", sets: "3", reps: "12–15", rest: "45s", tip: "Keep elbows tucked. Squeeze hard at full extension." },
  ],
  finisher: "2 min: Max push-ups (bodyweight). Rest 60s. Done.",
};

const gymWorkoutB = {
  title: "TRAINING B — LOWER BODY",
  focus: "Quads · Hamstrings · Glutes · Core",
  warmup: "5 min: Hip circles, bodyweight squats x15, leg swings",
  exercises: [
    { name: "Barbell Squat / Goblet Squat", target: "Quads, Glutes, Core", sets: "4", reps: "6–8", rest: "2 min", tip: "Depth below parallel. Chest up, knees track over toes." },
    { name: "Romanian Deadlift (RDL)", target: "Hamstrings, Glutes, Lower Back", sets: "3", reps: "8–10", rest: "90s", tip: "Push hips back, not down. Feel the hamstring stretch." },
    { name: "Leg Press / Bulgarian Split Squat", target: "Quads, Glutes", sets: "3", reps: "10–12", rest: "75s", tip: "Split squat: rear foot elevated, front foot forward." },
    { name: "Leg Curl (Machine or Band)", target: "Hamstrings", sets: "3", reps: "12–15", rest: "60s", tip: "Squeeze hard at peak contraction." },
    { name: "Standing Calf Raises", target: "Calves", sets: "4", reps: "15–20", rest: "45s", tip: "Full range of motion — all the way up, all the way down." },
    { name: "Plank Hold", target: "Core, Abs", sets: "3", reps: "30–45s", rest: "45s", tip: "Squeeze glutes and abs simultaneously." },
  ],
  finisher: "3 sets: 20 bodyweight squats + 20 walking lunges. No rest between sets.",
};

const gymWorkoutC = {
  title: "TRAINING C — UPPER BODY PULL",
  focus: "Back · Biceps · Rear Delts",
  warmup: "5 min: Cat-cow, band pull-aparts, dead hang 20s",
  exercises: [
    { name: "Pull-Ups / Lat Pulldown", target: "Lats, Biceps, Rear Delts", sets: "4", reps: "6–8", rest: "90s", tip: "Initiate with shoulder blades, then pull elbows to hips." },
    { name: "Barbell or Dumbbell Row", target: "Mid Back, Lats, Rhomboids", sets: "4", reps: "8–10", rest: "75s", tip: "Row to lower chest, not upper. Control — don't swing." },
    { name: "Seated Cable Row / Band Row", target: "Mid Back, Traps", sets: "3", reps: "10–12", rest: "60s", tip: "Chest proud, pull elbows back as far as possible." },
    { name: "Face Pulls or Rear Delt Fly", target: "Rear Delts, Rotator Cuff", sets: "3", reps: "15–20", rest: "45s", tip: "Light weight, full range. Elbows high. Crucial for posture." },
    { name: "Barbell / Dumbbell Bicep Curl", target: "Biceps", sets: "3", reps: "10–12", rest: "60s", tip: "No swinging. Control top and bottom." },
    { name: "Hammer Curl", target: "Brachialis, Forearms", sets: "2", reps: "12–15", rest: "45s", tip: "Alternate arms. Keep wrists neutral." },
  ],
  finisher: "2 sets: 10 pull-ups or 15 lat pulldown reps at 70%. Slow and controlled.",
};

const emergencyWorkouts = [
  { name: "Push Day", time: "10 min", exercises: "Push-Ups (3×Max) → Pike Push-Ups (3×10-15) → Diamond Push-Ups (2×Max)" },
  { name: "Pull Day", time: "10 min", exercises: "Pull-Ups/Inverted Row (3×Max) → Band Row (3×15) → Bicep Curl (2×15)" },
  { name: "Leg Day", time: "10 min", exercises: "Jump Squats (3×20) → Bulgarian Split Squat (3×10/leg) → Glute Bridge (3×20)" },
  { name: "Full Body Blast", time: "10 min", exercises: "Burpees (3×10) → Push-Ups (2×Max) → Reverse Lunges (2×12/leg) → Plank (60s)" },
];

const WorkoutCard = ({ workout }: { workout: typeof gymWorkoutA }) => (
  <div className="glass-card overflow-hidden">
    <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 border-b border-border/50">
      <h3 className="text-xl font-black">{workout.title}</h3>
      <p className="text-sm text-primary mt-1">{workout.focus}</p>
      <p className="text-xs text-muted-foreground mt-2">Warm-Up: {workout.warmup}</p>
    </div>
    <div className="divide-y divide-border/50">
      {workout.exercises.map((ex, i) => (
        <div key={i} className="p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-xs text-primary font-bold mr-2">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-semibold text-sm">{ex.name}</span>
              <span className="text-xs text-muted-foreground ml-2">— {ex.target}</span>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.sets} sets</span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.reps} reps</span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.rest} rest</span>
          </div>
          <p className="text-xs text-muted-foreground italic">💡 {ex.tip}</p>
        </div>
      ))}
    </div>
    <div className="bg-primary/5 p-4 border-t border-border/50">
      <p className="text-xs font-medium"><span className="text-primary font-bold">FINISHER:</span> {workout.finisher}</p>
    </div>
  </div>
);

const TrainingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={coachTraining} alt="Coach Milos training with barbell" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">TRAINING PROGRAMS</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Train Smart. <span className="text-gradient">Train Strong.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each workout follows the same structure: Warm-Up → Main Work → Finisher. Progressive overload means adding weight OR reps each session.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="glass-card px-5 py-3 flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Gym Programs</span>
            </div>
            <div className="glass-card px-5 py-3 flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Home Programs</span>
            </div>
            <div className="glass-card px-5 py-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Emergency 10-Min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Workouts */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black">Gym Training Programs</h2>
          </div>
          <div className="space-y-8">
            <WorkoutCard workout={gymWorkoutA} />
            <WorkoutCard workout={gymWorkoutB} />
            <WorkoutCard workout={gymWorkoutC} />
          </div>
        </div>
      </section>

      {/* Home Note */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Home className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black">Home Training Programs</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            No gym? No problem. Home workouts require zero equipment — or minimal household items. They match the gym versions in structure and intensity. Use these on travel weeks, busy mornings, or whenever the gym isn't accessible.
          </p>
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground mb-4">Full home workout details available in the member dashboard after purchase.</p>
            <Link to="/pricing">
              <Button className="bg-primary text-primary-foreground font-semibold">
                Unlock All Workouts — €39 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Workouts */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-black">10-Minute Emergency Workouts</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Life happens. Use these on days when you have literally 10 minutes. They are not substitutes for main sessions — but they are far better than nothing. <strong className="text-foreground">Missing a session is a choice.</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyWorkouts.map((w) => (
              <div key={w.name} className="glass-card p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">{w.name}</h4>
                  <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">{w.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{w.exercises}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
