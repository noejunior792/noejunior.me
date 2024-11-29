import { readdirSync } from 'fs';
import { join } from 'path';

export function getGalleryImages() {
  try {
    const galleryPath = join(process.cwd(), 'public', 'images', 'gallery');
    return readdirSync(galleryPath).filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
  } catch (error) {
    console.error('Error reading gallery directory:', error);
    return [];
  }
}