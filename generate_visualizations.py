"""
Script to generate key visualizations for the README
"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# Load the data
print("Loading data...")
path = './data/sample30/sample30.csv'
df = pd.read_csv(path)

# Set style
plt.style.use('default')
sns.set_palette("husl")
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 11

# =============================================================================
# VISUALIZATION 1: Sentiment Distribution (Pie Chart)
# =============================================================================
print("Generating Visualization 1: Sentiment Distribution...")
plt.figure(figsize=(10, 8))
sentiment_counts = df['user_sentiment'].value_counts()
colors = ['#4CAF50', '#F44336']  # Green for positive, Red for negative
wedges, texts, autotexts = plt.pie(sentiment_counts.values, 
                                    labels=sentiment_counts.index,
                                    autopct='%1.1f%%',
                                    colors=colors,
                                    startangle=90,
                                    explode=(0.05, 0.05),
                                    shadow=True)
plt.title('Sentiment Distribution in Product Reviews', fontsize=16, fontweight='bold', pad=20)
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('bold')
    autotext.set_fontsize(14)
for text in texts:
    text.set_fontsize(12)
    text.set_fontweight('bold')
plt.savefig('images/01_sentiment_distribution.png', dpi=300, bbox_inches='tight')
plt.close()

# =============================================================================
# VISUALIZATION 2: Rating Distribution (Bar Chart)
# =============================================================================
print("Generating Visualization 2: Rating Distribution...")
plt.figure(figsize=(10, 7))
rating_counts = df['reviews_rating'].value_counts().sort_index()
bars = plt.bar(rating_counts.index, rating_counts.values, 
               color='skyblue', alpha=0.7, edgecolor='black', linewidth=1.5)
plt.title('Distribution of Product Ratings', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Rating (1-5 stars)', fontsize=12, fontweight='bold')
plt.ylabel('Number of Reviews', fontsize=12, fontweight='bold')
plt.xticks(range(1, 6))
plt.grid(axis='y', alpha=0.3, linestyle='--')

# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 200,
            f'{int(height):,}', ha='center', va='bottom', fontweight='bold')
    
plt.savefig('images/02_rating_distribution.png', dpi=300, bbox_inches='tight')
plt.close()

# =============================================================================
# VISUALIZATION 3: Review Length by Sentiment
# =============================================================================
print("Generating Visualization 3: Review Length by Sentiment...")
df['review_length'] = df['reviews_text'].str.len()
df_clean_viz = df[df['review_length'] <= 1000]  # Remove outliers for better visualization

plt.figure(figsize=(12, 6))
# Split by sentiment
positive_lengths = df_clean_viz[df_clean_viz['user_sentiment'] == 'Positive']['review_length']
negative_lengths = df_clean_viz[df_clean_viz['user_sentiment'] == 'Negative']['review_length']

# Create histogram
plt.hist(positive_lengths, bins=50, alpha=0.6, label='Positive', color='green', edgecolor='black')
plt.hist(negative_lengths, bins=50, alpha=0.6, label='Negative', color='red', edgecolor='black')

plt.title('Review Length Distribution by Sentiment', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Review Length (characters)', fontsize=12, fontweight='bold')
plt.ylabel('Frequency', fontsize=12, fontweight='bold')
plt.legend(fontsize=11, framealpha=0.9)
plt.grid(alpha=0.3, linestyle='--')

plt.savefig('images/03_review_length_by_sentiment.png', dpi=300, bbox_inches='tight')
plt.close()

# =============================================================================
# VISUALIZATION 4: Model Performance Comparison
# =============================================================================
print("Generating Visualization 4: Model Performance Comparison...")
# Simulate model results based on notebook output
model_results = {
    'Model': ['SVM', 'Random Forest', 'Gradient Boosting', 'Naive Bayes', 'Logistic Regression'],
    'F1-Score': [0.9299, 0.9052, 0.8835, 0.8547, 0.8751],
    'Accuracy': [0.8811, 0.8356, 0.8081, 0.7608, 0.7961],
    'Training Time (s)': [1226, 922, 387, 3, 28]
}
df_models = pd.DataFrame(model_results)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# F1-Score comparison
colors_bar = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
bars1 = ax1.bar(range(len(df_models)), df_models['F1-Score'], 
                color=colors_bar, alpha=0.8, edgecolor='black', linewidth=1.5)
ax1.set_title('Model F1-Score Comparison', fontsize=14, fontweight='bold')
ax1.set_xlabel('Models', fontsize=12, fontweight='bold')
ax1.set_ylabel('F1-Score', fontsize=12, fontweight='bold')
ax1.set_xticks(range(len(df_models)))
ax1.set_xticklabels(df_models['Model'], rotation=45, ha='right')
ax1.set_ylim(0.7, 1.0)
ax1.grid(axis='y', alpha=0.3, linestyle='--')

for i, bar in enumerate(bars1):
    height = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2., height + 0.005,
            f'{height:.4f}', ha='center', va='bottom', fontweight='bold')

# Training time comparison
bars2 = ax2.bar(range(len(df_models)), df_models['Training Time (s)'], 
                color=colors_bar, alpha=0.8, edgecolor='black', linewidth=1.5)
ax2.set_title('Model Training Time Comparison', fontsize=14, fontweight='bold')
ax2.set_xlabel('Models', fontsize=12, fontweight='bold')
ax2.set_ylabel('Training Time (seconds)', fontsize=12, fontweight='bold')
ax2.set_xticks(range(len(df_models)))
ax2.set_xticklabels(df_models['Model'], rotation=45, ha='right')
ax2.set_yscale('log')
ax2.grid(axis='y', alpha=0.3, linestyle='--')

for i, bar in enumerate(bars2):
    height = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2., height,
            f'{int(height)}s', ha='center', va='bottom', fontweight='bold')

plt.tight_layout()
plt.savefig('images/04_model_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# =============================================================================
# VISUALIZATION 5: Top 10 Brands (Bonus)
# =============================================================================
print("Generating Visualization 5: Top 10 Brands...")
plt.figure(figsize=(12, 7))
top_brands = df['brand'].value_counts().head(10)
colors_brands = plt.cm.Set3(range(len(top_brands)))
bars = plt.barh(range(len(top_brands)), top_brands.values, 
               color=colors_brands, alpha=0.8, edgecolor='black', linewidth=1)
plt.title('Top 10 Brands by Review Count', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Number of Reviews', fontsize=12, fontweight='bold')
plt.ylabel('Brand', fontsize=12, fontweight='bold')
plt.yticks(range(len(top_brands)), top_brands.index)
plt.gca().invert_yaxis()
plt.grid(axis='x', alpha=0.3, linestyle='--')

# Add value labels
for i, bar in enumerate(bars):
    width = bar.get_width()
    plt.text(width + 50, bar.get_y() + bar.get_height()/2,
            f'{int(width):,}', ha='left', va='center', fontweight='bold')

plt.savefig('images/05_top_brands.png', dpi=300, bbox_inches='tight')
plt.close()

# =============================================================================
# VISUALIZATION 6: Rating vs Sentiment Heatmap
# =============================================================================
print("Generating Visualization 6: Rating vs Sentiment...")
plt.figure(figsize=(10, 8))
rating_sentiment = pd.crosstab(df['reviews_rating'], df['user_sentiment'])
sns.heatmap(rating_sentiment, annot=True, fmt='d', cmap='Blues', 
            cbar_kws={'label': 'Count'}, linewidths=1, linecolor='gray')
plt.title('Rating vs Sentiment Cross-tabulation', fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Sentiment', fontsize=12, fontweight='bold')
plt.ylabel('Rating', fontsize=12, fontweight='bold')
plt.xticks(rotation=0)
plt.yticks(rotation=0)
plt.savefig('images/06_rating_sentiment_heatmap.png', dpi=300, bbox_inches='tight')
plt.close()

print("\n✅ All visualizations generated successfully!")
print(f"📁 Images saved in: {os.path.abspath('images')}")
print("\nGenerated files:")
for i in range(1, 7):
    filename = f"images/{i:02d}_*.png"
    print(f"  - {filename.replace('*.png', '...png')}")

