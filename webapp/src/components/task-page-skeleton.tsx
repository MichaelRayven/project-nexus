import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

export function TaskPageSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 justify-between">
          {/* Back button skeleton */}
          <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse" />
          {/* GitHub button skeleton */}
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3 mb-2">
              {/* Title skeleton */}
              <div className="h-9 bg-gray-200 rounded w-2/3 animate-pulse" />
              {/* Status badge skeleton */}
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>
            {/* Issue number skeleton */}
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Task Body */}
          <Card>
            <CardHeader>
              <div className="h-7 bg-gray-200 rounded w-48 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                {/* Content lines skeleton */}
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
              <div className="space-y-4">
                {/* Content lines skeleton */}
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Action buttons skeleton */}
              <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
            </CardContent>
          </Card>

          {/* Task Information */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-44 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Information items skeleton */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                </div>
              ))}

              <Separator />

              {/* Created/Updated dates skeleton */}
              <div className="space-y-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignees */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-28 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Assignee items skeleton */}
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Linked Branches */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-36 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
