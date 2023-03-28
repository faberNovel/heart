import {
  ModuleAnalysisInterface,
  Config,
  GenericReport,
  Result,
  GreenITReport,
  ObservatoryReport,
} from "@fabernovel/heart-common"

export const analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[] = [
  {
    id: "greenit",
    name: "Heart GreenIT",
    service: {
      name: "GreenIT Analysis",
    },
    startAnalysis: () =>
      Promise.resolve(
        new GreenITReport({
          analyzedUrl: "",
          date: new Date(),
          result: {} as unknown as GreenITReport["result"],
          service: {
            name: "GreenIT Analysis",
          },
        })
      ),
  },
  {
    id: "observatory",
    name: "Heart Observatory",
    service: {
      name: "Mozilla Observatory",
    },
    startAnalysis: () =>
      Promise.resolve(
        new ObservatoryReport({
          analyzedUrl: "",
          date: new Date(),
          result: {
            scan: {
              grade: "",
              score: 100,
              state: "FINISHED",
            } as unknown as ObservatoryReport["result"]["scan"],
            tests: {},
          },
          service: {
            name: "GreenIT Analysis",
          },
        })
      ),
  },
]
