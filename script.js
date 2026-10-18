// URL Web App Google Apps Script Anda
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzn4fnp2MXVLO4mgBI84F2gZ-449-ghckgE2IEAfK6hlIVRuUy1tA3Mui6Pvex4PIFh/exec';

document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const statusDiv = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');
  
  if (!file) {
    statusDiv.innerText = '⚠️ Silakan pilih file terlebih dahulu!';
    statusDiv.style.color = '#DC2626';
    statusDiv.style.backgroundColor = '#FEE2E2';
    return;
  }

  // Batasan ukuran file (Maksimal 10MB agar stabil di Google Apps Script)
  if (file.size > 10 * 1024 * 1024) {
    statusDiv.innerText = '⚠️ Ukuran file terlalu besar! Maksimal 10MB.';
    statusDiv.style.color = '#DC2626';
    statusDiv.style.backgroundColor = '#FEE2E2';
    return;
  }

  // Ubah tampilan saat proses upload
  statusDiv.innerText = '⏳ Sedang mengunggah file...';
  statusDiv.style.color = '#1E3A8A';
  statusDiv.style.backgroundColor = '#DBEAFE';
  submitBtn.disabled = true;
  submitBtn.innerText = 'Memproses...';

  const reader = new FileReader();
  reader.onload = function(e) {
    // Ambil data base64 murni (tanpa prefix "data:application/pdf;base64,")
    const base64Data = e.target.result.split(',')[1];
    
    const payload = {
      // Nama file akan diawali "Semangat ZI - " agar rapi
      fileName: "Semangat ZI - " + file.name,
      fileData: base64Data,
      mimeType: file.type
    };

    // Kirim ke Google Apps Script
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Penting untuk menghindari error CORS
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        statusDiv.innerText = '✅ Berhasil: "' + data.fileName + '" telah disimpan!';
        statusDiv.style.color = '#065F46';
        statusDiv.style.backgroundColor = '#D1FAE5';
        document.getElementById('uploadForm').reset();
      } else {
        statusDiv.innerText = '❌ Gagal: ' + data.message;
        statusDiv.style.color = '#DC2626';
        statusDiv.style.backgroundColor = '#FEE2E2';
      }
    })
    .catch(error => {
      statusDiv.innerText = '❌ Error koneksi: ' + error.message;
      statusDiv.style.color = '#DC2626';
      statusDiv.style.backgroundColor = '#FEE2E2';
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = '🚀 Unggah File';
    });
  };
  
  reader.readAsDataURL(file);
});
