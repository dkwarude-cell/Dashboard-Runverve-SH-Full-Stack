import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';

interface BarChartDataPoint {
  label: string;
  values: { value: number; color: string; label?: string }[];
}

interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  style?: ViewStyle;
  legend?: { label: string; color: string }[];
}

export function BarChart({ data, height = 200, style, legend }: BarChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(
    ...data.flatMap((d) => d.values.map((v) => v.value)),
    1
  );
  const chartWidth = 100; // percentage
  const barGroupWidth = chartWidth / data.length;
  const padding = { top: 10, bottom: 30, left: 40, right: 10 };
  const chartHeight = height - padding.top - padding.bottom;
  const svgWidth = 500;

  const effectiveWidth = svgWidth - padding.left - padding.right;
  const groupWidth = effectiveWidth / data.length;
  const numBarsPerGroup = data[0]?.values.length || 1;
  const barWidth = Math.min(
    (groupWidth * 0.7) / numBarsPerGroup,
    30
  );
  const groupPadding = (groupWidth - barWidth * numBarsPerGroup) / 2;

  // Y-axis labels
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
        {/* Y-axis grid lines and labels */}
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

        {/* Bars */}
        {data.map((group, gi) => {
          const groupX = padding.left + gi * groupWidth;
          return (
            <G key={`g-${gi}`}>
              {group.values.map((bar, bi) => {
                const barHeight = (bar.value / maxValue) * chartHeight;
                const x = groupX + groupPadding + bi * barWidth;
                const y = padding.top + chartHeight - barHeight;
                return (
                  <Rect
                    key={`b-${bi}`}
                    x={x}
                    y={y}
                    width={barWidth - 2}
                    height={barHeight}
                    rx={3}
                    fill={bar.color}
                  />
                );
              })}
              <SvgText
                x={groupX + groupWidth / 2}
                y={height - 8}
                fill="#64748b"
                fontSize={11}
                textAnchor="middle"
              >
                {group.label}
              </SvgText>
            </G>
          );
        })}
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
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
});
