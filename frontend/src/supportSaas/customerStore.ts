import { configureStore } from '@reduxjs/toolkit';

/** Supplies only the read-only selectors required by upstream section navigation; never loads native auth storage. */
function navigationState() {
  return {
    preference: {
      agents: [],
      sharedAgents: [],
      selectedAgent: null,
      analyticsEnabled: false,
    },
    connectors: { enabled: false },
  };
}
const customerStore = configureStore({
  reducer: (state = navigationState()) => state,
});
export default customerStore;
