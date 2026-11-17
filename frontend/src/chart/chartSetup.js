import {
  Chart,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement,
  ScatterController,
  Tooltip
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(
  ScatterController,
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  Legend,
  Tooltip,
  zoomPlugin,
  annotationPlugin,
  ChartDataLabels
);
