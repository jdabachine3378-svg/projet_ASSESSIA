import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';

export const Student = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!nom.trim() && !prenom.trim() && !auth?.email) {
      setError('Veuillez entrer votre nom ou prénom');
      return;
    }

    const report = storage.getReport();
    const searchNom = nom.trim().toLowerCase();
    const searchPrenom = prenom.trim().toLowerCase();
    
    const match = report.find(entry => {
      const nameMatch = searchNom && searchPrenom &&
                       entry.nom?.toLowerCase() === searchNom &&
                       entry.prenom?.toLowerCase() === searchPrenom;
      const fullNameMatch = searchNom && searchPrenom &&
                           `${entry.prenom} ${entry.nom}`.toLowerCase() === `${searchPrenom} ${searchNom}`;
      const singleNameMatch = (searchNom && entry.nom?.toLowerCase() === searchNom) ||
                             (searchPrenom && entry.prenom?.toLowerCase() === searchPrenom);
      
      return nameMatch || fullNameMatch || singleNameMatch;
    });

    if (match) {
      setStudentData({
        nom: match.nom,
        prenom: match.prenom,
        score: match.score,
        status: match.status,
        feedback: match.feedback || 'Aucun feedback disponible',
        date: match.date
      });
      setError('');
    } else {
      setError('Aucun résultat trouvé. Vérifiez vos informations.');
      setStudentData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">AssessAI - Étudiant</h1>
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Rechercher mes résultats</h2>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Rechercher
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          {studentData && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Vos résultats</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Nom:</span> {studentData.prenom} {studentData.nom}
                </div>
                <div>
                  <span className="font-medium">Score:</span>{' '}
                  <span className="text-2xl font-bold text-indigo-600">{studentData.score}/20</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                    studentData.status === 'Réussi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {studentData.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Date d'évaluation:</span>{' '}
                  {new Date(studentData.date).toLocaleString()}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <span className="font-medium">Feedback:</span>
                  <p className="mt-2 text-sm text-gray-700 bg-white p-3 rounded border">
                    {studentData.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!studentData && !error && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center">
                Entrez votre nom et prénom pour voir vos résultats
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
