import json
import os

assets = [
    ('src/assets/icons/nav-inicio.png', 'nav-inicio.png'),
    ('src/assets/icons/nav-pokemon.png', 'nav-pokemon.png'),
    ('src/assets/icons/nav-mochila.png', 'nav-mochila.png'),
    ('src/assets/icons/nav-batalha.png', 'nav-batalha.png'),
    ('src/assets/icons/nav-melhorias.png', 'nav-melhorias.png'),
    ('src/assets/icons/nav-colecao.png', 'nav-colecao.png'),
    ('src/assets/icons/nav-loja.png', 'nav-loja.png'),
    ('src/assets/icons/nav-wallet.png', 'nav-wallet.png'),
    ('src/assets/icons/nav-market.png', 'nav-market.png'),
    ('src/assets/items/icon-pokeball.png', 'icon-pokeball.png'),
    ('src/assets/items/icon-greatball.png', 'icon-greatball.png'),
    ('src/assets/items/icon-ultraball.png', 'icon-ultraball.png'),
    ('src/assets/items/icon-potion.png', 'icon-potion.png'),
    ('src/assets/items/icon-revive.png', 'icon-revive.png'),
    ('src/assets/items/icon-berry.png', 'icon-berry.png'),
    ('src/assets/items/icon-key.png', 'icon-key.png'),
    ('src/assets/icon-fragment-crystal.png', 'icon-fragment-crystal.png'),
    ('src/assets/icon-world-globe-v2.png', 'icon-world-globe-v2.png'),
    ('src/assets/icon-crystal-blue-diamond.png', 'icon-crystal-blue-diamond.png'),
    ('src/assets/icon-cash-package.png', 'icon-cash-package.png'),
    ('src/assets/icon-safira-verde.png', 'icon-safira-verde.png'),
    ('src/assets/items/icon-crystal-red.png', 'icon-crystal-red.png')
]

project_id = 'b1ac3029-d58f-4a0f-841e-3954421931d9'

for path, filename in assets:
    dir_name = os.path.dirname(path)
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name, exist_ok=True)
    
    json_path = path + '.asset.json'
    if not os.path.exists(path):
        with open(path, 'wb') as f:
            f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
    
    data = {
        'version': 1,
        'project_id': project_id,
        'url': f'/assets/{filename}', # Use local path for placeholder if needed, but let's keep consistency
        'original_filename': filename,
        'content_type': 'image/png'
    }
    
    # Se ja existe um .asset.json, vamos apenas garantir que o project_id está correto
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r') as f:
                existing = json.load(f)
            existing['project_id'] = project_id
            # Se a URL não começar com /__l5e/, o assetUrlFromJson retornará a URL bruta.
            # Se começar, ele tentará usar o project_id.
            with open(json_path, 'w') as f:
                json.dump(existing, f, indent=2)
        except:
            with open(json_path, 'w') as f:
                json.dump(data, f, indent=2)
    else:
        with open(json_path, 'w') as f:
            json.dump(data, f, indent=2)

print("Done")
