<template>
  <div class="chart-container">
    <template v-if="hasNonZero">
      <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="240" />
    </template>
    <template v-else>
      <div class="no-data">Keine Daten</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { default as ApexCharts } from 'vue3-apexcharts'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const apexchart = ApexCharts

interface ChartProps {
  data: Array<{ label: string; calories: number; goal?: number }>
  period: 'day' | 'week' | 'month' | 'year'
  goal?: number
}

const props = withDefaults(defineProps<ChartProps>(), {
  goal: 2500
})

const chartData = computed(() => {
  if (props.data?.length) {
    console.log('📊 CalorieChart received data:', props.data, 'period:', props.period)
    return props.data
  }
  // Fallback mock data
  console.log('⚠️ CalorieChart using fallback mock data, period:', props.period)
  return [
    { label: 'Mo', calories: 0 },
    { label: 'Di', calories: 0 },
    { label: 'Mi', calories: 0 },
    { label: 'Do', calories: 0 },
    { label: 'Fr', calories: 0 },
    { label: 'Sa', calories: 0 },
    { label: 'So', calories: 0 }
  ]
})

// whether any data point is non-zero
const hasNonZero = computed(() => {
  const result = chartData.value.some(item => (item.calories ?? 0) > 0)
  console.log('📈 CalorieChart hasNonZero check:', {
    chartDataLength: chartData.value.length,
    chartData: chartData.value,
    hasNonZero: result
  })
  return result
})

const chartSeries = computed(() => {
  const values = chartData.value.map(item => item.calories)
  const max = Math.max(...values, 1)
  // visual minimum for zero-values (5% of max or at least 1)
  const minVisual = Math.max(1, Math.round(max * 0.05))

  const baseline = chartData.value.map(item => (item.calories === 0 ? minVisual : 0))

  return [
    {
      name: t('allScans.calories'),
      data: values
    },
    {
      name: 'zero-baseline',
      data: baseline,
      // hide baseline from legend/tooltips where possible
      showInLegend: false
    }
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    toolbar: { show: false },
    stacked: true,
    // animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  theme: { mode: 'dark' },
  // main series: top color #ff8e8e -> bottom color #ff6b6b; second color used for zero-baseline
  colors: ['#ff8e8e', '#ff6b6b'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
      distributed: false,
      dataLabels: { position: 'top' },
      borderRadiusApplication: 'end',
      horizontal: false
    }
  },
  stroke: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (value: number) => `${value}`,
    // small offset so labels sit just above the bar
    offsetY: -22,
    style: { colors: ['#ffffff'], fontSize: '12px', fontWeight: '400' },
    background: { enabled: false }
  },
  legend: { show: false },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shade: 'light',
      shadeIntensity: 0.4,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      // explicit top->bottom colors to match `linear-gradient(to top, #ff6b6b, #ff8e8e)`
      // ApexCharts uses `colors` as the start (top) and `gradientToColors` as the end (bottom)
      gradientToColors: ['#ff6b6b'],
      stops: [0, 100]
    }
  },

  xaxis: {
    categories: chartData.value.map(item => item.label),
    labels: { style: { colors: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false }
  },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)', strokeDashArray: 3 },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px' },
    y: {
      formatter: (value: number) => {
        const diff = value - props.goal
        const diffText = diff > 0 ? `+${diff}` : `${diff}`
        return `${value} kcal<br/>${t('onboarding.goal')}: ${props.goal} kcal<br/>Differenz: ${diffText} kcal`
      }
    }
  },
  annotations: {
    yaxis: props.goal ? [{
      y: props.goal,
      borderColor: 'rgba(255, 167, 38, 0.8)',
      strokeDashArray: 5,
      label: { text: `${t('onboarding.goal')}: ${props.goal} kcal`, style: { color: '#ffffff', background: 'rgba(255, 167, 38, 0.8)' } }
    }] : [],
    points: []
  }
}))
</script>

<style scoped>
.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  /*padding: 20px;*/
  backdrop-filter: blur(10px);
}

apexchart {
  height: 100%;
}

.no-data {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
</style>
