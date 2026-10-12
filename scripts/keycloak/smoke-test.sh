#!/usr/bin/env bash
# Keycloak smoke test: confirms the realm's OIDC discovery and token
# endpoints work end-to-end. Creates a throwaway, non-product test user via
# the Admin REST API, obtains a token for it via the direct-grant flow,
# asserts the expected realm-role claim is present, then deletes the user.
set -euo pipefail

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${KEYCLOAK_BASE_URL:?KEYCLOAK_BASE_URL must be set (see .env.example)}"
: "${KEYCLOAK_REALM:?KEYCLOAK_REALM must be set (see .env.example)}"
: "${KEYCLOAK_CLIENT_ID:?KEYCLOAK_CLIENT_ID must be set (see .env.example)}"
: "${KEYCLOAK_ADMIN_USER:?KEYCLOAK_ADMIN_USER must be set (see .env.example)}"
: "${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD must be set (see .env.example)}"

TEST_USERNAME="smoke-test-user"
TEST_PASSWORD="$(head -c 32 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 24)"
USER_ID=""

cleanup() {
  if [ -n "$USER_ID" ] && [ -n "${ADMIN_TOKEN:-}" ]; then
    curl -s -o /dev/null -X DELETE \
      -H "Authorization: Bearer ${ADMIN_TOKEN}" \
      "${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${USER_ID}" || true
  fi
}
trap cleanup EXIT

echo "Waiting for the realm discovery endpoint to respond..."
DISCOVERY_URL="${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/.well-known/openid-configuration"
attempts=0
until curl -s -o /dev/null -w "%{http_code}" "$DISCOVERY_URL" | grep -q "200"; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge 30 ]; then
    echo "Timed out waiting for ${DISCOVERY_URL}" >&2
    exit 1
  fi
  sleep 2
done
echo "Discovery endpoint is up."

echo "Obtaining admin token..."
ADMIN_TOKEN="$(curl -s -X POST \
  "${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=${KEYCLOAK_ADMIN_USER}" \
  -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
  -d "grant_type=password" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')"

if [ -z "$ADMIN_TOKEN" ]; then
  echo "Failed to obtain an admin token" >&2
  exit 1
fi

echo "Creating temporary test user..."
curl -s -o /dev/null -X POST \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  "${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users" \
  -d "{\"username\":\"${TEST_USERNAME}\",\"enabled\":true,\"credentials\":[{\"type\":\"password\",\"value\":\"${TEST_PASSWORD}\",\"temporary\":false}]}"

USER_ID="$(curl -s \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  "${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users?username=${TEST_USERNAME}&exact=true" \
  | sed -n 's/.*"id":"\([^"]*\)".*/\1/p' | head -n1)"

if [ -z "$USER_ID" ]; then
  echo "Failed to look up the created test user" >&2
  exit 1
fi

echo "Assigning the employee realm role..."
EMPLOYEE_ROLE="$(curl -s \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  "${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/roles/employee")"

curl -s -o /dev/null -X POST \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  "${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${USER_ID}/role-mappings/realm" \
  -d "[${EMPLOYEE_ROLE}]"

echo "Requesting a token for the test user via the direct-grant flow..."
TOKEN_RESPONSE="$(curl -s -w '\n%{http_code}' -X POST \
  "${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token" \
  -d "client_id=${KEYCLOAK_CLIENT_ID}" \
  -d "username=${TEST_USERNAME}" \
  -d "password=${TEST_PASSWORD}" \
  -d "grant_type=password")"

HTTP_STATUS="$(echo "$TOKEN_RESPONSE" | tail -n1)"
TOKEN_BODY="$(echo "$TOKEN_RESPONSE" | sed '$d')"

if [ "$HTTP_STATUS" != "200" ]; then
  echo "Token request failed with status ${HTTP_STATUS}: ${TOKEN_BODY}" >&2
  exit 1
fi

ACCESS_TOKEN="$(echo "$TOKEN_BODY" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')"
if [ -z "$ACCESS_TOKEN" ]; then
  echo "No access_token in response: ${TOKEN_BODY}" >&2
  exit 1
fi

PAYLOAD="$(echo "$ACCESS_TOKEN" | cut -d'.' -f2)"
PADDED="$(printf '%s' "$PAYLOAD" | awk '{ while (length($0) % 4 != 0) $0 = $0 "="; print }')"
DECODED="$(printf '%s' "$PADDED" | tr '_-' '/+' | base64 -d 2>/dev/null || true)"

if ! echo "$DECODED" | grep -q '"employee"'; then
  echo "Token's realm_access.roles did not include 'employee': ${DECODED}" >&2
  exit 1
fi

echo "Smoke test passed: discovery, token, and role-claim checks all succeeded."
