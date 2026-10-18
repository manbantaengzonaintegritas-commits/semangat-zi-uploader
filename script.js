const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzn4fnp2MXVLO4mgBI84F2gZ-449-ghckgE2IEAfK6hlIVRuUy1tA3Mui6Pvex4PIFh/exec';

// Pasang event listener ke SEMUA form dengan class 'upload-form'
document.querySelectorAll('.upload-form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = this.querySelector('input[type="file"]');
    const keteranganInput = this.querySelector('textarea');
    const statusDiv = this.querySelector('.status');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Ambil data kategori dari atribut HTML
    const kategori = this.dataset.kategori;
    const subKategori = this.dataset.sub;
    
    const file = fileInput.files[0];
    const keterangan = keteranganInput.value.trim() || "Tanpa Keterangan";
    
    if (!file) {
      statusDiv.innerText = '⚠️ Silakan pilih file terlebih dahulu!';
      statusDiv.className = 'status error';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      statusDiv.innerText = '⚠️ Ukuran file terlalu besar! Maksimal 10MB.';
      statusDiv.className = 'status error';
      return;
    }

    statusDiv.innerText = '⏳ Sedang mengunggah file...';
    statusDiv.className = 'status loading';
    submitBtn.disabled = true;
    submitBtn.innerText = 'Memproses...';

    const reader = new FileReader();
    reader.onload = function(e) {
      const base64Data = e.target.result.split(',')[1];
      
      const payload = {
        fileName: file.name,
        fileData: base64Data,
        mimeType: file.type,
        kategori: kategori,
        subKategori: subKategori,
        keterangan: keterangan
      };

      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          statusDiv.innerText = '✅ Berhasil disimpan di folder yang sesuai!';
          statusDiv.className = 'status success';
          form.reset(); // Kosongkan form setelah berhasil
        } else {
          statusDiv.innerText = '❌ Gagal: ' + data.message;
          statusDiv.className = 'status error';
        }
      })
      .catch(error => {
        statusDiv.innerText = '❌ Error koneksi: ' + error.message;
        statusDiv.className = 'status error';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = `🚀 Unggah ${subKategori}`;
      });
    };
    
    reader.readAsDataURL(file);
  });
});
