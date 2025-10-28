# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from __future__ import annotations

import json
from datetime import datetime, timezone

from firebase_admin import initialize_app
from firebase_functions import https_fn
from firebase_functions.options import set_global_options

# Constrain the number of warm containers so unexpected spikes do not fan out costs.
set_global_options(max_instances=10)

# Initialize the Admin SDK once when the function container boots.
initialize_app()


@https_fn.on_request()
def ping(request: https_fn.Request) -> https_fn.Response:
  """Basic health-check endpoint for monitoring or local smoke tests."""
  if request.method not in ("GET", "HEAD"):
    return https_fn.Response("Method Not Allowed", status=405)

  payload = {
      "status": "ok",
      "timestamp": datetime.now(timezone.utc).isoformat(),
  }

  return https_fn.Response(
      json.dumps(payload),
      status=200,
      headers={
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
      },
  )
