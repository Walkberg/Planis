import type { MoodOption, StatusOption } from "./FieldConfig";

export const MOOD_OPTIONS: MoodOption[] = [
  { value: "joyeux", label: "Joyeux", emoji: "😄", color: "#FFD93D" },
  { value: "triste", label: "Triste", emoji: "😢", color: "#6BAAFF" },
  { value: "anxieux", label: "Anxieux", emoji: "😰", color: "#FF6B9D" },
  { value: "calme", label: "Calme", emoji: "😌", color: "#A8E6CF" },
  { value: "amoureux", label: "Amoureux", emoji: "😍", color: "#FF6B9D" },
  { value: "en_colere", label: "En colère", emoji: "😠", color: "#FF6347" },
  {
    value: "reconnaissant",
    label: "Reconnaissant",
    emoji: "🙏",
    color: "#FFB347",
  },
  { value: "fatigue", label: "Fatigué", emoji: "😴", color: "#B4B4C5" },
  { value: "pensif", label: "Pensif", emoji: "🤔", color: "#C7CEEA" },
  { value: "confiant", label: "Confiant", emoji: "😎", color: "#00D9FF" },
  {
    value: "melancolique",
    label: "Mélancolique",
    emoji: "😔",
    color: "#9DB4C0",
  },
  { value: "excite", label: "Excité", emoji: "🤩", color: "#FFC107" },
  { value: "stresse", label: "Stressé", emoji: "😣", color: "#FF8C42" },
  { value: "inspire", label: "Inspiré", emoji: "💡", color: "#FFEB3B" },
  { value: "ludique", label: "Ludique", emoji: "🎮", color: "#9C27B0" },
  { value: "paisible", label: "Paisible", emoji: "☮️", color: "#81C784" },
];

export const STATUS_OPTIONS: StatusOption[] = [
  { value: 1, label: "Très mal", emoji: "😞" },
  { value: 2, label: "Mal", emoji: "😕" },
  { value: 3, label: "Neutre", emoji: "😐" },
  { value: 4, label: "Bien", emoji: "🙂" },
  { value: 5, label: "Très bien", emoji: "😄" },
];
