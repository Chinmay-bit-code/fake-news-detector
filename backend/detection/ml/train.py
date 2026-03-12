"""
Train a TF-IDF + Logistic Regression model for fake news detection.
Run this script to regenerate the model:
    python -c "from detection.ml.train import train_model; train_model()"

For production accuracy, replace TRAINING_DATA with a real dataset
such as: https://www.kaggle.com/c/fake-news/data
"""
import pickle
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fake_news_model.pkl')

# ── Sample training corpus (label 0=REAL, 1=FAKE) ─────────────────────────────
# Replace this with a full dataset CSV for production.
TRAINING_DATA = [
    # ── REAL news examples ────────────────────────────────────────────────────
    ("Scientists develop new vaccine showing 94% efficacy in Phase 3 clinical trials published in peer reviewed journal", 0),
    ("Federal Reserve raises interest rates by 25 basis points amid inflation concerns economic analysts say", 0),
    ("New study published in Nature links regular physical activity to reduced risk of cardiovascular disease", 0),
    ("Parliament votes 312 to 201 to pass new environmental protection legislation limiting carbon emissions", 0),
    ("SpaceX successfully launches Starlink communication satellite into low earth orbit from Kennedy Space Center", 0),
    ("WHO reports 40 percent decline in malaria cases globally due to improved mosquito net distribution programs", 0),
    ("Stock market closes higher after positive jobs report shows unemployment fell to 3.7 percent in October", 0),
    ("University researchers publish peer reviewed findings on accelerating ice melt in arctic regions due to warming", 0),
    ("Government announces 2 trillion dollar infrastructure spending plan to repair roads bridges and electrical grid", 0),
    ("International peace negotiations between two nations yield historic ceasefire agreement after months of talks", 0),
    ("Apple reports quarterly earnings of 90 billion dollars exceeding Wall Street analyst expectations for the period", 0),
    ("Medical researchers identify new genetic biomarker linked to increased cancer risk in European population study", 0),
    ("Central bank maintains current monetary policy interest rates amid global inflation concerns according to statement", 0),
    ("New bipartisan infrastructure bill allocates 550 billion dollars for road and bridge repairs across the country", 0),
    ("Scientists confirm average ocean surface temperature has risen 1.5 degrees Celsius over past century of records", 0),
    ("Olympic committee selects Paris as host city for upcoming summer games after competitive bidding process", 0),
    ("Study by Stanford researchers shows renewable energy costs have dropped 90 percent in the past decade globally", 0),
    ("Health department issues updated guidelines recommending annual flu vaccination for all adults over 65 years", 0),
    ("Trade negotiations between the US and EU conclude with new agreement reducing tariffs on agricultural products", 0),
    ("Astronomers at NASA discover exoplanet in habitable zone of nearby star system using James Webb telescope data", 0),
    ("Local government passes new zoning law to increase affordable housing construction in urban residential areas", 0),
    ("Scientists develop new biodegradable plastic material that breaks down within weeks in normal soil conditions", 0),
    ("Survey of 10000 adults reveals growing concern about rising cost of healthcare among middle income families", 0),
    ("Electric vehicle sales surpass 10 million units globally for the first time in automotive industry history report", 0),
    ("Judge rules corporation must pay 4 billion dollar settlement to victims of industrial pollution contamination case", 0),
    ("New mental health legislation requires insurance companies to provide equal coverage for psychiatric treatment", 0),
    ("Scientists successfully sequence genome of ancient woolly mammoth opening possibilities for de-extinction research", 0),
    ("City announces new public transit expansion adding 50 miles of subway lines by 2028 to reduce car traffic", 0),
    ("Research shows meditation and mindfulness practices can reduce chronic stress levels by up to 38 percent", 0),
    ("Tech company lays off 10000 workers amid economic slowdown as demand for consumer electronics falls sharply", 0),

    # ── FAKE news examples ────────────────────────────────────────────────────
    ("SHOCKING government is secretly hiding alien bodies at classified area 51 facility whistleblower insider reveals all truth", 1),
    ("BREAKING landmark suppressed study proves vaccines cause autism Big Pharma paying scientists to hide the devastating evidence", 1),
    ("EXPOSED the moon landing was completely staged by NASA actors in a Hollywood studio the footage proves everything", 1),
    ("SECRET 5G towers are actually mind control devices deployed by global elites to control the world population behavior", 1),
    ("BOMBSHELL chemtrails contain dangerous population control chemicals that government has officially admitted to spraying on citizens", 1),
    ("REVEALED mainstream media is completely controlled by shadow government elites who decide what news you are allowed to see", 1),
    ("URGENT microchips are being inserted into the population through drinking water supply to track every movement secretly", 1),
    ("TRUTH the earth is actually flat and all scientists and astronauts are paid actors hired to lie to public", 1),
    ("EXPOSED all major disasters use paid crisis actors there are no real victims everything you see on TV is staged", 1),
    ("SHOCKING billionaire elites have signed secret treaty to reduce world population by 90 percent within next decade plan", 1),
    ("BREAKING miracle cancer cure discovered but is being suppressed by pharmaceutical companies to protect drug profits forever", 1),
    ("REVEALED elections are completely rigged with no real votes being counted the results are decided weeks in advance", 1),
    ("SECRET CURE drinking diluted bleach kills all viruses including cancer doctors do not want you knowing this treatment", 1),
    ("EXPOSED birds are not real they are government surveillance drones the bird watching community is in on the conspiracy", 1),
    ("SHOCKING TRUTH dinosaurs never existed fossils were fabricated by scientists museums and universities in massive century old hoax", 1),
    ("BREAKING new world order plan to eliminate all physical cash and implement global digital currency to control everyone", 1),
    ("BOMBSHELL climate change is completely made up hoax invented by globalist elites to raise taxes and control energy", 1),
    ("TRUTH REVEALED all celebrities and politicians are shape-shifting reptilian aliens living among us in disguise for centuries", 1),
    ("EXPOSED social media companies can read your thoughts using microwave radiation emitted from your smartphone at night", 1),
    ("SECRET TREATY all world governments have secretly signed deal to create one world government by 2030 with no nations", 1),
    ("SHOCKING the government puts fluoride in water to make population docile and obedient to authority cannot think clearly", 1),
    ("REVEALED covid was engineered in lab and released deliberately to install microchips in vaccines and control humanity", 1),
    ("BOMBSHELL george soros paying millions to fund antifa crisis actors in every city to start revolution against patriots", 1),
    ("EXPOSED NASA fakes all space photos using CGI technology there is no real outer space it is all a dome", 1),
    ("BREAKING secret underground tunnels connect elite mansions used for human trafficking by satanic cabal of politicians worldwide", 1),
    ("TRUTH global warming is a hoax invented by china to destroy american manufacturing sector and gain economic advantage", 1),
    ("SHOCKING doctors are paid by pharmaceutical companies to prescribe dangerous medications and keep patients sick for profit always", 1),
    ("REVEALED sand in arizona is turning magnetic from chemtrails this video proof that government is poisoning everything we touch", 1),
    ("EXPOSED bill gates has been planning world population reduction for decades vaccines are the method to achieve depopulation goals", 1),
    ("BREAKING banks are about to collapse and government will seize all accounts this weekend buy gold and crypto now urgent", 1),
]


def train_model():
    """Train and save the fake news detection model."""
    texts = [item[0] for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=15000,
            ngram_range=(1, 3),
            stop_words='english',
            sublinear_tf=True,
            min_df=1,
        )),
        ('classifier', LogisticRegression(
            max_iter=1000,
            C=1.0,
            random_state=42,
            solver='lbfgs',
        )),
    ])

    pipeline.fit(texts, labels)

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(pipeline, f)

    print(f"✅ Model trained and saved to {MODEL_PATH}")
    return pipeline


if __name__ == '__main__':
    train_model()
