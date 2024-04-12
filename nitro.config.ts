//https://nitro.unjs.io/config
export default defineNitroConfig({
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    "0 0 0 * * ?": ["autoremove"],
  },
});
