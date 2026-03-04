import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

interface PieChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartDataPoint[];
  size?: number;
  innerRadius?: number; // 0-1, 0 = pie, >0 = donut
  style?: ViewStyle;
  showLegend?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createArcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  if (innerR === 0) {
    // Pie slice
    return [
      `M ${cx} ${cy}`,
      `L ${outerEnd.x} ${outerEnd.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerStart.x} ${outerStart.y}`,
      'Z',
    ].join(' ');
  }

  // Donut segment
  return [
    `M ${outerEnd.x} ${outerEnd.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerStart.x} ${outerStart.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export function PieChart({
  data,
  size = 200,
  innerRadius = 0.6,
  style,
  showLegend = true,
}: PieChartProps) {
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) - 4;
  const innerR = outerR * innerRadius;

  let currentAngle = 0;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return {
      ...d,
      startAngle,
      endAngle: currentAngle,
      percentage: Math.round((d.value / total) * 100),
    };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => (
            <Path
              key={i}
              d={createArcPath(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
          {innerRadius > 0 && (
            <SvgText
              x={cx}
              y={cy - 6}
              fill="#030213"
              fontSize={20}
              fontWeight="700"
              textAnchor="middle"
            >
              {total}
            </SvgText>
          )}
          {innerRadius > 0 && (
            <SvgText
              x={cx}
              y={cy + 14}
              fill="#64748b"
              fontSize={11}
              textAnchor="middle"
            >
              Total
            </SvgText>
          )}
        </Svg>
      </View>

      {showLegend && (
        <View style={styles.legend}>
          {slices.map((slice, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {slice.label}
              </Text>
              <Text style={styles.legendValue}>{slice.percentage}%</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    marginTop: 16,
    gap: 8,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#030213',
  },
});
