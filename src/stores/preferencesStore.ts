import { Storage } from '../utils/storage'

const LAST_REVIEW_KEY = 'lastReviewPromptAt'

export async function getLastReviewPrompt(): Promise<number | null> {
  try {
    const v = await Storage.get(LAST_REVIEW_KEY)
    if (!v) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch (e) {
    console.error('preferencesStore.getLastReviewPrompt error', e)
    return null
  }
}

export async function setLastReviewPrompt(timestamp: number): Promise<void> {
  try {
    await Storage.set(LAST_REVIEW_KEY, String(timestamp))
  } catch (e) {
    console.error('preferencesStore.setLastReviewPrompt error', e)
  }
}

export async function shouldShowReviewPrompt(days = 5): Promise<boolean> {
    console.log("Checking if review prompt should be shown")
  try {
    const last = await getLastReviewPrompt()
    if (!last) return true
    const msSince = Date.now() - last
    const threshold = days * 24 * 60 * 60 * 1000
    console.log(msSince >= threshold);
    return msSince >= threshold
  } catch (e) {
    console.error('preferencesStore.shouldShowReviewPrompt error', e)
    return true
  }
}

export default {
  getLastReviewPrompt,
  setLastReviewPrompt,
  shouldShowReviewPrompt
}
