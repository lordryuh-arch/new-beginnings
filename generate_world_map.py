import requests
import os
import json
import base64
import sys

# O agent-instructions diz que o ambiente Lovable injeta segredos via env se adicionados.
# Se a chave já estiver configurada, podemos tentar ler.
# Mas a forma mais segura de gerar imagem em scripts python no Lovable (conforme browser-use)
# é usar o que estiver disponível. No entanto, o browser-use fala de Playwright.

# Se não conseguirmos usar o ai_gateway diretamente do python facilmente sem a chave exposta,
# podemos usar o DALL-E 3 se o gateway expuser.
# Mas aqui, vou apenas criar um placeholder melhorado em CSS/HTML se a imagem falhar,
# ou usar uma imagem pública de RPG se permitido.

# Vamos tentar usar o fetch com o segredo que deve estar no ambiente.
LOVABLE_API_KEY = os.environ.get("LOVABLE_API_KEY")

def generate_image():
    if not LOVABLE_API_KEY:
        print("LOVABLE_API_KEY not found in environment")
        return False
    
    print("Generating image using Lovable AI Gateway...")
    url = "https://ai.gateway.lovable.dev/v1/images/generations"
    headers = {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY
    }
    data = {
        "model": "google/gemini-3.1-flash-image", # Padrão para imagens
        "prompt": "An epic RPG pixel art world map for a Pokemon-style game. Islands, forests, mountains, deserts, and oceans. Retro 16-bit style, high quality, vibrant colors, clear biomes, top-down view.",
        "n": 1,
        "size": "1024x1024",
        "response_format": "b64_json"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            res_data = response.json()
            b64_data = res_data['data'][0]['b64_json']
            with open("src/assets/world-map-globe.jpg", "wb") as f:
                f.write(base64.b64decode(b64_data))
            print("Successfully generated and saved world map image.")
            return True
        else:
            print(f"Failed to generate image: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    generate_image()
