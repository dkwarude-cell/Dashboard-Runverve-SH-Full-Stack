import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle, G, Line, Text as SvgText } from 'react-native-svg';

interface LineChartDataPoint {
  label: string;
  values: { value: number; color: string; label?: string }[];
}

interface LineChartProps {
  data: LineChartDataPoint[];
  height?: number;
  style?: ViewStyle;
  legend?: { label: string; color: string }[];
}

export function LineChart({ data, height = 200, style, legend }: LineChartProps) {
  if (data.length === 0) return null;

  const numSeries = data[0]?.values.length || 0;
  const maxValue = Math.max(
    ...data.flatMap((d) => d.values.map((v) => v.value)),
    1
  );

  const padding = { top: 10, bottom: 30, left: 40, right: 10 };
  const chartHeight = height - padding.top - padding.bottom;
  const svgWidth = 500;
  const chartWidth = svgWidth - padding.left - padding.right;

  // Generate paths for each series
  const paths: { path: string; color: string; points: { x: number; y: number }[] }[] = [];

  for (let si = 0; si < numSeries; si++) {
    const points = data.map((d, i) => ({
      x: padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth,
      y: padding.top + chartHeight - (d.values[si].value / maxValue) * chartHeight,
    }));

    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    paths.push({
      path,
      color: data[0].values[si].color,
      points,
    });
  }

  const yTicks = 5;
  const yStep = maxValue / yTicks;

  return (
    <View style={[styles.container, style]}>
      {legend && (
        <View style={styles.legend}>
          {legend.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      )}
      <Svg width="100%" height={height} viewBox={`0 0 ${svgWidth} ${height}`}>
        {/* Y-axis grid */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const yVal = Math.round(yStep * i);
          const y = padding.top + chartHeight - (yVal / maxValue) * chartHeight;
          return (
            <G key={`y-${i}`}>
              <Line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <SvgText
                x={padding.left - 8}
                y={y + 4}
                fill="#94a3b8"
                fontSize={11}
                textAnchor="end"
              >
                {yVal}
              </SvgText>
            </G>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
          return (
            <SvgText
              key={`x-${i}`}
              x={x}
              y={height - 8}
              fill="#64748b"
              fontSize={11}
              textAnchor="middle"
            >
              {d.label}
            </SvgText>
          );
        })}

        {/* Lines and dots */}
        {paths.map((series, si) => (
          <G key={`series-${si}`}>
            <Path
              d={series.path}
              fill="none"
              stroke={series.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {series.points.map((p, pi) => (
              <Circle
                key={`dot-${pi}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="#ffffff"
                stroke={series.color}
                strokeWidth={2}
              />
            ))}
          </G>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
});
