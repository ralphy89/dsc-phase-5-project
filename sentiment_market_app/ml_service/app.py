from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import numpy as np
import joblib
import os
from utils.preprocess import clean_text, preprocess_text, combine_text_features
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from scipy.sparse import hstack, csr_matrix
import re
import pandas as pd
app = FastAPI(title="Sentiment ML Service")

model = None
vectorizer = None
product_reviews = None
product_scores = None
tfidf = None
tfidf_matrix = None
cosine_sim = None

def try_load_models():
    global model, vectorizer, product_reviews, product_scores, tfidf, tfidf_matrix, cosine_sim
    
    model_path = os.path.join("model", "random_forest_pipeline.pkl")
    recom_path = os.path.join("model", "hybrid_recommender.pkl")
    
    print(f"=== LOADING MODELS ===")
    print(f"Model path: {model_path} - Exists: {os.path.exists(model_path)}")
    print(f"Recommender path: {recom_path} - Exists: {os.path.exists(recom_path)}")
    
    if os.path.exists(model_path) and os.path.exists(recom_path):
        try:
            print("Loading model...")
            model = joblib.load(model_path)
            print(f"Model loaded: {type(model)}")
            model_artifacts = joblib.load(model_path)
           
            # Le vectorizer est inclus dans le pipeline ML
            # On peut l'extraire du pipeline si nécessaire
            if hasattr(model, 'named_steps') and 'tfidf' in model.named_steps:
                vectorizer = model.named_steps['tfidf']
                print(f"Vectorizer extracted from pipeline: {type(vectorizer)}")
            else:
                vectorizer = None
                print("⚠️ Vectorizer not found in pipeline")
            
            print("Loading recommender data...")
            data = joblib.load(recom_path)
            product_reviews = data["product_reviews"]
            product_scores = data["product_scores"]
            tfidf = data["tfidf"]
            tfidf_matrix = data["tfidf_matrix"]
            cosine_sim = data["cosine_sim"]
            print("✅ All models loaded successfully!")
            
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            model, vectorizer = None, None
    else:
        print("❌ Model files not found")
        model, vectorizer = None, None


try_load_models()


# --- Recommendation artifacts (TF-IDF based) ---
rec_vec_main = None
rec_vec_meta = None
rec_df = None
rec_X_final = None
rec_X_combined_cols = 0


class ReviewInput(BaseModel):
    text: str
    brand: Optional[str] = ""
    categories: Optional[str] = ""
    title: Optional[str] = ""


@app.post("/predict")
def predict(data: ReviewInput):
    print(f"=== PREDICTION REQUEST ===")
    print(f"Input data: {data}")
    
    # Combine all text features like in the notebook
    combined_text = combine_text_features(
        brand=data.brand or "",
        categories=data.categories or "",
        title=data.title or "",
        text=data.text or ""
    )
    print(f"Combined text: {combined_text}")
    
    # Use advanced preprocessing from notebook
    processed_text = preprocess_text(combined_text)
    print(f"Processed text: {processed_text}")
    
    print(f"Model is None: {model is None}")
    
    if model is not None:
        print("✅ Model loaded, attempting prediction...")
        try:
            # Le pipeline ML contient déjà le vectorizer et le modèle
            prediction = model.predict([processed_text])[0]
            proba = model.predict_proba([processed_text])[0]
            
            # Gérer les différents formats de prédiction
            if isinstance(prediction, str):
                sentiment = "positive" if prediction == "Positive" else "negative"
            else:
                sentiment = "positive" if prediction == 1 else "negative"
            
            confidence = float(np.max(proba))
            print(f"✅ Prediction: {sentiment}, Confidence: {confidence}")
            return {"sentiment": sentiment, "confidence": round(confidence, 3)}
        except Exception as e:
            print(f"❌ Model prediction error: {e}")
            # Fallback to keyword-based approach
            pass
    else:
        print("❌ Model not loaded properly")

    # Fallback: keyword-based sentiment analysis
    print("🔄 Using fallback keyword analysis...")
    cleaned = processed_text.lower()
    positive_keywords = ["good", "great", "love", "excellent", "amazing", "fantastic", "happy", "wonderful", "perfect", "awesome", "brilliant", "outstanding"]
    negative_keywords = ["bad", "terrible", "hate", "awful", "poor", "sad", "disappointed", "worst", "horrible", "disgusting", "useless", "waste"]

    score = 0
    for w in positive_keywords:
        if w in cleaned:
            score += 1
    for w in negative_keywords:
        if w in cleaned:
            score -= 1

    if score > 0:
        print(f"✅ Fallback positive: score={score}")
        return {"sentiment": "positive", "confidence": 0.6}
    elif score < 0:
        print(f"✅ Fallback negative: score={score}")
        return {"sentiment": "negative", "confidence": 0.6}
    else:
        print(f"✅ Fallback neutral: score={score}")
        return {"sentiment": "neutral", "confidence": 0.5}

# la fonction de recommandation ---
def recommend(product_id, top_n=5, alpha=0.7):
    idx = product_reviews[product_reviews['id'] == product_id].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:]

    similar_df = pd.DataFrame({
        'id': product_reviews.iloc[[i[0] for i in sim_scores]]['id'].values,
        'similarity': [i[1] for i in sim_scores]
    }).merge(product_scores, on='id', how='left')

    similar_df['hybrid_score'] = alpha * similar_df['similarity'] + (1 - alpha) * similar_df['avg_sentiment']

    return similar_df.sort_values('hybrid_score', ascending=False).head(top_n)

@app.get("/recommend/{product_id}")
def get_recommendations(product_id: str, top_n: int = 5, alpha: float = 0.7):
    try:
        recommendations = recommend(product_id, top_n, alpha)
        return {"product_id": product_id, "recommendations": recommendations.to_dict(orient="records")}
    except Exception as e:
        return {"error": str(e)}
    
def pd_is_na(v):
    try:
        # Handle pandas/NumPy NA types without importing pandas here
        return v is None or (hasattr(v, "__class__") and v != v)  # NaN check (NaN != NaN)
    except Exception:
        return v is None

# Railway deployment
if __name__ == "__main__":
    import uvicorn
    import os
    import sys
    
    # Get port from environment or use default
    port_str = os.environ.get("PORT", "8001")
    try:
        port = int(port_str)
    except ValueError:
        print(f"Invalid PORT value: {port_str}, using default 8001")
        port = 8001
    
    print(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)