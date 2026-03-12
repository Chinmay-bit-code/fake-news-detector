"""
FakeNewsDetector — loads a saved scikit-learn pipeline.
If no saved model is found it trains one on the bundled sample corpus.
"""
import os
import re
import pickle

from .train import train_model, MODEL_PATH


class FakeNewsDetector:
    def __init__(self):
        self.pipeline = None
        self._load_or_train()

    # ── Setup ─────────────────────────────────────────────────────────────────

    def _load_or_train(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, 'rb') as f:
                    self.pipeline = pickle.load(f)
                print("✅ Fake-news model loaded from disk.")
            except Exception as exc:
                print(f"⚠️  Could not load model ({exc}). Training a fresh one…")
                self.pipeline = train_model()
        else:
            print("ℹ️  No saved model found — training default model…")
            self.pipeline = train_model()

    # ── Preprocessing ─────────────────────────────────────────────────────────

    @staticmethod
    def _preprocess(text: str) -> str:
        text = re.sub(r'https?://\S+', ' ', text)       # strip URLs
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)        # keep letters only
        text = ' '.join(text.lower().split())            # normalise whitespace
        return text

    # ── Prediction ────────────────────────────────────────────────────────────

    def predict(self, text: str) -> dict:
        if not text or not text.strip():
            return {
                'label': 'UNCERTAIN',
                'confidence': 0.0,
                'fake_probability': 50.0,
                'real_probability': 50.0,
            }

        processed = self._preprocess(text)

        if not processed:
            return {
                'label': 'UNCERTAIN',
                'confidence': 50.0,
                'fake_probability': 50.0,
                'real_probability': 50.0,
            }

        prediction = self.pipeline.predict([processed])[0]
        proba = self.pipeline.predict_proba([processed])[0]

        real_prob = round(float(proba[0]) * 100, 2)
        fake_prob = round(float(proba[1]) * 100, 2)
        confidence = round(float(max(proba)) * 100, 2)

        # Use UNCERTAIN bucket when model is not confident
        if confidence < 60:
            label = 'UNCERTAIN'
        elif prediction == 1:
            label = 'FAKE'
        else:
            label = 'REAL'

        return {
            'label': label,
            'confidence': confidence,
            'fake_probability': fake_prob,
            'real_probability': real_prob,
        }


# Singleton — imported by views
detector = FakeNewsDetector()
