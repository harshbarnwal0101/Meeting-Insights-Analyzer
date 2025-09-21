interface Scores {
  pitchScore: number;
  conversionScore: number;
  rapportScore: number;
  objectionScore: number;
  closingScore: number;
}

/**
 * Computes the overall score from individual scores based on a defined weighting.
 * This is a sample implementation and can be adjusted to match business logic.
 * @param scores - An object containing the individual scores.
 * @returns The computed overall score.
 */
export function computeOverall(scores: Scores): number {
  // Example weighting: Conversion and Closing are most important.
  const weights = {
    pitchScore: 0.15,
    conversionScore: 0.25,
    rapportScore: 0.15,
    objectionScore: 0.2,
    closingScore: 0.25,
  };

  const overall = (
    scores.pitchScore * weights.pitchScore +
    scores.conversionScore * weights.conversionScore +
    scores.rapportScore * weights.rapportScore +
    scores.objectionScore * weights.objectionScore +
    scores.closingScore * weights.closingScore
  );

  return Math.round(overall);
}
