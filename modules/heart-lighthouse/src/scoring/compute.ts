import { Result } from "lighthouse"

export const compute = (categories: Record<string, Result.Category>, fractionDigits?: number): number => {
  const avgScore = computeCategories(categories)

  return normalize(avgScore, fractionDigits)
}

/**
 * Calculate the average score for every categories
 * @param categories LH report categories
 *
 * @returns Average score (between 0 and 1) accross all category
 */
function computeCategories(categories: Record<string, Result.Category>): number {
  const categoriesName = Object.keys(categories)
  const categoriesNameWithScore = categoriesName.filter((categoryName) => null !== categories[categoryName].score)

  if (categoriesName.length > categoriesNameWithScore.length) {
    console.warn(`Some Lighthouse categories does not have a score. Consequently, they will not be taken into account for the computation of the average score.`)
  }

  const sumScores = categoriesNameWithScore.reduce((acc, categoryName) => acc + (categories[categoryName].score as number), 0)

  return sumScores / categoriesName.length
}

/**
 *
 * @param avgScore Score between 0 and 1
 */
function normalize(avgScore: number, fractionDigits?: number): number {
  return parseFloat((100 * avgScore).toFixed(fractionDigits))
}
