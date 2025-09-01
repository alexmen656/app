<template>
  <div class="bmi-chart-container">
    <apexchart
      type="line"
      height="300"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { default as ApexCharts } from 'vue3-apexcharts'

// Register the component locally
const apexchart = ApexCharts

interface BMIDataPoint {
  date: string
  bmi: number
}

interface BMIChartProps {
  data: BMIDataPoint[]
  period?: string
}

const props = defineProps<BMIChartProps>()

const chartData = computed(() => {
  if (props.data?.length) {
    return props.data
  }
  // Fallback mock data
  return [
    { date: '2025-06-01', bmi: 23.2 },
    { date: '2025-06-15', bmi: 23.0 },
    { date: '2025-07-01', bmi: 22.8 },
    { date: '2025-07-15', bmi: 22.6 },
    { date: '2025-08-01', bmi: 22.5 },
    { date: '2025-08-15', bmi: 22.5 },
    { date: '2025-09-01', bmi: 22.5 }
  ]
})

const chartSeries = computed(() => {
  return [
    {
      name: 'BMI',
      data: chartData.value.map(point => ({
        x: new Date(point.date).getTime(),
        y: point.bmi
      }))
    }
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    background: 'transparent',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  theme: {
    mode: 'dark'
  },
  colors: ['#007AFF'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: '#9ca3af',
        fontSize: '12px'
      },
      format: 'dd MMM'
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      text: 'BMI',
      style: {
        color: '#9ca3af',
        fontSize: '12px',
        fontWeight: 600
      }
    },
    labels: {
      style: {
        colors: '#9ca3af',
        fontSize: '12px'
      },
      formatter: (value: number) => value.toFixed(1)
    },
    min: 15,
    max: 35
  },
  annotations: {
    yaxis: [
      {
        y: 18.5,
        borderColor: '#2196F3',
        label: {
          borderColor: '#2196F3',
          style: {
            color: '#fff',
            background: '#2196F3'
          },
          text: 'Untergewicht'
        }
      },
      {
        y: 25,
        borderColor: '#FF9800',
        label: {
          borderColor: '#FF9800',
          style: {
            color: '#fff',
            background: '#FF9800'
          },
          text: 'Übergewicht'
        }
      },
      {
        y: 30,
        borderColor: '#F44336',
        label: {
          borderColor: '#F44336',
          style: {
            color: '#fff',
            background: '#F44336'
          },
          text: 'Adipositas'
        }
      }
    ]
  },
  markers: {
    size: 5,
    colors: ['#007AFF'],
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: {
      size: 7
    }
  },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '12px'
    },
    y: {
      formatter: (value: number) => `${value.toFixed(1)} BMI`
    },
    x: {
      format: 'dd MMM yyyy'
    }
  },
  dataLabels: {
    enabled: false
  }
}))
</script>

<style scoped>
.bmi-chart-container {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Override ApexCharts dark theme */
:deep(.apexcharts-canvas) {
  background: transparent !important;
}

:deep(.apexcharts-gridline) {
  stroke: rgba(255, 255, 255, 0.1) !important;
}

:deep(.apexcharts-text) {
  fill: #9ca3af !important;
}
</style>
