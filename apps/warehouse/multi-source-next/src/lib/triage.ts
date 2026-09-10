import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const LABELS = ['billing', 'bug report', 'how-to question', 'account access'];

/**
 * Route an inbound ticket to a queue. Zero-shot classification keeps the label
 * set editable without a retrain.
 */
export async function triage(subject: string, body: string) {
  const result = await hf.zeroShotClassification({
    model: 'facebook/bart-large-mnli',
    inputs: `${subject}\n\n${body}`,
    parameters: { candidate_labels: LABELS },
  });
  return { label: result[0]?.labels[0] ?? 'unsorted', scores: result[0]?.scores };
}
