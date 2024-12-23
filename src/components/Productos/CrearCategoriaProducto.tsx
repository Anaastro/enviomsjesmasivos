import React, { useState, useEffect } from 'react';
import { addCategory, getCategories, addProduct } from '@/components/Productos/firebaseUtils';

const CrearCategoriaProducto: React.FC = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = getCategories(setCategories);
    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    try {
      await addCategory(categoryName);
      setCategoryName('');
      alert('Categoría agregada exitosamente');
    } catch {
      alert('Error al agregar la categoría');
    }
  };

  const handleAddProduct = async () => {
    if (images.length > 3) {
      alert('Puedes subir un máximo de 3 imágenes.');
      return;
    }

    setUploading(true);
    try {
      await addProduct(selectedCategory, productName, images);
      setProductName('');
      setImages([]);
      setPreviewImages([]);
      alert('Producto agregado exitosamente');
    } catch {
      alert('Error al agregar el producto');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.some(file => file.size > 3 * 1024 * 1024)) {
      alert('Cada imagen no debe pesar más de 3 MB.');
      return;
    }
    setImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Crear Categoría</h2>
        <input
          type="text"
          className="input-field"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Nombre de la Categoría"
        />
        <button className="button-secondary" onClick={handleAddCategory}>Agregar Categoría</button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Crear Producto</h2>
        <select className="input-field" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Seleccione una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <input
          type="text"
          className="input-field"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Nombre del Producto"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          className="input-field"
          onChange={handleImageChange}
        />
        {previewImages.length > 0 && (
          <div className="flex space-x-4 mb-4">
            {previewImages.map((src, index) => (
              <img key={index} src={src} alt={`preview-${index}`} className="w-24 h-24 object-cover rounded-md" />
            ))}
          </div>
        )}
        <button className={`button-primary ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleAddProduct} disabled={uploading}>
          {uploading ? 'Subiendo...' : 'Agregar Producto'}
        </button>
      </div>
    </div>
  );
};

export default CrearCategoriaProducto;
