import type { ModuleListenerInterface } from "@fabernovel/heart-common"

export const listenerModules: ModuleListenerInterface[] = [
  {
    id: "listener1",
    name: "Heart Listener1",
    service: {
      name: "Listener1",
    },
    notifyAnalysisDone: () => Promise.resolve(),
    verbose: false,
  },
]
