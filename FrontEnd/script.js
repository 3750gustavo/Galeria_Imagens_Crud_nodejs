// troque 192.168.0.120 pelo endereco ip onde esta rodando o server
const apiBaseUrl = 'http://192.168.0.120:3000/images';
let currentImageIndex = 0;
let images = [];

$(document).ready(function() {
    loadImages();

    // Abrir imagem ao clicar na thumbnail
    $(document).on('click', '.thumbnail-card', function() {
        currentImageIndex = $(this).data('index');
        showImageViewer();
        $('#galleryModal').modal('hide');
    });

    // Controles do viewer
    $('#prev-btn').click(showPrevImage);
    $('#next-btn').click(showNextImage);
    $('#random-btn').click(showRandomImage);
    $('#close-viewer').click(hideImageViewer);

    // Upload de imagem
    $('#upload-form').submit(function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', $('#image-input')[0].files[0]);

        $('#uploadModal .modal-body').html(`<div class="loading-spinner"></div>`);

        fetch(apiBaseUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Falha no upload');
            return response.text();
        })
        .then(() => {
            $('#uploadModal').modal('hide');
            loadImages();
        })
        .catch(error => {
            $('#uploadModal .modal-body').html(`
                <div class="alert alert-danger">
                    Erro no upload: ${error.message}
                    <button class="btn btn-secondary btn-block mt-2" data-dismiss="modal">Fechar</button>
                </div>
            `);
        });
    });

    // Atualizar label do input de arquivo
    $('#image-input').change(function(e) {
        const fileName = e.target.files[0]?.name || 'Selecione a imagem...';
        $(this).next('.custom-file-label').text(fileName);
    });
});

function loadImages() {
    $('#image-grid').html(`<div class="loading-spinner"></div>`);

    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(data => {
            images = data;
            renderGallery(data);
            if(data.length > 0) {
                currentImageIndex = 0;
                $('#main-image').attr('src', `${apiBaseUrl}/${data[0]}`);
            }
        })
        .catch(error => {
            $('#image-grid').html(`
                <div class="col-12 text-center text-danger">
                    Erro ao carregar imagens: ${error.message}
                </div>
            `);
        });
}

function renderGallery(images) {
    const galleryHtml = images.map((image, index) => `
        <div class="col-md-3 mb-4">
            <div class="card thumbnail-card" data-index="${index}">
                <img src="${apiBaseUrl}/${image}" class="card-img-top thumbnail-img">
                <div class="card-body p-2">
                    <small class="text-muted text-truncate d-block">${image}</small>
                    <button class="btn btn-sm btn-danger btn-block mt-2 delete-btn" data-filename="${image}">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    $('#image-grid').html(galleryHtml);

    // Adicionar handlers para os botões de exclusão
    $('.delete-btn').click(function() {
        const filename = $(this).data('filename');
        if(confirm(`Deseja realmente excluir "${filename}"?`)) {
            fetch(`${apiBaseUrl}/${filename}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Falha ao excluir');
                    loadImages();
                })
                .catch(error => alert(`Erro ao excluir: ${error.message}`));
        }
    });
}

function showImageViewer() {
    $('#image-viewer').show();
    $('#main-image').attr('src', `${apiBaseUrl}/${images[currentImageIndex]}`);
}

function hideImageViewer() {
    $('#image-viewer').hide();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImageViewer();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateImageViewer();
}

function showRandomImage() {
    currentImageIndex = Math.floor(Math.random() * images.length);
    updateImageViewer();
}

function updateImageViewer() {
    $('#main-image').fadeOut(200, () => {
        $('#main-image').attr('src', `${apiBaseUrl}/${images[currentImageIndex]}`).fadeIn(200);
    });
}