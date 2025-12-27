import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockOCR = async (file) => {
  await mockDelay();
  return {
    data: {
      extractedText: `[MOCK OCR] Extracted text from ${file.name}. This is a simulated OCR result. In production, this would contain the actual text extracted from the PDF.`
    }
  };
};

const mockNLP = async (text) => {
  await mockDelay();
  return {
    data: {
      cleanedText: text.trim(),
      keywords: ['keyword1', 'keyword2', 'keyword3']
    }
  };
};

const mockScoring = async (studentText, referenceText) => {
  await mockDelay();
  const wordsMatch = studentText.toLowerCase().split(/\s+/).filter(w => 
    referenceText.toLowerCase().includes(w)
  ).length;
  const totalWords = studentText.split(/\s+/).length;
  const score = Math.min(20, Math.round((wordsMatch / Math.max(totalWords, 1)) * 20));
  
  return {
    data: {
      score,
      missingPoints: score < 20 ? ['Some key concepts missing', 'Incomplete explanation'] : []
    }
  };
};

const mockFeedback = async (studentId, score, missingPoints, studentText, referenceText) => {
  await mockDelay();
  return {
    data: {
      feedback: `[MOCK FEEDBACK] Score: ${score}/20. ${missingPoints.length > 0 ? 'Missing points: ' + missingPoints.join(', ') : 'Good work!'} This feedback is simulated. In production, it would provide detailed personalized feedback.`
    }
  };
};

export const ocrService = {
  process: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/ocr/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      console.warn('OCR endpoint not available, using mock:', error.message);
      return mockOCR(file);
    }
  }
};

export const nlpService = {
  analyze: async (text) => {
    try {
      const response = await api.post('/nlp/analyze', { text });
      return response;
    } catch (error) {
      console.warn('NLP endpoint not available, using mock:', error.message);
      return mockNLP(text);
    }
  }
};

export const scoringService = {
  evaluate: async (studentText, referenceText) => {
    try {
      const response = await api.post('/scoring/evaluate', {
        studentText,
        referenceText
      });
      return response;
    } catch (error) {
      console.warn('Scoring endpoint not available, using mock:', error.message);
      return mockScoring(studentText, referenceText);
    }
  }
};

export const feedbackService = {
  generate: async (studentId, score, missingPoints, studentText, referenceText) => {
    try {
      const response = await api.post('/feedback/generate', {
        studentId,
        score,
        missingPoints,
        studentText,
        referenceText
      });
      return response;
    } catch (error) {
      console.warn('Feedback endpoint not available, using mock:', error.message);
      return mockFeedback(studentId, score, missingPoints, studentText, referenceText);
    }
  }
};
