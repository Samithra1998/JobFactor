import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Areachart = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
      data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" barSize={75} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default Areachart;
