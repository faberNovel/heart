import type { LighthouseReport } from "@fabernovel/heart-common"
import type { MrkdwnElement, SectionBlock } from "@slack/web-api"

export const formatLighthouseBlocks = (report: LighthouseReport): [MrkdwnElement[], SectionBlock[]] => {
  const metricsBlocks: MrkdwnElement[] = [
    "first-contentful-paint",
    "speed-index",
    "largest-contentful-paint",
    "interactive",
    "total-blocking-time",
    "cumulative-layout-shift",
  ].map((auditKey) => ({
    type: "mrkdwn",
    text: `*${report.result.audits[auditKey].title}*: ${report.result.audits[auditKey].displayValue ?? ""}`,
  }))

  const audits = Object.values(report.result.audits)

  const advicesBlocks: SectionBlock[][] = Object.values(report.result.categories)
    .sort((a, b) => (a.title < b.title ? -1 : 0)) // alphabetical sort
    .map((category) => {
      const auditsIds = category.auditRefs
        .filter((auditRef) => !["metrics", "hidden"].includes(auditRef.group ?? ""))
        .map((auditRef) => auditRef.id)

      const advices = audits.filter(
        (audit) => auditsIds.includes(audit.id) && audit.score !== null && audit.score < 1
      )

      const sections: SectionBlock[] = []

      // display the category only if it contains advices
      if (advices.length > 0) {
        sections.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${category.title} (${
              category.score === null ? "" : `${Math.round(category.score * 100)}/100)`
            }*`,
          },
        })

        sections.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: "- " + advices.map((advice) => advice.title).join("\n- "),
          },
        })
      }

      return sections
    })

  return [metricsBlocks, advicesBlocks.flat()]
}
