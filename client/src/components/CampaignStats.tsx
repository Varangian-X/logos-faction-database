import React, { useMemo } from 'react';
import { useCampaign } from '@/contexts/CampaignContext';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export function CampaignStats() {
  const { getStatistics } = useCampaign();
  const stats = useMemo(() => getStatistics(), [getStatistics]);

  const statusData = [
    { name: 'Active', value: stats.active, fill: '#eab308' },
    { name: 'Completed', value: stats.completed, fill: '#22c55e' },
    { name: 'Failed', value: stats.failed, fill: '#ef4444' },
  ].filter(item => item.value > 0);

  const typeData = Object.entries(stats.byType)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const factionData = Object.entries(stats.byFaction)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Scenarios</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-500">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-red-500">{stats.failed}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
      </div>

      {/* Status Distribution */}
      {statusData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Mission Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mission Type Distribution */}
      {typeData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Missions by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Factions */}
      {factionData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Top Factions Involved</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="name" type="category" width={150} stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistics Summary */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-semibold">Campaign Summary</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Success Rate:</span>
            <span className="ml-2 text-foreground font-semibold">
              {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Failure Rate:</span>
            <span className="ml-2 text-foreground font-semibold">
              {stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Most Common Mission Type:</span>
            <span className="ml-2 text-foreground font-semibold">
              {typeData.length > 0 ? typeData[0].name : 'N/A'}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Most Involved Faction:</span>
            <span className="ml-2 text-foreground font-semibold">
              {factionData.length > 0 ? factionData[0].name : 'N/A'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
