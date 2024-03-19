import os

from waitress import serve

import app

port = int(os.environ.get("PORT", 5000))

if os.environ.get("LOCAL_HOST") == "true":
    serve(app.app, host="127.0.0.1", port=port)
else:
    serve(app.app, host="0.0.0.0", port=port)
