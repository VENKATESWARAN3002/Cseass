import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ReferenceLine,
  Label,
  Cell,
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const PerformanceStatistics = ({ dataForChart, averageGPA }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontSize: 14 }}>
          Semester-wise GPA Performance
        </Typography>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={dataForChart} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" domain={[0, 10]}>
              <Label value="GPA" angle={-90} position="insideLeft" />
            </YAxis>
            <YAxis yAxisId="right" orientation="right">
              <Label value="Percentage Change" angle={90} position="insideRight" />
            </YAxis>
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'percentageChange') {
                  return `${value.toFixed(2)}%`;
                }
                return value;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="GPA" fill="#8884d8">
              {dataForChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="percentageChange" stroke="#ff7300" />
            <ReferenceLine yAxisId="left" y={averageGPA} label="Avg GPA" stroke="green" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceStatistics;
