import subprocess
import os
import sys
import time

def run_backend():
    print("[1/2] Starting FastAPI backend on :8001 ...")
    backend_dir = os.path.join(os.path.dirname(__file__), "doc_verify")
    # Use the current Python executable to run the backend
    process = subprocess.Popen(
        [sys.executable, "run.py"],
        cwd=backend_dir,
        stdout=sys.stdout,
        stderr=sys.stderr,
    )
    return process

def run_frontend():
    print("[2/2] Starting Vite frontend on :5173 ...")
    # Use 'npm.cmd' on Windows to avoid 'file not found' errors
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_dir = os.path.dirname(__file__)
    process = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir,
        stdout=sys.stdout,
        stderr=sys.stderr,
    )
    return process

if __name__ == "__main__":
    print("\n==========================================")
    print("  Document Verification - Full Stack Start  ")
    print("==========================================\n")
    
    backend_proc = None
    frontend_proc = None
    
    try:
        backend_proc = run_backend()
        # Give the backend a second to initialize before starting frontend
        time.sleep(1)
        frontend_proc = run_frontend()
        
        print("\n✅ Both servers are running successfully!")
        print("   Frontend -> http://localhost:5173")
        print("   Backend  -> http://localhost:8001")
        print("   API Docs -> http://localhost:8001/docs\n")
        print("Press Ctrl+C to stop both servers gracefully.\n")
        print("-" * 42 + "\n")
        
        # Keep the script running to stream logs to the terminal
        backend_proc.wait()
        frontend_proc.wait()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        print("Servers stopped.")
        sys.exit(0)
