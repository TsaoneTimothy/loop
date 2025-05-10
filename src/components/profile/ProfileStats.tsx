
import { Separator } from "@/components/ui/separator";

interface ProfileStatsProps {
  stats: {
    itemsSold: number;
    activeListings: number;
    totalEarnings: string;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="flex justify-between mb-6">
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.itemsSold}</p>
        <p className="text-sm text-muted-foreground">Items Sold</p>
      </div>
      
      <Separator orientation="vertical" />
      
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.activeListings}</p>
        <p className="text-sm text-muted-foreground">Active Listings</p>
      </div>
      
      <Separator orientation="vertical" />
      
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.totalEarnings}</p>
        <p className="text-sm text-muted-foreground">Total Earnings</p>
      </div>
    </div>
  );
};

export default ProfileStats;
