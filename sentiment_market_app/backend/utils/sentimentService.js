import axios from "axios";

export const analyzeSentiment = async (text, productInfo = {}) => {
  try {
    const payload = {
      text,
      brand: productInfo.brand || "",
      categories: productInfo.categories || "",
      title: productInfo.title || ""
    };
    
    const response = await axios.post("http://localhost:8001/predict", payload);
    return response.data;
  } catch (error) {
    console.error("Error connecting to ML service:", error.message);
    return { sentiment: "neutral", confidence: 0.0 };
  }
};

export default analyzeSentiment;

