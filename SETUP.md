# CraveFit — Setup Guide

## Prerequisites

Install Node.js (v20+):
```bash
# macOS — recommended via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20
```

## 1. Start the backend

```bash
cd backend
npm install
npm run dev          # starts on http://localhost:3000
```

Health check: `curl http://localhost:3000/health`

## 2. Start the app (Expo)

```bash
cd app
npm install
npx expo start       # scan QR with Expo Go app on your phone
```

For iOS simulator: `npx expo start --ios`  
For Android: `npx expo start --android`

**Important:** If testing on a physical device, change the `BASE_URL` in
`app/src/services/api.js` from `localhost` to your Mac's local IP address
(e.g. `192.168.1.10`).

---

## API Reference

### Onboard a user
```
POST /api/users/onboard
{
  "name": "Priya",
  "weightKg": 65,
  "heightCm": 162,
  "ageYears": 26,
  "sex": "female",
  "activityLevel": "moderate",
  "goal": "cut",
  "diet": "vegetarian"
}
```
Returns: `{ userId, user, weekPlan }`

### Get weekly plan
```
GET /api/plan/:userId
```

### Log a craving and rebalance
```
POST /api/plan/:userId/craving
{
  "foodId": "f063",   // biryani — or pass a custom food object
  "dayIndex": 2       // 0=Monday, 6=Sunday
}
```

### Search foods
```
GET /api/foods?q=biryani
GET /api/foods?category=Cheat
```

### Regenerate plan
```
POST /api/plan/:userId/regenerate
```

---

## Quick curl test (after backend is running)

```bash
# 1. Onboard
USER=$(curl -s -X POST http://localhost:3000/api/users/onboard \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","weightKg":72,"heightCm":175,"ageYears":28,"sex":"male","activityLevel":"moderate","goal":"cut","diet":"non_vegetarian"}')

echo $USER | python3 -m json.tool | head -20

# Extract userId from response
UID=$(echo $USER | python3 -c "import sys,json; print(json.load(sys.stdin)['userId'])")

# 2. Log a craving (McSpicy burger on Wednesday)
curl -s -X POST http://localhost:3000/api/plan/$UID/craving \
  -H "Content-Type: application/json" \
  -d '{"foodId":"f061","dayIndex":2}' | python3 -m json.tool
```
