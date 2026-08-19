import os
import re
import json

def create_placeholders(dir_path):
    if not os.path.exists(dir_path):
        return
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', errors='ignore') as f:
                        content = f.read()
                except:
                    continue
                
                # Match both import ... from "@/assets/..." and import "@/assets/..."
                imports = re.findall(r'\"(@/assets/[^\"]+)\"', content)
                for imp in imports:
                    asset_rel = imp.replace('@/assets/', '')
                    
                    if asset_rel.endswith('.asset.json'):
                        json_path = os.path.join('src/assets', asset_rel)
                        # We also need the base file for Vite to not complain if it's imported without .asset.json elsewhere
                        base_asset = asset_rel[:-11]
                        asset_path = os.path.join('src/assets', base_asset)
                    else:
                        asset_path = os.path.join('src/assets', asset_rel)
                        json_path = asset_path + '.asset.json'
                    
                    os.makedirs(os.path.dirname(asset_path), exist_ok=True)
                    
                    if not os.path.exists(asset_path):
                        with open(asset_path, 'wb') as af:
                            af.write(b'')
                    
                    if (imp.endswith('.asset.json') or '.asset.json' in content) and not os.path.exists(json_path):
                        with open(json_path, 'w') as jf:
                            json.dump({
                                'url': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                                'type': 'image/png' if not asset_rel.lower().endswith(('.mp3', '.wav', '.ogg')) else 'audio/mpeg'
                            }, jf)

create_placeholders('src/components')
create_placeholders('src/routes')
create_placeholders('src/lib')
create_placeholders('src/game')
