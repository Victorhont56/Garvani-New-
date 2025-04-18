import { useState, useEffect } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Sector
} from "recharts";

// Color palette for charts
const COLORS = [
  "#6366f1", // Indigo (primary)
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
];

// BarChart Component
export function BarChart({ data, dataKey = "revenue", xAxisKey = "month" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: "#6b7280" }} 
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis 
          tick={{ fill: "#6b7280" }} 
          axisLine={{ stroke: "#e5e7eb" }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip 
          formatter={(value) => [`$${value.toLocaleString()}`, dataKey.charAt(0).toUpperCase() + dataKey.slice(1)]}
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "0.375rem", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar 
          dataKey={dataKey} 
          fill="#6366f1" 
          radius={[4, 4, 0, 0]}
          name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// PieChart Component
export function PieChart({ data, dataKey = "value", nameKey = "name" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload[nameKey]}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload[nameKey]}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [value, data[activeIndex]?.[nameKey]]}
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "0.375rem", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value, entry, index) => {
            return (
              <span style={{ color: COLORS[index % COLORS.length] }}>{value}</span>
            );
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

// Additional LineChart component that might be useful for your dashboard
export function LineChart({ data, dataKey = "value", xAxisKey = "name" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: "#6b7280" }} 
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis 
          tick={{ fill: "#6b7280" }} 
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "0.375rem", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar 
          dataKey={dataKey} 
          fill="#6366f1" 
          radius={[4, 4, 0, 0]}
          name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Stats chart for the PendingListings component
export function StatsChart({ pendingData, approvalData, timeframe = "week" }) {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Transform data based on timeframe
    if (timeframe === "week") {
      setChartData([
        { name: "Mon", pending: pendingData?.mon || 0, approved: approvalData?.mon || 0 },
        { name: "Tue", pending: pendingData?.tue || 0, approved: approvalData?.tue || 0 },
        { name: "Wed", pending: pendingData?.wed || 0, approved: approvalData?.wed || 0 },
        { name: "Thu", pending: pendingData?.thu || 0, approved: approvalData?.thu || 0 },
        { name: "Fri", pending: pendingData?.fri || 0, approved: approvalData?.fri || 0 },
        { name: "Sat", pending: pendingData?.sat || 0, approved: approvalData?.sat || 0 },
        { name: "Sun", pending: pendingData?.sun || 0, approved: approvalData?.sun || 0 },
      ]);
    } else if (timeframe === "month") {
      // For monthly view, create data from current date back 30 days
      const days = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        days.unshift({
          name: day.toString(),
          pending: pendingData?.[day] || 0,
          approved: approvalData?.[day] || 0
        });
      }
      setChartData(days);
    }
  }, [pendingData, approvalData, timeframe]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: "#6b7280" }} 
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis 
          tick={{ fill: "#6b7280" }} 
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "0.375rem", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar 
          dataKey="pending" 
          fill="#f59e0b" 
          radius={[4, 4, 0, 0]}
          name="Pending"
        />
        <Bar 
          dataKey="approved" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]}
          name="Approved"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Distribution chart for listing types
export function DistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value} listings`, name]}
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "0.375rem", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none"
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}