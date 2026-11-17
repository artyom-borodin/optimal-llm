export async function startDatasetRefresh({ load, onData, intervalMs, onError }) {
  const refresh = async () => {
    onData(await load());
  };

  await refresh();

  const timer = setInterval(() => {
    refresh().catch((e) => onError?.(e));
  }, intervalMs);

  return () => clearInterval(timer);
}
