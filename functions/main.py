# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from typing import Any, Dict

import requests
from dotenv import load_dotenv
from firebase_admin import initialize_app
from firebase_functions import https_fn
from firebase_functions.options import set_global_options

# Constrain the number of warm containers so unexpected spikes do not fan out costs.
set_global_options(max_instances=10)

# Initialize the Admin SDK once when the function container boots.
initialize_app()
load_dotenv()  # load local .env values when running in the emulator

_BUMPUPS_API_URL = "https://api.bumpups.com/general/timestamps"
_YOUTUBE_URL_REGEX = re.compile(
    r"^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/)([\w-]{11})([&?#].*)?$",
    re.IGNORECASE,
)


def _require_api_key() -> str:
  api_key = os.environ.get("BUMPUPS_API_KEY")
  if not api_key:
    logging.error("BUMPUPS_API_KEY environment variable is not set.")
    raise https_fn.HttpsError(
        code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
        message="Server misconfiguration. Please contact support.",
    )
  return api_key


def _validate_input(data: Dict[str, Any]) -> str:
  url = (data or {}).get("url")
  if not isinstance(url, str) or not url.strip():
    raise https_fn.HttpsError(
        code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
        message="Expected data.url to be a non-empty string.",
    )

  cleaned_url = url.strip()
  if not _YOUTUBE_URL_REGEX.match(cleaned_url):
    raise https_fn.HttpsError(
        code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
        message="The supplied URL must be a valid YouTube video link.",
    )
  return cleaned_url


@https_fn.on_request()
def ping(request: https_fn.Request) -> https_fn.Response:
  """Basic health-check endpoint for monitoring or local smoke tests."""
  logging.info("Ping function invoked with method=%s path=%s", request.method, request.path)
  if request.method not in ("GET", "HEAD"):
    logging.warning("Ping function rejected method %s", request.method)
    return https_fn.Response("Method Not Allowed", status=405)

  payload = {
      "status": "ok",
      "timestamp": datetime.now(timezone.utc).isoformat(),
  }

  logging.debug("Ping payload: %s", payload)

  return https_fn.Response(
      json.dumps(payload),
      status=200,
      headers={
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
      },
  )


@https_fn.on_call()
def generate_timestamps(request: https_fn.CallableRequest) -> Dict[str, Any]:
  """Proxy the Bumpups timestamp API behind Firebase callable functions."""
  logging.info("generate_timestamps invoked by uid=%s", request.auth.uid if request.auth else "anonymous")
  api_key = _require_api_key()
  video_url = _validate_input(request.data or {})
  logging.debug("generate_timestamps payload validated for url=%s", video_url)

  body = {
      "url": video_url,
      "model": "bump-1.0",
      "language": "en",
      "timestamps_style": "long",
  }

  try:
    response = requests.post(
        _BUMPUPS_API_URL,
        headers={
            "Content-Type": "application/json",
            "X-Api-Key": api_key,
        },
        json=body,
        timeout=30,
    )
  except requests.RequestException as exc:
    logging.exception("Bumpups API request failed: %s", exc)
    raise https_fn.HttpsError(
        code=https_fn.FunctionsErrorCode.UNAVAILABLE,
        message="Failed to reach the timestamp service. Try again later.",
    ) from exc

  if response.status_code >= 400:
    logging.error(
        "Bumpups API error: status=%s body=%s",
        response.status_code,
        response.text,
    )
    raise https_fn.HttpsError(
        code=https_fn.FunctionsErrorCode.INTERNAL,
        message="Timestamp generation failed.",
    )

  payload = response.json()
  logging.info(
      "generate_timestamps completed successfully url=%s, entries=%s",
      video_url,
      len(payload.get("timestamps_list", [])),
  )
  return {
      "timestamps_list": payload.get("timestamps_list", []),
      "timestamps_string": payload.get("timestamps_string", ""),
      "video_duration": payload.get("video_duration"),
      "raw": payload,
  }
