"""
Mesh Generator: Convert depth map + image to 3D GLB
"""
import numpy as np
from pathlib import Path
from PIL import Image
import trimesh


class MeshGenerator:
    """Generate 3D mesh from depth map and texture."""
    
    def __init__(self, depth_scale: float = 0.3, max_faces: int = 100000):
        self.depth_scale = depth_scale
        self.max_faces = max_faces
    
    def generate(
        self,
        image_path: Path,
        depth_map: np.ndarray,
        output_path: Path
    ) -> Path:
        """
        Generate a GLB file from image and depth map.
        """
        image = Image.open(image_path).convert('RGB')
        
        # Resize (limit to 512x512)
        max_size = 512
        h, w = depth_map.shape
        
        if max(h, w) > max_size:
            scale = max_size / max(h, w)
            new_w = int(w * scale)
            new_h = int(h * scale)
            
            image = image.resize((new_w, new_h), Image.LANCZOS)
            depth_map = np.array(Image.fromarray(depth_map).resize((new_w, new_h), Image.BILINEAR))
            h, w = new_h, new_w
        else:
            image = image.resize((w, h), Image.LANCZOS)
        
        print(f"Mesh resolution: {w}x{h}")
        
        # Normalize depth
        depth_min = depth_map.min()
        depth_max = depth_map.max()
        if depth_max - depth_min > 0:
            depth_normalized = (depth_map - depth_min) / (depth_max - depth_min)
        else:
            depth_normalized = np.zeros_like(depth_map)
        
        # Create vertex grid
        x = np.linspace(-1, 1, w)
        y = np.linspace(-1, 1, h)
        xx, yy = np.meshgrid(x, y)
        
        # Z from depth (inverted so closer = higher)
        zz = (1 - depth_normalized) * self.depth_scale
        
        vertices = np.stack([xx.flatten(), -yy.flatten(), zz.flatten()], axis=1)
        
        # Create faces (two triangles per quad)
        faces = []
        for i in range(h - 1):
            for j in range(w - 1):
                v0 = i * w + j
                v1 = v0 + 1
                v2 = v0 + w
                v3 = v2 + 1
                faces.append([v0, v2, v1])
                faces.append([v1, v2, v3])
        
        faces = np.array(faces)
        print(f"Created mesh with {len(vertices)} vertices and {len(faces)} faces")
        
        # UV coordinates
        u = np.linspace(0, 1, w)
        v = np.linspace(0, 1, h)
        uu, vv = np.meshgrid(u, v)
        uv = np.stack([uu.flatten(), 1 - vv.flatten()], axis=1)
        
        # texture material
        texture_image = np.array(image)
        
        material = trimesh.visual.material.PBRMaterial(
            baseColorTexture=Image.fromarray(texture_image),
            metallicFactor=0.0,
            roughnessFactor=0.8
        )
        
        # textured visual
        visuals = trimesh.visual.TextureVisuals(uv=uv, material=material)
        
        mesh = trimesh.Trimesh(
            vertices=vertices,
            faces=faces,
            visual=visuals,
            process=False
        )
        
        # simplify mesh if we have too many faces
        if len(faces) > self.max_faces:
            try:
                print(f"Simplifying mesh from {len(faces)} to {self.max_faces} faces...")
                mesh = mesh.simplify_quadric_decimation(self.max_faces)
                print(f"Simplified to {len(mesh.faces)} faces")
            except Exception as e:
                print(f"Simplification skipped: {e}")
        
        # Export to GLB
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        mesh.export(str(output_path), file_type='glb')
        print(f"Exported GLB: {output_path} ({output_path.stat().st_size} bytes)")
        
        return output_path


def create_mesh_generator(depth_scale: float = 0.3, max_faces: int = 100000) -> MeshGenerator:
    """Factory function to create a mesh generator."""
    return MeshGenerator(depth_scale=depth_scale, max_faces=max_faces)
