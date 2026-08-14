const fs = require('fs');

async function uploadImage() {
  const fileBuffer = fs.readFileSync('c:/Users/Admin/Documents/VS code/AHEFSS/ahefss/public/assets/logo.jpg');
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('file', blob, 'logo.jpg');
  formData.append('upload_preset', 'ahefss_uploads');

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/q9jb9wvk/image/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadImage();
