import type { FakeMetric } from '@/lib/data/fake-data'
import cn from '@/lib/utils/cn'

interface StatCardProps {
  metric: FakeMetric
}

export function StatCard({ metric }: StatCardProps) {
  const isPositive = metric.change >= 0

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="text-primary/70 text-sm mb-1">{metric.label}</div>
      <div className="text-2xl font-bold text-primary mb-2">
        {metric.value.toLocaleString()}
        {metric.unit && <span className="text-lg ml-1">{metric.unit}</span>}
      </div>
      <div
        className={cn(
          'text-sm flex items-center gap-1',
          isPositive ? 'text-green-500' : 'text-red-500'
        )}
      >
        <span>{isPositive ? '↑' : '↓'}</span>
        <span>
          {Math.abs(metric.change).toLocaleString()}
          {metric.unit && ` ${metric.unit}`}
        </span>
        <span className="text-primary/50">vs last period (fake)</span>
      </div>
    </div>
  )
}

