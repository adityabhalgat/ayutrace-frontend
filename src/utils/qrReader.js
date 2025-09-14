import jsQR from 'jsqr';

// Helper function to read QR code content from image file
export const readQRCodeFromImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                try {
                    // Create a canvas to draw the image
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw the image on canvas
                    context.drawImage(img, 0, 0);
                    
                    // Get image data
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    
                    // Decode QR code
                    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (qrCode) {
                        console.log('QR Code decoded successfully:', qrCode.data);
                        resolve(qrCode.data);
                    } else {
                        reject(new Error('No QR code found in the image. Please ensure the QR code is clear and well-lit.'));
                    }
                } catch (error) {
                    console.error('Error decoding QR code:', error);
                    reject(new Error('Failed to decode QR code from image: ' + error.message));
                }
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image. Please ensure you selected a valid image file.'));
            };
            
            // Set image source to the file data
            img.src = event.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file); // Read as data URL for image loading
    });
};