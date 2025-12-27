import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { ocrService, nlpService, scoringService, feedbackService } from '../services/api';
import { exportToCSV } from '../utils/csvExport';

export const Teacher = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [referenceText, setReferenceText] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [studentId, setStudentId] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);
  const [report, setReport] = useState([]);
  const [activeSection, setActiveSection] = useState('reference');

  useEffect(() => {
    setReferenceText(storage.getReference());
    setReport(storage.getReport());
  }, []);

  const generateStudentId = () => {
    return `STU${Date.now()}`;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError('');
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setFileError('Seuls les fichiers PDF sont acceptés');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSaveReference = () => {
    storage.setReference(referenceText);
    alert('Référence sauvegardée');
  };

  const handleProcess = async () => {
    if (!file) {
      setFileError('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (!referenceText.trim()) {
      alert('Veuillez d\'abord sauvegarder une référence');
      return;
    }

    if (!nom.trim() || !prenom.trim()) {
      alert('Veuillez remplir le nom et le prénom');
      return;
    }

    const finalStudentId = studentId.trim() || generateStudentId();
    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const step1 = await ocrService.process(file);
      const extractedText = step1.data.extractedText;

      const step2 = await nlpService.analyze(extractedText);
      const cleanedText = step2.data.cleanedText;

      const step3 = await scoringService.evaluate(cleanedText, referenceText);
      const score = step3.data.score;
      const missingPoints = step3.data.missingPoints || [];

      const step4 = await feedbackService.generate(
        finalStudentId,
        score,
        missingPoints,
        cleanedText,
        referenceText
      );
      const feedback = step4.data.feedback;

      const result = {
        nom: nom.trim(),
        prenom: prenom.trim(),
        studentId: finalStudentId,
        extractedText,
        cleanedText,
        score,
        missingPoints,
        feedback,
        status: score >= 10 ? 'Réussi' : 'Échec'
      };

      setCurrentResult(result);
      const updatedReport = storage.addToReport({
        nom: result.nom,
        prenom: result.prenom,
        studentId: result.studentId,
        score: result.score,
        status: result.status,
        feedback: result.feedback
      });
      setReport(updatedReport);

      setNom('');
      setPrenom('');
      setStudentId('');
      setFile(null);
      if (document.getElementById('file-input')) {
        document.getElementById('file-input').value = '';
      }
    } catch (err) {
      setError(`Erreur lors du traitement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(report, `rapport_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">AssessAI - Enseignant</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{auth?.email}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveSection('reference')}
            className={`px-4 py-2 font-medium ${
              activeSection === 'reference'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            A. Référence
          </button>
          <button
            onClick={() => setActiveSection('upload')}
            className={`px-4 py-2 font-medium ${
              activeSection === 'upload'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            B. Scanner / Ajouter copie
          </button>
          <button
            onClick={() => setActiveSection('report')}
            className={`px-4 py-2 font-medium ${
              activeSection === 'report'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            C. Rapport
          </button>
        </div>

        {activeSection === 'reference' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Référence / Modèle de correction</h2>
            <textarea
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              className="w-full h-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Collez ici le texte de référence (modèle de correction)..."
            />
            <button
              onClick={handleSaveReference}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sauvegarder la référence
            </button>
          </div>
        )}

        {activeSection === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Scanner / Ajouter une copie</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID (généré automatiquement si vide)
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Laissé vide pour génération automatique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier PDF *
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                {fileError && (
                  <p className="mt-2 text-sm text-red-600">{fileError}</p>
                )}
                {file && !fileError && (
                  <p className="mt-2 text-sm text-green-600">Fichier sélectionné: {file.name}</p>
                )}
              </div>

              <button
                onClick={handleProcess}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  'Scanner & Évaluer'
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {currentResult && (
                <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Résultat</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Étudiant:</span> {currentResult.prenom} {currentResult.nom}
                    </div>
                    <div>
                      <span className="font-medium">Score:</span> {currentResult.score}/20
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {currentResult.status}
                    </div>
                    <div>
                      <span className="font-medium">Texte extrait (aperçu):</span>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                        {currentResult.extractedText.substring(0, 200)}...
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Feedback:</span>
                      <p className="mt-1 text-sm text-gray-700">{currentResult.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'report' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Rapport (table)</h2>
              <button
                onClick={handleExportCSV}
                disabled={report.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Exporter CSV
              </button>
            </div>
            
            {report.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun résultat pour le moment</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.prenom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.score}/20</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entry.status === 'Réussi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
