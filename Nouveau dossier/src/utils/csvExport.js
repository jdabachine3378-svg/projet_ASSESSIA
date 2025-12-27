export const exportToCSV = (data, filename = 'report.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['Nom', 'Prénom', 'Score', 'Status', 'Date'];
  const rows = data.map(row => [
    row.nom || '',
    row.prenom || '',
    row.score !== undefined ? row.score : '',
    row.status || '',
    row.date ? new Date(row.date).toLocaleString() : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
