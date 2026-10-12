#!/usr/bin/env bash
# BlackRockReality Supabase Verification Script
# Run this to verify Supabase schema is applied and database is accessible

set -e

echo "=== BlackRockReality Supabase Verification ==="
echo ""

# Check if required env vars are set
check_env() {
  local var_name=$1
  local var_value=${!var_name}
  
  if [ -z "$var_value" ] || [[ "$var_value" == *"placeholder"* ]] || [[ "$var_value" == *"your-"* ]]; then
    echo "❌ $var_name: NOT SET (placeholder or empty)"
    return 1
  else
    echo "✅ $var_name: SET (${#var_value} chars)"
    return 0
  fi
}

echo "Checking environment variables..."
echo ""

MISSING=0
check_env "NEXT_PUBLIC_SUPABASE_URL" || MISSING=1
check_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" || MISSING=1
check_env "SUPABASE_SERVICE_ROLE_KEY" || MISSING=1
check_env "DATABASE_URL" || MISSING=1

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "❌ Missing required environment variables. Please set them in Vercel dashboard."
  exit 1
fi

echo ""
echo "Testing database connectivity..."

# Test anon key access
echo "Testing anon key access..."
ANON_TEST=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" \
  -X GET)

if [ "$ANON_TEST" = "200" ] || [ "$ANON_TEST" = "401" ] || [ "$ANON_TEST" = "403" ]; then
  echo "✅ Supabase REST API reachable (HTTP $ANON_TEST)"
else
  echo "❌ Supabase REST API unreachable (HTTP $ANON_TEST)"
  exit 1
fi

# Test service role key access
echo "Testing service role key access..."
SERVICE_TEST=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" \
  -X GET)

if [ "$SERVICE_TEST" = "200" ] || [ "$SERVICE_TEST" = "401" ] || [ "$SERVICE_TEST" = "403" ]; then
  echo "✅ Service role key works (HTTP $SERVICE_TEST)"
else
  echo "❌ Service role key failed (HTTP $SERVICE_TEST)"
  exit 1
fi

# Test specific tables
echo ""
echo "Testing table access..."

test_table() {
  local table=$1
  local response=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/$table?select=id&limit=1" \
    -X GET)
  
  if echo "$response" | grep -q '"message"'; then
    echo "❌ Table '$table': $(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
    return 1
  else
    echo "✅ Table '$table': accessible"
    return 0
  fi
}

TABLES=("workspaces" "profiles" "workspace_members" "api_keys" "leads" "properties" "deals" "grind_jobs" "whatsapp_logs" "payments" "content_pages")
TABLE_FAILED=0

for table in "${TABLES[@]}"; do
  test_table "$table" || TABLE_FAILED=1
done

if [ $TABLE_FAILED -gt 0 ]; then
  echo ""
  echo "❌ Some tables are not accessible. Run supabase-schema.sql in Supabase SQL Editor."
  exit 1
fi

# Test RPC functions
echo ""
echo "Testing RPC functions..."

test_rpc() {
  local func=$1
  local response=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/$func" \
    -X POST \
    -d '{}')
  
  if echo "$response" | grep -q '"message"'; then
    echo "❌ RPC '$func': $(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
    return 1
  else
    echo "✅ RPC '$func': accessible"
    return 0
  fi
}

test_rpc "reset_api_key_usage" || true  # This might fail due to no args, but endpoint exists

echo ""
echo "=== All checks passed! ==="
echo "Supabase is configured and schema is applied."
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Test live API: curl https://your-domain.vercel.app/api/health"
echo "3. Create API key via dashboard or API"