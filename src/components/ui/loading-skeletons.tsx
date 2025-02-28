
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const NoteCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-9 w-full" />
    </CardFooter>
  </Card>
);

export const FlashcardSkeleton = () => (
  <div className="max-w-md mx-auto">
    <Card>
      <CardContent className="pt-6 px-6 min-h-[300px] flex items-center justify-center">
        <div className="w-full space-y-4">
          <Skeleton className="h-6 w-4/5 mx-auto" />
          <Skeleton className="h-6 w-3/5 mx-auto" />
          <div className="pt-12 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="flex justify-between mt-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center p-4 border-b last:border-0">
    <Skeleton className="h-12 w-12 rounded-full mr-4" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="h-8 w-24" />
  </div>
);

export const TableSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="border rounded-md w-full">
    <div className="border-b p-4">
      <Skeleton className="h-8 w-full max-w-[300px]" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} />
    ))}
  </div>
);

export const StudyGroupSkeleton = () => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
    <div className="md:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </CardContent>
      </Card>
    </div>
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-3" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const NotesGridSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <NoteCardSkeleton key={i} />
    ))}
  </div>
);
