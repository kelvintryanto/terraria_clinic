import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Edit } from "lucide-react";

export default function OwnerProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Owner Profile</h2>
        <Button
          variant="outline"
          className="gap-2"
          disabled>
          <Edit size={16} />
          Edit Profile
        </Button>
      </div>

      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-orange-300/80 text-sm">Full Name</h3>
              <Skeleton className="h-7 w-full bg-violet-800/50" />
            </div>
            <div>
              <h3 className="text-orange-300/80 text-sm">Email</h3>
              <Skeleton className="h-7 w-full bg-violet-800/50" />
            </div>
            <div>
              <h3 className="text-orange-300/80 text-sm">Member ID</h3>
              <Skeleton className="h-7 w-full bg-violet-800/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
