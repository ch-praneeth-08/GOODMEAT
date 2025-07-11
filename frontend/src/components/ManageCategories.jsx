import React, { useState, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Disclosure, Dialog, Transition } from '@headlessui/react';
import { MdEdit, MdDelete, MdAdd, MdExpandMore } from 'react-icons/md';
import ImageUpload from './ImageUpload';
import './ManageCategories.css';

// Modal component with corrected size logic
function Modal({ isOpen, onClose, title, children, size = 'default' }) {
  return ReactDOM.createPortal(
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="dialog-container" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="modal-overlay" />
        </Transition.Child>
        <div className="dialog-wrapper">
          <div className="dialog-flex-container">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              {/* --- FIX: Correctly applies the 'small' class --- */}
              <Dialog.Panel className={`modal-content ${size === 'small' ? 'small' : ''}`}>
                <Dialog.Title as="h2">{title}</Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>,
    document.getElementById('portal-root')
  );
}

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    axios.get('http://localhost:5000/categories/', { withCredentials: true })
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories!", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const openCategoryModal = (mode, category = null) => {
    setModalMode(mode);
    setCurrentCategory(category || { name: '', description: '', image: '' });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryFormChange = (e) => {
    setCurrentCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const url = modalMode === 'add' 
      ? 'http://localhost:5000/categories/add' 
      : `http://localhost:5000/categories/update/${currentCategory._id}`;
    
    axios.post(url, currentCategory, { withCredentials: true })
      .then(() => {
        showToast(`Category ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
        fetchCategories();
        setIsCategoryModalOpen(false);
      })
      .catch(err => showToast(err.response?.data?.message || 'An error occurred.'));
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure? This will also delete ALL sub-categories within it. This action is irreversible.')) {
      axios.delete(`http://localhost:5000/categories/${categoryId}`, { withCredentials: true })
        .then(() => {
          showToast('Category deleted successfully!');
          fetchCategories();
        })
        .catch(err => showToast('Error deleting category.'));
    }
  };

  const openSubCategoryModal = (mode, subCategory = null, parentCategoryId) => {
    setModalMode(mode);
    setCurrentSubCategory(subCategory || { name: '', image: '', parentCategory: parentCategoryId });
    setIsSubCategoryModalOpen(true);
  };
  
  const handleSubCategoryFormChange = (e) => {
    setCurrentSubCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubCategorySubmit = (e) => {
    e.preventDefault();
    const url = modalMode === 'add'
      ? 'http://localhost:5000/subcategories/add'
      : `http://localhost:5000/subcategories/update/${currentSubCategory._id}`;
      
    const payload = modalMode === 'add'
      ? { ...currentSubCategory, parentCategoryId: currentSubCategory.parentCategory }
      : currentSubCategory;

    axios.post(url, payload, { withCredentials: true })
      .then(() => {
        showToast(`Sub-category ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
        fetchCategories();
        setIsSubCategoryModalOpen(false);
      })
      .catch(err => showToast(err.response?.data?.message || 'An error occurred.'));
  };

  const handleDeleteSubCategory = (subCategoryId) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      axios.delete(`http://localhost:5000/subcategories/${subCategoryId}`, { withCredentials: true })
        .then(() => {
          showToast('Sub-category deleted successfully!');
          fetchCategories();
        })
        .catch(err => showToast('Error deleting sub-category.'));
    }
  };

  return (
    <div className="manage-categories-container">
      {message && <div className="admin-message-toast">{message}</div>}
      <div className="manage-categories-header">
        <h2 className="manage-categories-title">Manage Categories & Sub-Categories</h2>
        <button className="btn btn--primary" onClick={() => openCategoryModal('add')}>
          <MdAdd /> Add New Category
        </button>
      </div>
      <div className="category-accordion-list">
        {loading && <p>Loading categories...</p>}
        {!loading && categories.map((cat) => (
          <Disclosure key={cat._id} as="div" className="category-accordion-item">
            {({ open }) => (
              <>
                <Disclosure.Button className="category-accordion-button">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <MdExpandMore className="disclosure-icon" />
                    <span className="category-name">{cat.name}</span>
                    <span className="sub-count">{cat.subCategories.length} sub-categories</span>
                  </div>
                  <div className="category-actions">
                    <button className="btn-icon-action" title="Edit Category" onClick={(e) => { e.stopPropagation(); openCategoryModal('edit', cat); }}><MdEdit /></button>
                    <button className="btn-icon-action" title="Delete Category" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }}><MdDelete /></button>
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="category-accordion-panel">
                  {cat.subCategories.length > 0 ? (
                    <div className="subcategory-list">
                      {cat.subCategories.map((sub) => (
                        <div key={sub._id} className="subcategory-item">
                          <img src={sub.image} alt={sub.name} />
                          <p>{sub.name}</p>
                          <div className="subcategory-actions">
                             <button className="btn-icon-action" title="Edit Sub-Category" onClick={() => openSubCategoryModal('edit', sub)}><MdEdit /></button>
                             <button className="btn-icon-action" title="Delete Sub-Category" onClick={() => handleDeleteSubCategory(sub._id)}><MdDelete /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="no-items-message">No sub-categories yet.</p>}
                  <div className="btn-add-subcategory">
                    <button className="btn btn--secondary btn--small-action" onClick={() => openSubCategoryModal('add', null, cat._id)}>
                      <MdAdd /> Add Sub-Category to {cat.name}
                    </button>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={`${modalMode === 'add' ? 'Add New' : 'Edit'} Category`}>
        <form onSubmit={handleCategorySubmit}>
            <div className="form-group">
                <label>Category Name</label>
                <input type="text" name="name" value={currentCategory?.name || ''} onChange={handleCategoryFormChange} required />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows="3" value={currentCategory?.description || ''} onChange={handleCategoryFormChange}></textarea>
            </div>
            <ImageUpload label="Category Image" onUpload={(url) => setCurrentCategory(p => ({...p, image: url}))} value={currentCategory?.image} />
            <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Changes</button>
            </div>
        </form>
      </Modal>
      <Modal isOpen={isSubCategoryModalOpen} onClose={() => setIsSubCategoryModalOpen(false)} title={`${modalMode === 'add' ? 'Add New' : 'Edit'} Sub-Category`} size="small">
         <form onSubmit={handleSubCategorySubmit}>
            <div className="form-group">
                <label>Sub-Category Name</label>
                <input type="text" name="name" value={currentSubCategory?.name || ''} onChange={handleSubCategoryFormChange} required />
            </div>
             <ImageUpload label="Sub-Category Image" onUpload={(url) => setCurrentSubCategory(p => ({...p, image: url}))} value={currentSubCategory?.image} />
            <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setIsSubCategoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Changes</button>
            </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManageCategories;