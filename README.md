# Image to 3D Converter

Transform any 2D image into a 3D model in seconds.

https://github.com/user-attachments/assets/789f8633-9e71-40a8-b4e8-8d91cec9c3d7

---

## What It Does

Image to 3D Converter uses deep learning to transform ordinary photos into 3D models. Upload an image, and AI analyzes depth and structure to generate a downloadable 3D model.

- **Single Image Input** — No multiple angles needed, just one photo
- **AI Depth Analysis** — Neural network estimates depth from 2D image
- **Real-time Preview** — Rotate and explore your 3D model in browser
- **Instant Download** — Export as GLB format for Blender, Unity, or web

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+

### Installation & Setup

```bash
# Clone the repo first
cd image-to-3d

# Setup & run
make setup
make dev
```

Or manually:

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
npm run dev
```

Then open http://localhost:

---

## Project Structure

```
image-to-3d/
├── frontend/
│   └── src/
│       ├── components/       # UI components (Header, Footer, ModelViewer, etc.)
│       ├── views/            # Page views (Home, Upload, Processing, Result, Error)
│       ├── services/         # API client
│       ├── hooks/            # Custom hooks (useJob, useFileUpload)
│       ├── utils/            # Constants and formatters
│       └── App.jsx           # Main app with state machine
├── backend/
│   └── app/
│       ├── main.py           # FastAPI entry point
│       ├── config.py         # Settings loader
│       ├── api/              # API routes and dependencies
│       ├── models/           # Pydantic models and enums
│       ├── services/         # Core services
│       │   ├── depth_estimator.py   # AI depth prediction
│       │   ├── mesh_generator.py    # 3D mesh creation
│       │   ├── processor.py         # Job orchestration
│       │   ├── queue.py             # Background job queue
│       │   ├── job_service.py       # Job CRUD operations
│       │   └── storage.py           # File storage
│       └── db/               # SQLite database
├── scripts/
│   └── setup.sh
└── Makefile
```

---

## How It Works

1. **Upload** — User uploads a 2D image
2. **Depth Estimation** — Intel DPT model analyzes image and predicts depth map
3. **Mesh Generation** — Depth map converted directly to 3D mesh with texture
4. **Export** — Final model saved as GLB format

---

## Roadmap

- [x] Single image to 3D
- [x] GLB export
- [x] Real-time 3D preview
- [ ] Multi-image photogrammetry (COLMAP)
---

## Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Google Model Viewer

**Backend**
- Python 3.11+
- FastAPI
- Uvicorn
- SQLite

**AI / 3D**
- Intel DPT-Hybrid-MiDaS
- PyTorch
- Transformers
- Trimesh
- NumPy
- Pillow

---

## License





