import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ChartCard({ title, data, dataKey = "health", xKey = "day" }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.8125rem'
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-accent)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
