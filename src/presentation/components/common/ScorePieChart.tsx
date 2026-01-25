import { Box, Typography, useTheme } from "@mui/material";

type ScorePieChartProps = {
  /** The percentage value to display (0-100) */
  value: number;
  /** The text label to display below the chart */
  label: string;
  /** The size of the chart in pixels. @default 120 */
  size?: number;
  /** The thickness of the chart's stroke. @default 12 */
  strokeWidth?: number;
  
  percentage?: boolean
};

/**
 * A circular progress chart to display a percentage value,
 * often used for scores or statistics.
 */
export function ScorePieChart({
  value,
  label,
  size = 120,
  strokeWidth = 12,
  percentage = false
}: ScorePieChartProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value >= 70) return theme.palette.success.main;
    if (value >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="subtitle1" align="center" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            stroke="rgba(0, 0, 0, 0.1)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={getColor()}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" component="div" color="text.primary">
            {`${value.toFixed(2)}${percentage ? '%' : ''}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
