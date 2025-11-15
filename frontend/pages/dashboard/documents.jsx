import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FileText, Upload, Download, Trash2, Eye, FolderOpen, File } from 'lucide-react';
import styles from '../../styles/Documents.module.css';

export default function Documents() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Project Requirements.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-15',
      category: 'Requirements'
    },
    {
      id: 2,
      name: 'Design Mockups.fig',
      type: 'Figma',
      size: '15.8 MB',
      uploadedBy: 'Sarah Smith',
      uploadedAt: '2024-01-14',
      category: 'Design'
    },
    {
      id: 3,
      name: 'API Documentation.md',
      type: 'Markdown',
      size: '124 KB',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-13',
      category: 'Documentation'
    },
    {
      id: 4,
      name: 'Sprint Planning.xlsx',
      type: 'Excel',
      size: '890 KB',
      uploadedBy: 'Emily Davis',
      uploadedAt: '2024-01-12',
      category: 'Planning'
    },
    {
      id: 5,
      name: 'User Testing Results.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadedBy: 'Alex Brown',
      uploadedAt: '2024-01-11',
      category: 'Testing'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Requirements', 'Design', 'Documentation', 'Planning', 'Testing'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    alert('Upload feature will be implemented soon!');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Documents - Mobiloitte PMS</title>
      </Head>

      <Header />

      <div className={styles.layout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>Documents</h1>
                <p className={styles.subtitle}>Manage project documents and files</p>
              </div>
              <button className={styles.uploadButton} onClick={handleUpload}>
                <Upload size={20} />
                Upload Document
              </button>
            </div>

            {/* Search and Filter */}
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.filterButtons}>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`${styles.filterBtn} ${filterCategory === category ? styles.active : ''}`}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Grid */}
            <div className={styles.documentsGrid}>
              {filteredDocuments.map(doc => (
                <div key={doc.id} className={styles.documentCard}>
                  <div className={styles.docIcon}>
                    <FileText size={32} />
                  </div>
                  <div className={styles.docInfo}>
                    <h3 className={styles.docName}>{doc.name}</h3>
                    <div className={styles.docMeta}>
                      <span className={styles.docType}>{doc.type}</span>
                      <span className={styles.docSize}>{doc.size}</span>
                    </div>
                    <div className={styles.docDetails}>
                      <span>Uploaded by {doc.uploadedBy}</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                    <span className={`${styles.docCategory} ${styles[doc.category.toLowerCase()]}`}>
                      {doc.category}
                    </span>
                  </div>
                  <div className={styles.docActions}>
                    <button className={styles.actionBtn} title="View">
                      <Eye size={18} />
                    </button>
                    <button className={styles.actionBtn} title="Download">
                      <Download size={18} />
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                      title="Delete"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className={styles.emptyState}>
                <FolderOpen size={64} />
                <h2>No documents found</h2>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}
