
import React from "react";
import { StudyModeContainer } from "@/components/flashcards/study/StudyModeContainer";

interface StudyModeProps {
  flashcards: any[];
  deckId: string;
}

export const StudyMode: React.FC<StudyModeProps> = ({ flashcards, deckId }) => {
  return <StudyModeContainer flashcards={flashcards} deckId={deckId} />;
};
