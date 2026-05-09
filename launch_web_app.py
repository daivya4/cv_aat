import subprocess
import time
import os
import sys

def run_backend():
    print("Starting backend server (FastAPI)...")
    return subprocess.Popen([sys.executable, "backend/main.py"], shell=True)

def run_frontend():
    print("Starting frontend server (Vite)...")
    # Using shell=True for npm command
    return subprocess.Popen(["npm", "run", "dev"], cwd="frontend", shell=True)

if __name__ == "__main__":
    try:
        backend_proc = run_backend()
        time.sleep(2) # Give backend a moment to start
        frontend_proc = run_frontend()
        
        print("\n" + "="*50)
        print("Web App is launching!")
        print("Backend: http://localhost:8000")
        print("Frontend: http://localhost:5173")
        print("="*50 + "\n")
        
        print("Press Ctrl+C to stop both servers.")
        
        # Keep the script running
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Servers stopped.")
