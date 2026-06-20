import uvicorn
import os
import sys

# Always run from this file's own directory so 'app' module is importable
# regardless of which directory the user launches from
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
sys.path.insert(0, HERE)

if __name__ == "__main__":
    print(f"Starting backend from: {HERE}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
