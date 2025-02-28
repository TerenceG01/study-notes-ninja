
import React from 'react';
import { 
  NoteCardSkeleton, 
  FlashcardSkeleton, 
  TableSkeleton, 
  StudyGroupSkeleton,
  NotesGridSkeleton
} from "@/components/ui/loading-skeletons";

const LoadingSkeletonExamples = () => {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Loading Skeleton Examples</h1>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Note Card Skeletons</h2>
        <NotesGridSkeleton count={3} />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Flashcard Skeleton</h2>
        <FlashcardSkeleton />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Table Skeleton</h2>
        <TableSkeleton rows={4} />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Study Group Skeleton</h2>
        <StudyGroupSkeleton />
      </section>
    </div>
  );
};

export default LoadingSkeletonExamples;
