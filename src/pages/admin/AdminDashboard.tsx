import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminStatus } from "@/lib/supabase/admin";
import { useAuth } from "@/app/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { BarChart, PieChart } from "@/components/common/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiHome, FiUser, FiAlertCircle } from "react-icons/fi";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend: 'up' | 'down';
    change: string;
  }

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalUsers: 0,
    newUsers: 0,
    revenue: 0
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const isAdmin = await checkAdminStatus(user.id);
        if (!isAdmin) navigate("/");
      } else {
        navigate("/login");
      }
    };
    verifyAdmin();
  }, [user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch all stats in parallel
      const [
        { count: totalListings },
        { count: activeListings },
        { count: pendingListings },
        { count: totalUsers },
        { count: newUsers },
        { data: revenueData }
      ] = await Promise.all([
        supabase.from('homes').select('*', { count: 'exact' }),
        supabase.from('homes').select('*', { count: 'exact' }).eq('status', 'active'),
        supabase.from('homes').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('payments').select('amount').gte('payment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      setStats({
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        pendingListings: pendingListings || 0,
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        revenue: revenueData?.reduce((sum, item) => sum + item.amount, 0) || 0
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Listings" 
          value={stats.totalListings} 
          icon={<FiHome className="text-indigo-500" size={24} />} 
          trend="up" 
          change="12%"
        />
        <StatCard 
          title="Active Listings" 
          value={stats.activeListings} 
          icon={<FiHome className="text-green-500" size={24} />} 
          trend="up" 
          change="8%"
        />
        <StatCard 
          title="Pending Approval" 
          value={stats.pendingListings} 
          icon={<FiAlertCircle className="text-yellow-500" size={24} />} 
          trend="down" 
          change="3%"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<FiUser className="text-blue-500" size={24} />} 
          trend="up" 
          change="15%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart 
                data={[
                  { month: 'Jan', revenue: 4000 },
                  { month: 'Feb', revenue: 3000 },
                  { month: 'Mar', revenue: 5000 },
                  { month: 'Apr', revenue: 2780 },
                  { month: 'May', revenue: 1890 },
                  { month: 'Jun', revenue: 2390 },
                ]} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <PieChart 
                data={[
                  { name: 'Residential', value: 400 },
                  { name: 'Commercial', value: 300 },
                  { name: 'Land', value: 200 },
                  { name: 'Rental', value: 100 },
                ]} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FiUser size={16} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-sm text-gray-500">John Doe registered 2 hours ago</p>
                </div>
                <div className="text-xs text-gray-400">2h ago</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, trend, change }: StatCardProps) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
            {trend === 'up' ? '↑' : '↓'} {change} from last month
          </p>
        </CardContent>
      </Card>
    );
  }