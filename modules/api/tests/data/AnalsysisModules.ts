import {
  ModuleAnalysisInterface,
  Config,
  GenericReport,
  Result,
  GreenITReport,
  ObservatoryReport,
} from "@fabernovel/heart-common"
import type { GreenITResult } from "@fabernovel/heart-common/lib/report/greenit/GreenITResult.js"
import type { ObservatoryResult } from "@fabernovel/heart-common/lib/report/observatory/ObservatoryResult.js"

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
          result: {} as unknown as GreenITResult,
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
          result: {} as unknown as ObservatoryResult,
          service: {
            name: "GreenIT Analysis",
          },
        })
      ),
  },
]
